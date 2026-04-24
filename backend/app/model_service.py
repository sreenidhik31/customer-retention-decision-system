from __future__ import annotations

import joblib
import pandas as pd
from pathlib import Path
from typing import Any


def get_risk_segment(prob: float) -> str:
    if prob < 0.3:
        return "SAFE"
    elif prob < 0.6:
        return "AT_RISK"
    return "HIGH_RISK"


def get_retention_priority(prob: float) -> str:
    if prob < 0.3:
        return "LOW"
    elif prob < 0.6:
        return "MEDIUM"
    return "HIGH"


def get_recommended_action(segment: str) -> str:
    if segment == "SAFE":
        return "NO_ACTION"
    elif segment == "AT_RISK":
        return "TARGETED_OFFER"
    return "RETENTION_CALL"


class ChurnService:
    def __init__(self) -> None:
        base_dir = Path(__file__).resolve().parent.parent
        model_path = base_dir / "models" / "churn_model.joblib"
        self.model = joblib.load(model_path)

    def _make_input_df(self, data: dict[str, Any]) -> pd.DataFrame:
        return pd.DataFrame([data])

    def _build_reasons(self, data: dict[str, Any], prob: float) -> list[str]:
        reasons: list[str] = []

        if data.get("Contract") == "Month-to-month":
            reasons.append("Flexible month-to-month contract increases churn risk.")
        elif data.get("Contract") == "One year":
            reasons.append("One-year contract provides moderate retention stability.")
        elif data.get("Contract") == "Two year":
            reasons.append("Longer contract term generally lowers churn risk.")

        if data.get("TechSupport") == "No":
            reasons.append("No tech support may reduce retention and satisfaction.")

        if data.get("OnlineSecurity") == "No":
            reasons.append("Lack of online security is associated with higher churn.")

        if data.get("InternetService") == "Fiber optic":
            reasons.append("Fiber optic customers can be more price-sensitive in this segment.")

        if data.get("PaymentMethod") == "Electronic check":
            reasons.append("Electronic check customers often show higher churn patterns.")

        if float(data.get("tenure", 0) or 0) < 12:
            reasons.append("Short-tenure customers tend to churn more often.")

        if float(data.get("MonthlyCharges", 0) or 0) > 80:
            reasons.append("Higher monthly charges can increase cancellation risk.")

        if prob >= 0.6:
            reasons.append("Overall risk score is high enough to justify immediate retention action.")
        elif prob >= 0.3:
            reasons.append("Overall risk score suggests proactive intervention may be worthwhile.")
        else:
            reasons.append("Overall risk score suggests the customer is relatively stable.")

        seen = set()
        clean_reasons: list[str] = []

        for reason in reasons:
            if reason not in seen:
                clean_reasons.append(reason)
                seen.add(reason)

        return clean_reasons[:6]

    def predict_one(self, data: dict[str, Any]) -> dict[str, Any]:
        x = self._make_input_df(data)
        prob = float(self.model.predict_proba(x)[0][1])

        risk_segment = get_risk_segment(prob)
        retention_priority = get_retention_priority(prob)
        recommended_action = get_recommended_action(risk_segment)

        monthly_revenue = float(data.get("MonthlyCharges", 0) or 0)
        expected_revenue = monthly_revenue * 2

        baseline_loss = round(prob * expected_revenue, 2)

        if recommended_action == "NO_ACTION":
            intervention_cost = 0.0
        elif recommended_action == "TARGETED_OFFER":
            intervention_cost = round(monthly_revenue * 0.08, 2)
        else:
            intervention_cost = round((monthly_revenue * 0.12) + 12.0, 2)

        expected_save = round(baseline_loss * 1.2, 2)
        intervention_value = round(expected_save - intervention_cost, 2)
        net_value = intervention_value
        roi = round(expected_save / intervention_cost, 2) if intervention_cost > 0 else 0.0

        reasons = self._build_reasons(data, prob)

        return {
            "churn_probability": round(prob, 4),
            "risk_segment": risk_segment,
            "retention_priority": retention_priority,
            "recommended_action": recommended_action,
            "intervention_cost": intervention_cost,
            "expected_save": expected_save,
            "baseline_loss": baseline_loss,
            "intervention_value": intervention_value,
            "net_value": net_value,
            "roi": roi,
            "reasons": reasons,
        }

    def simulate_campaign(
        self,
        customers: list[dict[str, Any]],
        threshold: float = 0.5,
        retention_uplift: float = 0.2,
        discount_rate: float = 0.1,
    ) -> dict[str, Any]:
        total_customers = len(customers)
        targeted_customers = 0
        total_cost = 0.0
        total_expected_save = 0.0

        for customer in customers:
            x = self._make_input_df(customer)
            prob = float(self.model.predict_proba(x)[0][1])

            if prob >= threshold:
                targeted_customers += 1

                monthly_revenue = float(customer.get("MonthlyCharges", 0) or 0)
                expected_revenue = monthly_revenue * 2
                baseline_loss = prob * expected_revenue

                expected_save = round(baseline_loss * (1 + retention_uplift), 2)
                cost = round(monthly_revenue * discount_rate, 2)

                total_expected_save += expected_save
                total_cost += cost

        net_value = round(total_expected_save - total_cost, 2)
        roi = round(total_expected_save / total_cost, 2) if total_cost > 0 else 0.0

        return {
            "total_customers": total_customers,
            "targeted_customers": targeted_customers,
            "total_cost": round(total_cost, 2),
            "total_expected_save": round(total_expected_save, 2),
            "net_value": net_value,
            "roi": roi,
        }