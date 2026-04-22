from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "churn_model.joblib"


class ChurnService:
    def __init__(self, model_path: Path = MODEL_PATH) -> None:
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        self.pipeline = joblib.load(model_path)

    @staticmethod
    def get_retention_decision(prob: float) -> tuple[str, str]:
        if prob >= 0.75:
            return "HIGH_RISK", "RETENTION_CALL"
        if prob >= 0.45:
            return "AT_RISK", "TARGETED_OFFER"
        return "SAFE", "NO_ACTION"

    @staticmethod
    def estimate_retention_impact(row: pd.Series, action: str) -> tuple[float, float, float, float]:
        monthly_charge = float(row.get("MonthlyCharges", 0.0))

        if action == "RETENTION_CALL":
            intervention_cost = 20.0
            expected_save = monthly_charge * 3.0
        elif action == "TARGETED_OFFER":
            intervention_cost = monthly_charge * 0.15
            expected_save = monthly_charge * 2.0
        else:
            intervention_cost = 0.0
            expected_save = 0.0

        net_value = expected_save - intervention_cost
        roi = (net_value / intervention_cost) if intervention_cost > 0 else 0.0
        return intervention_cost, expected_save, net_value, roi

    @staticmethod
    def recommend_actions(row: pd.Series, churn_prob: float) -> list[str]:
        actions: list[str] = []

        if churn_prob >= 0.60:
            actions.append("Offer a 15–20% discount for 2–3 months.")
        elif churn_prob >= 0.45:
            actions.append("Offer a smaller incentive (5–10%) or loyalty add-on.")

        if str(row.get("Contract", "")).lower().startswith("month"):
            actions.append("Promote upgrade to a 1-year contract with a bundled deal.")

        if row.get("TechSupport", "") == "No":
            actions.append("Provide a free Tech Support trial for 1 month.")

        if row.get("OnlineSecurity", "") == "No":
            actions.append("Bundle Online Security add-on or free trial.")

        if row.get("InternetService", "") == "Fiber optic":
            actions.append("Check service quality or outages and offer priority support.")

        if row.get("PaymentMethod", "") == "Electronic check":
            actions.append("Encourage auto-pay with a small reward.")

        if float(row.get("MonthlyCharges", 0.0)) > 80:
            actions.append("Offer a plan review to reduce price friction.")

        if not actions:
            actions.append("Maintain standard engagement; no strong churn signals detected.")

        return actions

    def predict_one(self, payload: dict[str, Any]) -> dict[str, Any]:
        row_df = pd.DataFrame([payload])
        prob = float(self.pipeline.predict_proba(row_df)[0, 1])

        row = row_df.iloc[0]
        risk_segment, recommended_action = self.get_retention_decision(prob)
        intervention_cost, expected_save, net_value, roi = self.estimate_retention_impact(
            row, recommended_action
        )
        reasons = self.recommend_actions(row, prob)

        return {
            "churn_probability": prob,
            "risk_segment": risk_segment,
            "recommended_action": recommended_action,
            "intervention_cost": intervention_cost,
            "expected_save": expected_save,
            "net_value": net_value,
            "roi": roi,
            "reasons": reasons,
        }

    def simulate_campaign(
        self,
        customers: list[dict[str, Any]],
        threshold: float,
        retention_uplift: float,
        discount_rate: float,
    ) -> dict[str, Any]:
        if not customers:
            return {
                "targeted_customers": 0,
                "expected_retained": 0,
                "gross_revenue_preserved": 0.0,
                "offer_discount_cost": 0.0,
                "intervention_cost_total": 0.0,
                "estimated_net_impact": 0.0,
                "estimated_roi": 0.0,
            }

        df = pd.DataFrame(customers)
        probs = self.pipeline.predict_proba(df)[:, 1]
        df["churn_probability"] = probs

        targeted = df[df["churn_probability"] >= threshold].copy()

        if targeted.empty:
            return {
                "targeted_customers": 0,
                "expected_retained": 0,
                "gross_revenue_preserved": 0.0,
                "offer_discount_cost": 0.0,
                "intervention_cost_total": 0.0,
                "estimated_net_impact": 0.0,
                "estimated_roi": 0.0,
            }

        intervention_cost_total = 0.0
        for _, row in targeted.iterrows():
            _, action = self.get_retention_decision(float(row["churn_probability"]))
            cost, _, _, _ = self.estimate_retention_impact(row, action)
            intervention_cost_total += cost

        expected_retained = int(len(targeted) * retention_uplift)
        gross_revenue_preserved = float(targeted["MonthlyCharges"].sum() * retention_uplift)
        offer_discount_cost = float(targeted["MonthlyCharges"].sum() * retention_uplift * discount_rate)
        estimated_net_impact = gross_revenue_preserved - offer_discount_cost - intervention_cost_total
        estimated_roi = (
            estimated_net_impact / intervention_cost_total
            if intervention_cost_total > 0 else 0.0
        )

        return {
            "targeted_customers": int(len(targeted)),
            "expected_retained": expected_retained,
            "gross_revenue_preserved": gross_revenue_preserved,
            "offer_discount_cost": offer_discount_cost,
            "intervention_cost_total": intervention_cost_total,
            "estimated_net_impact": estimated_net_impact,
            "estimated_roi": estimated_roi,
        }