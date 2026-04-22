from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model_service import ChurnService
from app.schemas import (
    CampaignRequest,
    CampaignResponse,
    CustomerInput,
    HealthResponse,
    RetentionRecommendation,
)

app = FastAPI(title="Customer Retention Decision API", version="1.0.0")
service = ChurnService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/predict", response_model=RetentionRecommendation)
def predict(payload: CustomerInput) -> RetentionRecommendation:
    result = service.predict_one(payload.model_dump())
    return RetentionRecommendation(**result)


@app.post("/campaign", response_model=CampaignResponse)
def campaign(payload: CampaignRequest) -> CampaignResponse:
    result = service.simulate_campaign(
        customers=[customer.model_dump() for customer in payload.customers],
        threshold=payload.threshold,
        retention_uplift=payload.retention_uplift,
        discount_rate=payload.discount_rate,
    )
    return CampaignResponse(**result)