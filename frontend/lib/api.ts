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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function predictCustomer(
  payload: CustomerInput
): Promise<PredictionResponse> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const response = await fetch(`${API_BASE_URL}/predict`, {
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