import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Edit, Trash2, Search } from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  body_type: string;
  is_featured: boolean;
  is_visible: boolean;
  dealer_name: string;
  location: string;
}

interface CarsListProps {
  onStatsUpdate: () => void;
}

export function CarsList({ onStatsUpdate }: CarsListProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from("cars")
        .update({ is_visible: !currentVisibility })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(
        !currentVisibility ? "Car is now visible" : "Car is now hidden"
      );
      loadCars();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("cars")
        .update({ is_featured: !currentFeatured })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(
        !currentFeatured ? "Car is now featured" : "Car is no longer featured"
      );
      loadCars();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Car deleted successfully");
      loadCars();
      onStatsUpdate();
    } catch (error) {
      toast.error("Failed to delete car");
    }
  };

  const filteredCars = cars.filter(car =>
    `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCars.map((car) => (
          <Card key={car.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {car.year} {car.make} {car.model}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {car.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  <Badge variant={car.is_visible ? "default" : "secondary"}>
                    {car.is_visible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
                  <p><strong>Mileage:</strong> {car.mileage?.toLocaleString()} km</p>
                  <p><strong>Transmission:</strong> {car.transmission}</p>
                  <p><strong>Body Type:</strong> {car.body_type}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Dealer:</strong> {car.dealer_name}</p>
                  <p><strong>Location:</strong> {car.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(car.id, car.is_visible)}
                >
                  {car.is_visible ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Show
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleFeatured(car.id, car.is_featured)}
                >
                  {car.is_featured ? "Unfeature" : "Feature"}
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCar(car.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredCars.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No cars found
        </div>
      )}
    </div>
  );
}