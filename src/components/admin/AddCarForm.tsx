import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Upload } from "lucide-react";

const AddCarForm = ({ onCarAdded }: { onCarAdded: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    transmission: "",
    body_type: "",
    fuel_type: "",
    engine_size: "",
    exterior_color: "",
    interior_color: "",
    description: "",
    dealer_name: "Japs Motors",
    dealer_phone: "(555) 123-4567",
    dealer_email: "sales@japsmotors.com",
    location: "Toronto, ON",
    is_featured: false,
    is_visible: true,
  });

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        images: imageUrls,
      };

      const { error } = await supabase
        .from('cars')
        .insert([carData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car added successfully",
      });

      // Reset form
      setFormData({
        make: "",
        model: "",
        year: "",
        price: "",
        mileage: "",
        transmission: "",
        body_type: "",
        fuel_type: "",
        engine_size: "",
        exterior_color: "",
        interior_color: "",
        description: "",
        dealer_name: "Japs Motors",
        dealer_phone: "(555) 123-4567",
        dealer_email: "sales@japsmotors.com",
        location: "Toronto, ON",
        is_featured: false,
        is_visible: true,
      });
      setImageUrls([]);
      onCarAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Add New Car</CardTitle>
        <CardDescription>Fill in the details for the new car listing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body_type">Body Type</Label>
              <Select value={formData.body_type} onValueChange={(value) => handleInputChange("body_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Wagon">Wagon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => handleInputChange("fuel_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engine_size">Engine Size</Label>
              <Input
                id="engine_size"
                value={formData.engine_size}
                onChange={(e) => handleInputChange("engine_size", e.target.value)}
                placeholder="e.g., 2.5L"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exterior_color">Exterior Color</Label>
              <Input
                id="exterior_color"
                value={formData.exterior_color}
                onChange={(e) => handleInputChange("exterior_color", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interior_color">Interior Color</Label>
              <Input
                id="interior_color"
                value={formData.interior_color}
                onChange={(e) => handleInputChange("interior_color", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>

          {/* Image URLs Section */}
          <div className="space-y-4">
            <Label>Car Images</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <Button type="button" onClick={addImageUrl} size="sm">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Added Images:</Label>
                  <div className="grid gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&h=100&fit=crop";
                          }}
                        />
                        <span className="flex-1 text-sm truncate">{url}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
              />
              <Label htmlFor="is_featured">Featured car</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => handleInputChange("is_visible", checked)}
              />
              <Label htmlFor="is_visible">Visible on website</Label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding Car..." : "Add Car"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCarForm;