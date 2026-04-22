from typing import List, Literal, Optional
from pydantic import BaseModel, Field


RiskSegment = Literal["SAFE", "AT_RISK", "HIGH_RISK"]
RecommendedAction = Literal["NO_ACTION", "TARGETED_OFFER", "RETENTION_CALL"]


class CustomerInput(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int = Field(ge=0)
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float = Field(ge=0)
    TotalCharges: float = Field(ge=0)


class RetentionRecommendation(BaseModel):
    churn_probability: float
    risk_segment: RiskSegment
    recommended_action: RecommendedAction
    intervention_cost: float
    expected_save: float
    net_value: float
    roi: float
    reasons: List[str]


class CampaignRequest(BaseModel):
    customers: List[CustomerInput]
    threshold: float = Field(ge=0.0, le=1.0, default=0.60)
    retention_uplift: float = Field(ge=0.0, le=1.0, default=0.25)
    discount_rate: float = Field(ge=0.0, le=1.0, default=0.20)


class CampaignResponse(BaseModel):
    targeted_customers: int
    expected_retained: int
    gross_revenue_preserved: float
    offer_discount_cost: float
    intervention_cost_total: float
    estimated_net_impact: float
    estimated_roi: float


class HealthResponse(BaseModel):
    status: str