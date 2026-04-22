"use client";

import { PredictionResponse } from "../lib/api";

type Props = {
  result: PredictionResponse;
};

export default function ResultCard({ result }: Props) {
  const prob = result.churn_probability;
  const percent = (prob * 100).toFixed(1);

  let priority = "LOW";
  let priorityColor = "#22c55e";

  if (prob > 0.7) {
    priority = "HIGH";
    priorityColor = "#ef4444";
  } else if (prob > 0.4) {
    priority = "MEDIUM";
    priorityColor = "#f59e0b";
  }

  let message = "";
  if (prob > 0.7) {
    message = "🚨 High churn risk — immediate action required";
  } else if (prob > 0.4) {
    message = "⚠️ Moderate risk — targeted intervention recommended";
  } else {
    message = "✅ Low risk — no immediate action needed";
  }

  const displayAction =
    result.recommended_action === "NO_ACTION"
      ? "Monitor Customer"
      : formatText(result.recommended_action);

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        borderRadius: "16px",
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#3b82f6",
          fontWeight: 700
        }}
      >
        Decision Output
      </p>

      <h2 style={{ marginTop: "6px" }}>Prediction Result</h2>

      <div style={{ marginTop: "1.2rem" }}>
        <p style={{ marginBottom: "4px", fontWeight: 600 }}>
          Churn Probability Gauge
        </p>
        <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
          {percent}%
        </p>

        <div
          style={{
            height: "10px",
            borderRadius: "999px",
            background: "#e5e7eb",
            marginTop: "8px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #22c55e, #eab308, #ef4444)"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginTop: "6px",
            color: "#6b7280"
          }}
        >
          <span>Low Risk</span>
          <span>Moderate</span>
          <span>High Risk</span>
        </div>

        <p style={{ marginTop: "10px", color: "#6b7280" }}>{message}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "1.5rem"
        }}
      >
        <Card
          title="Retention Priority"
          value={priority}
          color={priorityColor}
          highlight
        />
        <Card title="Segment" value={formatText(result.risk_segment)} />
        <Card
          title="ROI"
          value={result.roi > 0 ? `${result.roi.toFixed(2)}x` : "—"}
        />

        <Card
          title="Net Value"
          value={result.net_value > 0 ? `$${result.net_value.toFixed(0)}` : "—"}
        />
        <Card
          title="Expected Save"
          value={
            result.expected_save > 0
              ? `$${result.expected_save.toFixed(0)}`
              : "—"
          }
        />
        <Card
          title="Cost"
          value={
            result.intervention_cost > 0
              ? `$${result.intervention_cost.toFixed(0)}`
              : "—"
          }
        />
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          borderRadius: "12px",
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }}
      >
        <strong>💡 Business Insight</strong>
        <p style={{ marginTop: "6px", color: "#374151" }}>
          {prob > 0.7
            ? `This customer is in a high-risk churn zone. Estimated intervention value is about $${result.net_value.toFixed(
                0
              )} in net value with a projected ROI of ${result.roi.toFixed(2)}x.`
            : prob > 0.4
            ? `This customer shows meaningful churn risk. Estimated intervention value is about $${result.net_value.toFixed(
                0
              )} in net value with a projected ROI of ${result.roi.toFixed(2)}x.`
            : "This customer currently appears relatively stable. No immediate intervention value is projected at this time."}
        </p>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          borderRadius: "12px",
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.2)"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#3b82f6",
            fontWeight: 700
          }}
        >
          Recommended Action
        </p>

        <h3 style={{ marginTop: "6px" }}>{displayAction}</h3>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h4>Next Steps</h4>
        <ul>
          {result.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({
  title,
  value,
  color,
  highlight
}: {
  title: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "12px",
        background: "white",
        border: highlight ? `1px solid ${color}` : "1px solid #e5e7eb"
      }}
    >
      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
        {title}
      </p>
      <h3
        style={{
          marginTop: "6px",
          color: color || "#111827"
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function formatText(text: string) {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}