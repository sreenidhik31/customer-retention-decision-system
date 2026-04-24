"use client";

import { PredictionResponse } from "../lib/api";

type Props = {
  result: PredictionResponse;
};

export default function ResultCard({ result }: Props) {
  const prob = result.churn_probability;
  const percent = (prob * 100).toFixed(1);

  const priority = result.retention_priority;

  const priorityColor =
    priority === "HIGH"
      ? "#ef4444"
      : priority === "MEDIUM"
      ? "#f59e0b"
      : "#22c55e";

  const message =
    priority === "HIGH"
      ? "🚨 High churn risk — immediate retention action required"
      : priority === "MEDIUM"
      ? "⚠️ Moderate risk — targeted intervention recommended"
      : "✅ Low risk — no immediate action needed";

  const decisionText =
    priority === "HIGH"
      ? "This customer is in a high-risk churn zone. Retention action is economically justified based on projected value recovery."
      : priority === "MEDIUM"
      ? "This customer shows meaningful churn risk. A targeted offer can reduce revenue loss while keeping intervention cost controlled."
      : "This customer is currently stable. No immediate intervention is economically required.";

  const displayAction =
    result.recommended_action === "NO_ACTION"
      ? "Monitor Customer"
      : formatText(result.recommended_action);

  const showMoney = (value: number) => (value > 0 ? `$${value.toFixed(0)}` : "—");
  const showRoi = (value: number) => (value > 0 ? `${value.toFixed(2)}x` : "—");

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
      <p className="eyebrow">Decision Output</p>

      <h2 style={{ marginTop: "6px" }}>Retention Decision Summary</h2>

      <div style={{ marginTop: "1.2rem" }}>
        <p style={{ marginBottom: "4px", fontWeight: 700 }}>
          Churn Probability Gauge
        </p>

        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
          {percent}%
        </p>

        <div
          style={{
            height: "10px",
            borderRadius: "999px",
            background: "#e5e7eb",
            marginTop: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #22c55e, #eab308, #ef4444)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginTop: "6px",
            color: "#64748b",
          }}
        >
          <span>Low Risk</span>
          <span>Moderate</span>
          <span>High Risk</span>
        </div>

        <p style={{ marginTop: "12px", color: "#475569", fontWeight: 600 }}>
          {message}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "1.5rem",
        }}
      >
        <MetricCard
          label="Retention Priority"
          value={priority}
          color={priorityColor}
          highlight
        />
        <MetricCard label="Risk Segment" value={formatText(result.risk_segment)} />
        <MetricCard label="Projected ROI" value={showRoi(result.roi)} />

        <MetricCard label="Loss Without Action" value={showMoney(result.baseline_loss)} />
        <MetricCard label="Value With Action" value={showMoney(result.intervention_value)} />
        <MetricCard label="Expected Save" value={showMoney(result.expected_save)} />

        <MetricCard label="Net Value" value={showMoney(result.net_value)} />
        <MetricCard label="Intervention Cost" value={showMoney(result.intervention_cost)} />
      </div>

      <InfoBox title="💡 Business Insight">{decisionText}</InfoBox>

      <InfoBox title="🎯 Recommended Retention Action">
        <strong>{displayAction}</strong>
      </InfoBox>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Decision Drivers</h3>
        <ul>
          {result.reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "14px",
        background: "#ffffff",
        border: highlight ? `1px solid ${color}` : "1px solid #e5e7eb",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.75rem",
          color: "#64748b",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      <h3 style={{ marginTop: "8px", color: color || "#111827" }}>{value}</h3>
    </div>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        borderRadius: "14px",
        background: "rgba(59, 130, 246, 0.08)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: "#334155", lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

function formatText(text: string) {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}