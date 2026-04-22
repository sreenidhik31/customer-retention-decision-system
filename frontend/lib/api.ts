export type CustomerInput = {
  gender: string;
  SeniorCitizen: number;
  Partner: string;
  Dependents: string;
  tenure: number;
  PhoneService: string;
  MultipleLines: string;
  InternetService: string;
  OnlineSecurity: string;
  OnlineBackup: string;
  DeviceProtection: string;
  TechSupport: string;
  StreamingTV: string;
  StreamingMovies: string;
  Contract: string;
  PaperlessBilling: string;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
};

export type PredictionResponse = {
  churn_probability: number;
  risk_segment: "SAFE" | "AT_RISK" | "HIGH_RISK";
  recommended_action: "NO_ACTION" | "TARGETED_OFFER" | "RETENTION_CALL";
  intervention_cost: number;
  expected_save: number;
  net_value: number;
  roi: number;
  reasons: string[];
};

export async function predictCustomer(
  payload: CustomerInput
): Promise<PredictionResponse> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prediction request failed: ${errorText}`);
  }

  return response.json();
}