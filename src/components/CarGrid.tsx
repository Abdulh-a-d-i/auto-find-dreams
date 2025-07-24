import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import { supabase } from "@/integrations/supabase/client";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  body_type: string;
  fuel_type: string;
  location: string;
  dealer_name: string;
  is_featured: boolean;
  is_visible: boolean;
}

// Keep sample cars as fallback
const sampleCars = [
  {
    id: "1",
    image: car1,
    title: "2023 Toyota Camry Hybrid",
    year: 2023,
    make: "Toyota",
    model: "Camry Hybrid",
    price: 35999,
    mileage: 12500,
    location: "Toronto, ON",
    bodyType: "Sedan",
    transmission: "CVT",
    fuelType: "Hybrid",
    isNew: false,
    isFeatured: true
  },
  {
    id: "2",
    image: car2,
    title: "2024 BMW M4 Convertible",
    year: 2024,
    make: "BMW",
    model: "M4 Convertible",
    price: 89900,
    mileage: 5200,
    location: "Vancouver, BC",
    bodyType: "Convertible",
    transmission: "Automatic",
    fuelType: "Premium",
    isNew: true,
    isFeatured: true
  },
  {
    id: "3",
    image: car3,
    title: "2023 Mercedes-Benz GLE 350",
    year: 2023,
    make: "Mercedes-Benz",
    model: "GLE 350",
    price: 72500,
    mileage: 18900,
    location: "Calgary, AB",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Premium",
    isNew: false,
    isFeatured: false
  },
  {
    id: "4",
    image: car4,
    title: "2024 Tesla Model 3",
    year: 2024,
    make: "Tesla",
    model: "Model 3",
    price: 54999,
    mileage: 8700,
    location: "Montreal, QC",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Electric",
    isNew: false,
    isFeatured: true
  },
  {
    id: "5",
    image: car1,
    title: "2022 Honda Civic Type R",
    year: 2022,
    make: "Honda",
    model: "Civic Type R",
    price: 48999,
    mileage: 15600,
    location: "Ottawa, ON",
    bodyType: "Hatchback",
    transmission: "Manual",
    fuelType: "Premium",
    isNew: false,
    isFeatured: false
  },
  {
    id: "6",
    image: car2,
    title: "2023 Audi Q7 Premium Plus",
    year: 2023,
    make: "Audi",
    model: "Q7 Premium Plus",
    price: 78900,
    mileage: 22100,
    location: "Edmonton, AB",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Premium",
    isNew: false,
    isFeatured: false
  }
];

interface CarGridProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
}

const CarGrid = ({ 
  title = "Featured Vehicles", 
  subtitle = "Discover our hand-picked selection of premium cars",
  showAll = false,
  limit = 6 
}: CarGridProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_visible", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error("Error loading cars:", error);
      // Use sample data as fallback
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert database cars to display format
  const convertDbCarToDisplayCar = (car: Car, index: number) => {
    const images = [car1, car2, car3, car4];
    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      transmission: car.transmission,
      body_type: car.body_type,
      fuel_type: car.fuel_type || "Gasoline",
      location: car.location || "Toronto, ON",
      images: [images[index % images.length]], // Convert to array
      is_featured: car.is_featured
    };
  };

  const dbCars = cars.map(convertDbCarToDisplayCar);
  
  // Convert sample cars to the new format
  const convertedSampleCars = sampleCars.map(sampleCar => ({
    id: sampleCar.id,
    make: sampleCar.make,
    model: sampleCar.model,
    year: sampleCar.year,
    price: sampleCar.price,
    mileage: sampleCar.mileage,
    transmission: sampleCar.transmission,
    body_type: sampleCar.bodyType,
    fuel_type: sampleCar.fuelType,
    location: sampleCar.location,
    images: [sampleCar.image],
    is_featured: sampleCar.isFeatured
  }));

  const allCars = dbCars.length > 0 ? dbCars : convertedSampleCars;
  const displayCars = showAll ? allCars : allCars.slice(0, limit);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading vehicles...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {displayCars.length} of {allCars.length} vehicles
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="px-3 py-1 rounded-md border border-border bg-background text-foreground">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Year: Newest First</option>
              <option>Mileage: Low to High</option>
            </select>
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* Load More Button */}
        {!showAll && allCars.length > limit && (
          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              View All Vehicles ({allCars.length - limit} more)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarGrid;