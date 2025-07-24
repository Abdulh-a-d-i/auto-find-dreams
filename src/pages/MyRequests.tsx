import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Car, Mail, Phone, User } from "lucide-react";
import Header from "@/components/Header";

interface CarRequest {
  id: string;
  make: string;
  model: string;
  year: number;
  max_price?: number;
  max_mileage?: number;
  transmission?: string;
  body_type?: string;
  engine_size?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

const MyRequests = () => {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      await fetchRequests(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const fetchRequests = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('car_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch your requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">Loading your requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">My Car Requests</h1>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't submitted any car requests yet. Start by browsing our inventory!
              </p>
              <Button onClick={() => navigate("/")}>Browse Cars</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        {request.year} {request.make} {request.model}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Submitted on {new Date(request.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Requirements</h4>
                      {request.max_price && (
                        <p className="text-sm text-muted-foreground">
                          Max Price: ${request.max_price.toLocaleString()}
                        </p>
                      )}
                      {request.max_mileage && (
                        <p className="text-sm text-muted-foreground">
                          Max Mileage: {request.max_mileage.toLocaleString()} km
                        </p>
                      )}
                      {request.transmission && (
                        <p className="text-sm text-muted-foreground">
                          Transmission: {request.transmission}
                        </p>
                      )}
                      {request.body_type && (
                        <p className="text-sm text-muted-foreground">
                          Body Type: {request.body_type}
                        </p>
                      )}
                      {request.engine_size && (
                        <p className="text-sm text-muted-foreground">
                          Engine Size: {request.engine_size}
                        </p>
                      )}
                    </div>
                    {request.admin_notes && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Admin Notes</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {request.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;