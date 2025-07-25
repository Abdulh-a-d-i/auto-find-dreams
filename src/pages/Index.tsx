import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import CarGrid from "@/components/CarGrid";
import RecommendedCars from "@/components/RecommendedCars";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SearchFilters />
        <CarGrid />
      </main>
      
      {/* Recommended Cars Section */}
      <RecommendedCars />
      
      <Footer />
    </div>
  );
};

export default Index;
