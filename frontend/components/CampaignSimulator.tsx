"use client";

import { useState } from "react";
import { CampaignResponse, CustomerInput, simulateCampaign } from "../lib/api";

type Props = {
  customer: CustomerInput;
};

export default function CampaignSimulator({ customer }: Props) {
  const [threshold, setThreshold] = useState(0.5);
  const [retentionUplift, setRetentionUplift] = useState(0.2);
  const [discountRate, setDiscountRate] = useState(0.1);

  const [result, setResult] = useState<CampaignResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSimulation() {
    setLoading(true);
    setError("");

    try {
      const response = await simulateCampaign({
        customers: [customer],
        threshold,
        retention_uplift: retentionUplift,
        discount_rate: discountRate,
      });

      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Failed to simulate campaign.");
    } finally {
      setLoading(false);
    }
  }

  const strategySummary = `Threshold ${threshold.toFixed(2)} · Uplift ${(
    retentionUplift * 100
  ).toFixed(0)}% · Discount ${(discountRate * 100).toFixed(0)}%`;

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        borderRadius: "20px",
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#3b82f6",
          fontWeight: 700,
        }}
      >
        Business Control Panel
      </p>

      <h2 style={{ marginTop: "6px" }}>Retention Strategy Simulator</h2>

      <p style={{ color: "#475569", marginTop: "4px" }}>
        Test how threshold, uplift, and discount assumptions affect intervention ROI.
      </p>

      <div
        style={{
          marginTop: "14px",
          padding: "12px",
          borderRadius: "12px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1e3a8a",
          fontWeight: 600,
        }}
      >
        Current Strategy: {strategySummary}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "18px",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
            Targeting Threshold: {threshold.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
            Retention Uplift: {(retentionUplift * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={retentionUplift}
            onChange={(e) => setRetentionUplift(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
            Discount Rate: {(discountRate * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.05"
            max="0.3"
            step="0.05"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="button"
          onClick={handleSimulation}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? "Simulating Strategy..." : "Simulate Retention Strategy"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {result && (
        <>
          <div
            style={{
              marginTop: "22px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <MetricCard label="Total Customers" value={String(result.total_customers)} />
            <MetricCard label="Targeted Customers" value={String(result.targeted_customers)} />
            <MetricCard label="Total Cost" value={`$${result.total_cost.toFixed(2)}`} />
            <MetricCard
              label="Expected Save"
              value={`$${result.total_expected_save.toFixed(2)}`}
            />
            <MetricCard label="Net Value" value={`$${result.net_value.toFixed(2)}`} />
            <MetricCard label="ROI" value={`${result.roi.toFixed(2)}x`} />
          </div>

          <div
            style={{
              marginTop: "18px",
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(59, 130, 246, 0.08)",
              border: "1px solid rgba(59, 130, 246, 0.18)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Strategy Interpretation</h3>
            <p style={{ margin: 0, color: "#334155", lineHeight: 1.6 }}>
              {result.net_value > 0
                ? `This strategy is economically justified. At the current settings, ${result.targeted_customers} of ${result.total_customers} customers would be targeted, generating a positive net value of $${result.net_value.toFixed(
                    2
                  )} with an ROI of ${result.roi.toFixed(2)}x.`
                : `This strategy is not currently cost-effective. The selected threshold and discount assumptions do not produce positive net value.`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "14px",
        background: "#ffffff",
        border: "1px solid #dbe3f0",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          color: "#64748b",
          marginBottom: "6px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </p>
      <h4 style={{ margin: 0, fontSize: "1.3rem", color: "#111827" }}>{value}</h4>
    </div>
  );
}