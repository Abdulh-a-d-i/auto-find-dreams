import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import CarGrid from "@/components/CarGrid";
import RecommendedCars from "@/components/RecommendedCars";
import FindMyCarForm from "@/components/FindMyCarForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SearchFilters />
        
        {/* Find My Car Section */}
        <section className="py-12 bg-gradient-to-r from-primary/10 via-background to-secondary/10 rounded-lg my-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Tell us your dream car specifications and we'll help you find it!
            </p>
            <FindMyCarForm />
          </div>
        </section>
        
        <CarGrid />
      </main>
      
      {/* Recommended Cars Section */}
      <RecommendedCars />
      
      <Footer />
    </div>
  );
};

export default Index;
