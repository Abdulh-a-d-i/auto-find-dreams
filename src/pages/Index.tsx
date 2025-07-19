import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import CarGrid from "@/components/CarGrid";
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
      
      <Footer />
    </div>
  );
};

export default Index;
