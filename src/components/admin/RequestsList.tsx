import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, Phone, Mail } from "lucide-react";

interface CarRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  make: string;
  model: string;
  year: number;
  engine_size: string;
  max_price: number;
  max_mileage: number;
  transmission: string;
  body_type: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

export function RequestsList() {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("car_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("car_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Request status updated");
      loadRequests();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("car_requests")
        .update({ admin_notes: notes })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Notes updated");
      loadRequests();
    } catch (error) {
      toast.error("Failed to update notes");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "destructive";
      case "processing": return "secondary";
      case "matched": return "default";
      case "contacted": return "outline";
      case "closed": return "secondary";
      default: return "secondary";
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = `${request.first_name} ${request.last_name} ${request.make} ${request.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="matched">Matched</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {request.first_name} {request.last_name}
                </CardTitle>
                <Badge variant={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{request.email}</span>
                  </div>
                  {request.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{request.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Car Requirements</h4>
                  <p><strong>Vehicle:</strong> {request.year} {request.make} {request.model}</p>
                  {request.engine_size && <p><strong>Engine:</strong> {request.engine_size}</p>}
                  {request.max_price && <p><strong>Max Price:</strong> ${request.max_price.toLocaleString()}</p>}
                  {request.max_mileage && <p><strong>Max Mileage:</strong> {request.max_mileage.toLocaleString()} km</p>}
                  {request.transmission && <p><strong>Transmission:</strong> {request.transmission}</p>}
                  {request.body_type && <p><strong>Body Type:</strong> {request.body_type}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Admin Notes</h4>
                <Textarea
                  value={request.admin_notes || ""}
                  onChange={(e) => {
                    const updatedRequests = requests.map(r => 
                      r.id === request.id ? { ...r, admin_notes: e.target.value } : r
                    );
                    setRequests(updatedRequests);
                  }}
                  onBlur={(e) => updateAdminNotes(request.id, e.target.value)}
                  placeholder="Add admin notes..."
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={request.status}
                  onValueChange={(value) => updateRequestStatus(request.id, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${request.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                
                {request.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${request.phone}`, '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Submitted on {new Date(request.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRequests.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No requests found
        </div>
      )}
    </div>
  );
}