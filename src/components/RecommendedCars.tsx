import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CarCard from "./CarCard";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  transmission: string | null;
  body_type: string | null;
  fuel_type: string | null;
  engine_size: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  description: string | null;
  images: string[];
  is_featured: boolean | null;
  dealer_name: string | null;
  dealer_phone: string | null;
  dealer_email: string | null;
  location: string | null;
}

interface CarRequest {
  make: string;
  model: string;
  year: number;
  body_type: string | null;
  max_price: number | null;
  max_mileage: number | null;
}

const RecommendedCars = () => {
  const [recommendedCars, setRecommendedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecommendedCars();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendedCars = async () => {
    try {
      // Get user's latest car request
      const { data: requests } = await supabase
        .from('car_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!requests || requests.length === 0) {
        setLoading(false);
        return;
      }

      const latestRequest: CarRequest = requests[0];

      // Build query to find similar cars
      let query = supabase
        .from('cars')
        .select('*')
        .eq('is_visible', true);

      // Filter by make (exact match)
      if (latestRequest.make) {
        query = query.eq('make', latestRequest.make);
      }

      // Filter by model (exact match) or similar year (±2 years)
      if (latestRequest.model) {
        query = query.eq('model', latestRequest.model);
      } else if (latestRequest.year) {
        const yearRange = 2;
        query = query
          .gte('year', latestRequest.year - yearRange)
          .lte('year', latestRequest.year + yearRange);
      }

      // Filter by body type if specified
      if (latestRequest.body_type) {
        query = query.eq('body_type', latestRequest.body_type);
      }

      // Filter by max price if specified
      if (latestRequest.max_price) {
        query = query.lte('price', latestRequest.max_price);
      }

      // Filter by max mileage if specified
      if (latestRequest.max_mileage) {
        query = query.lte('mileage', latestRequest.max_mileage);
      }

      // Limit results and order by featured first, then by date
      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      const { data: cars, error } = await query;

      if (error) throw error;

      setRecommendedCars(cars || []);
    } catch (error) {
      console.error('Error fetching recommended cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (recommendedCars.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Recommended For You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your recent car request, here are some vehicles that might interest you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedCars;