import { Heart, MapPin, Calendar, Gauge, Fuel, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CarCardProps {
  id: string;
  image: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  mileage: number;
  location: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const CarCard = ({
  id,
  image,
  title,
  year,
  make,
  model,
  price,
  mileage,
  location,
  bodyType,
  transmission,
  fuelType,
  isNew = false,
  isFeatured = false
}: CarCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-CA').format(mileage);
  };

  return (
    <div className="group bg-gradient-card rounded-xl shadow-card hover:shadow-premium transition-all duration-300 border border-border overflow-hidden">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && <Badge className="bg-primary text-primary-foreground">New</Badge>}
          {isFeatured && <Badge variant="secondary">Featured</Badge>}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {year} {make} {model}
          </h3>
          <p className="text-2xl font-bold text-primary">{formatPrice(price)}</p>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{formatMileage(mileage)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{fuelType}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Contact Dealer
          </Button>
          <Button variant="premium" size="sm" className="flex-1">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;