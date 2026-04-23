import joblib
import numpy as np


class ChurnService:
    def __init__(self):
        # load your trained pipeline (adjust path if needed)
        self.model = joblib.load("models/churn_model.joblib")

    def predict_one(self, data: dict):
        """
        Core decision engine:
        - Predict probability
        - Convert to risk segment
        - Assign action
        - Compute business metrics
        """

        # Convert input to model format
        X = [data]

        # Get churn probability (class 1 = churn)
        prob = float(self.model.predict_proba(X)[0][1])

        # 🔥 ===== DECISION THRESHOLDS (THIS IS WHAT YOU WANTED) =====
        if prob < 0.3:
            segment = "SAFE"
            priority = "LOW"
            action = "NO_ACTION"
            cost = 0

        elif prob < 0.6:
            segment = "AT_RISK"
            priority = "MEDIUM"
            action = "TARGETED_OFFER"
            cost = 10  # small discount

        else:
            segment = "HIGH_RISK"
            priority = "HIGH"
            action = "RETENTION_CALL"
            cost = 25  # call + incentive

        # 🔥 ===== BUSINESS LOGIC =====
        monthly_revenue = data.get("MonthlyCharges", 0)

        # expected save depends on probability + intervention strength
        expected_save = prob * monthly_revenue * 2  # 2 months retention impact

        net_value = expected_save - cost

        roi = (expected_save / cost) if cost > 0 else 0

        # 🔥 ===== OPTIONAL EXPLANATION (simple version) =====
        reasons = []

        if data.get("Contract") == "Month-to-month":
            reasons.append("High churn risk due to flexible contract")

        if data.get("TechSupport") == "No":
            reasons.append("Lack of tech support increases churn risk")

        if data.get("OnlineSecurity") == "No":
            reasons.append("No online security → higher dissatisfaction")

        if data.get("tenure", 0) < 12:
            reasons.append("Low tenure customers churn more frequently")

        if not reasons:
            reasons.append("General behavioral risk pattern")

        # 🔥 ===== FINAL OUTPUT =====
        return {
            "churn_probability": prob,
            "risk_segment": segment,
            "recommended_action": action,
            "intervention_cost": cost,
            "expected_save": round(expected_save, 2),
            "net_value": round(net_value, 2),
            "roi": round(roi, 2),
            "reasons": reasons,
        }

    def simulate_campaign(
        self,
        customers: list,
        threshold: float = 0.5,
        retention_uplift: float = 0.2,
        discount_rate: float = 0.1,
    ):
        """
        Batch campaign simulation (basic version)
        """

        results = [self.predict_one(c) for c in customers]

        targeted = [r for r in results if r["churn_probability"] >= threshold]

        total_cost = sum(r["intervention_cost"] for r in targeted)
        total_save = sum(r["expected_save"] for r in targeted)

        net_value = total_save - total_cost
        roi = (total_save / total_cost) if total_cost > 0 else 0

        return {
            "total_customers": len(customers),
            "targeted_customers": len(targeted),
            "total_cost": round(total_cost, 2),
            "total_expected_save": round(total_save, 2),
            "net_value": round(net_value, 2),
            "roi": round(roi, 2),
        }