"use client";

import { useState } from "react";
import { CustomerInput, predictCustomer, PredictionResponse } from "../lib/api";
import ResultCard from "./ResultCard";

const initialForm: CustomerInput = {
  gender: "Female",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "Yes",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 89.5,
  TotalCharges: 1074.0
};

export default function CustomerForm() {
  const [formData, setFormData] = useState<CustomerInput>(initialForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await predictCustomer(formData);
      setResult(response);
    } catch (err) {
      setError("Failed to get prediction. Check backend URL and payload.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-grid">
      <form onSubmit={handleSubmit} className="panel form-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Customer Input</p>
            <h2>Retention Scoring</h2>
          </div>
          <span className="pill">Live Decision Preview</span>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Gender</label>
            <select value={formData.gender} onChange={(e) => updateField("gender", e.target.value)}>
              <option>Female</option>
              <option>Male</option>
            </select>
          </div>

          <div className="field">
            <label>Senior Citizen</label>
            <select
              value={formData.SeniorCitizen}
              onChange={(e) => updateField("SeniorCitizen", Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>

          <div className="field">
            <label>Tenure</label>
            <input
              type="number"
              value={formData.tenure}
              onChange={(e) => updateField("tenure", Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Contract</label>
            <select value={formData.Contract} onChange={(e) => updateField("Contract", e.target.value)}>
              <option>Month-to-month</option>
              <option>One year</option>
              <option>Two year</option>
            </select>
          </div>

          <div className="field">
            <label>Internet Service</label>
            <select
              value={formData.InternetService}
              onChange={(e) => updateField("InternetService", e.target.value)}
            >
              <option>DSL</option>
              <option>Fiber optic</option>
              <option>No</option>
            </select>
          </div>

          <div className="field">
            <label>Tech Support</label>
            <select value={formData.TechSupport} onChange={(e) => updateField("TechSupport", e.target.value)}>
              <option>Yes</option>
              <option>No</option>
              <option>No internet service</option>
            </select>
          </div>

          <div className="field">
            <label>Online Security</label>
            <select
              value={formData.OnlineSecurity}
              onChange={(e) => updateField("OnlineSecurity", e.target.value)}
            >
              <option>Yes</option>
              <option>No</option>
              <option>No internet service</option>
            </select>
          </div>

          <div className="field">
            <label>Payment Method</label>
            <select
              value={formData.PaymentMethod}
              onChange={(e) => updateField("PaymentMethod", e.target.value)}
            >
              <option>Electronic check</option>
              <option>Mailed check</option>
              <option>Bank transfer (automatic)</option>
              <option>Credit card (automatic)</option>
            </select>
          </div>

          <div className="field">
            <label>Monthly Charges</label>
            <input
              type="number"
              step="0.01"
              value={formData.MonthlyCharges}
              onChange={(e) => updateField("MonthlyCharges", Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Total Charges</label>
            <input
              type="number"
              step="0.01"
              value={formData.TotalCharges}
              onChange={(e) => updateField("TotalCharges", Number(e.target.value))}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Running Decision Engine..." : "Run Retention Decision"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>

      <div className="side-column">
        <div className="panel mini-panel">
          <p className="eyebrow">Decision System</p>
          <h3>What this app does</h3>
          <ul className="feature-list">
            <li>Predicts churn probability</li>
            <li>Assigns a risk segment</li>
            <li>Recommends retention action</li>
            <li>Estimates cost, save, and ROI</li>
          </ul>
        </div>

        <div className="panel mini-panel accent-panel">
          <p className="eyebrow">Business Framing</p>
          <h3>From prediction to action</h3>
          <p>
            This is a retention decision tool, not just a churn classifier.
            It converts model output into intervention strategy and expected value.
          </p>
        </div>
      </div>

      {result && (
        <div className="result-row">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}