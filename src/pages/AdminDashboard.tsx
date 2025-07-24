import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Car, Users, FileText, Plus, LogOut, Settings } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { CarsList } from "@/components/admin/CarsList";
import AddCarForm from "@/components/admin/AddCarForm";
import { RequestsList } from "@/components/admin/RequestsList";
import { AdminsList } from "@/components/admin/AdminsList";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalCars: 0,
    totalRequests: 0,
    totalUsers: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      navigate("/admin/login");
      return;
    }

    // Load dashboard stats
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [carsResult, requestsResult, usersResult] = await Promise.all([
        supabase.from("cars").select("*", { count: "exact", head: true }),
        supabase.from("car_requests").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true })
      ]);

      const { data: pendingRequests } = await supabase
        .from("car_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalCars: carsResult.count || 0,
        totalRequests: requestsResult.count || 0,
        totalUsers: usersResult.count || 0,
        pendingRequests: pendingRequests?.length || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminEmail");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCars}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRequests}</div>
                  <Badge variant="destructive" className="mt-1">
                    {stats.pendingRequests} pending
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setActiveTab("add-car")} 
                    className="w-full"
                    size="sm"
                  >
                    Add New Car
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "cars" && <CarsList onStatsUpdate={loadStats} />}
        {activeTab === "add-car" && <AddCarForm onCarAdded={loadStats} />}
        {activeTab === "requests" && <RequestsList />}
        {activeTab === "admins" && <AdminsList />}
      </div>
    </div>
  );
}