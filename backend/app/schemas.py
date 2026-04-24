from pydantic import BaseModel


class CustomerInput(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
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
    MonthlyCharges: float
    TotalCharges: float


class HealthResponse(BaseModel):
    status: str


class RetentionRecommendation(BaseModel):
    churn_probability: float
    risk_segment: str
    retention_priority: str
    recommended_action: str
    intervention_cost: float
    expected_save: float
    baseline_loss: float
    intervention_value: float
    net_value: float
    roi: float
    reasons: list[str]


class CampaignRequest(BaseModel):
    customers: list[CustomerInput]
    threshold: float = 0.5
    retention_uplift: float = 0.2
    discount_rate: float = 0.1


class CampaignResponse(BaseModel):
    total_customers: int
    targeted_customers: int
    total_cost: float
    total_expected_save: float
    net_value: float
    roi: float