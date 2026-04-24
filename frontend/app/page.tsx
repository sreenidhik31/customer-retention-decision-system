import Hero from "../components/Hero";
import CustomerForm from "../components/CustomerForm";
import CampaignSimulator from "../components/CampaignSimulator";
import { CustomerInput } from "../lib/api";

const defaultCustomer: CustomerInput = {
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
  TotalCharges: 1074.0,
};

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1220, margin: "0 auto", padding: "2rem 1rem" }}>
      <Hero />
      <CustomerForm />
      <CampaignSimulator customer={defaultCustomer} />
    </main>
  );
}