import Hero from "../components/Hero";
import CustomerForm from "../components/CustomerForm";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1220, margin: "0 auto", padding: "2rem 1rem" }}>
      <Hero />
      <CustomerForm />
    </main>
  );
}