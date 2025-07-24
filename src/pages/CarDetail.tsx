import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Car, Fuel, Gauge, MapPin, Phone, Mail, Palette, Settings, User } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

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
  engine_size?: string;
  exterior_color?: string;
  interior_color?: string;
  description?: string;
  images: string[];
  dealer_name?: string;
  dealer_phone?: string;
  dealer_email?: string;
  location?: string;
  is_featured: boolean;
}

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .eq('is_visible', true)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load car details",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">Loading car details...</div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">Car not found</div>
        </div>
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498887960847-2a5e46312788?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1471532035356-bb5c0b2c7c77?w=800&h=600&fit=crop"
  ];

  const displayImages = car.images && car.images.length > 0 ? car.images : defaultImages;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          {car.is_featured && (
            <Badge className="bg-gradient-primary text-white">Featured</Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${car.make} ${car.model} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {displayImages.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>

          {/* Car Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-3xl font-bold text-primary mb-4">
                ${car.price.toLocaleString()}
              </p>
              {car.description && (
                <p className="text-muted-foreground mb-6">{car.description}</p>
              )}
            </div>

            {/* Specifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year: {car.year}</span>
                  </div>
                  {car.mileage && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mileage: {car.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  {car.transmission && (
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Transmission: {car.transmission}</span>
                    </div>
                  )}
                  {car.fuel_type && (
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fuel: {car.fuel_type}</span>
                    </div>
                  )}
                  {car.body_type && (
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Body: {car.body_type}</span>
                    </div>
                  )}
                  {car.engine_size && (
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Engine: {car.engine_size}</span>
                    </div>
                  )}
                  {car.exterior_color && (
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Exterior: {car.exterior_color}</span>
                    </div>
                  )}
                  {car.interior_color && (
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Interior: {car.interior_color}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dealer Information */}
            {(car.dealer_name || car.dealer_phone || car.dealer_email || car.location) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Dealer Information</h3>
                  <div className="space-y-3">
                    {car.dealer_name && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{car.dealer_name}</span>
                      </div>
                    )}
                    {car.dealer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{car.dealer_phone}</span>
                      </div>
                    )}
                    {car.dealer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{car.dealer_email}</span>
                      </div>
                    )}
                    {car.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{car.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Dealer Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                  Contact Dealer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
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
        </div>
      </div>
    </div>
  );
};

export default CarDetail;