import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Fuel, Gauge, MapPin, Settings, Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  transmission?: string;
  body_type?: string;
  fuel_type?: string;
  exterior_color?: string;
  interior_color?: string;
  location?: string;
  images: string[];
  is_featured: boolean;
}

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to contact dealers",
      });
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      // For now, we'll just show a success message
      // In a real app, you'd send this to the dealer via email or save to database
      toast({
        title: "Message sent!",
        description: "Your message has been sent to the dealer. They will contact you soon.",
      });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  // Use first image from array or fallback
  const imageUrl = car.images && car.images.length > 0 
    ? car.images[0] 
    : "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop";

  return (
    <Card className="group overflow-hidden hover:shadow-card transition-all duration-300 hover-scale cursor-pointer">
      <div onClick={handleCardClick}>
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {car.is_featured && (
            <Badge className="absolute top-2 right-2 bg-gradient-primary text-white">
              Featured
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-2xl font-bold text-primary">
            ${car.price.toLocaleString()}
          </p>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{car.year}</span>
          </div>
          {car.mileage && (
            <div className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              <span>{car.mileage.toLocaleString()} km</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{car.fuel_type}</span>
            </div>
          )}
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{car.location}</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car/${car.id}`);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Dealer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Contact Dealer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`I'm interested in the ${car.year} ${car.make} ${car.model}...`}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;