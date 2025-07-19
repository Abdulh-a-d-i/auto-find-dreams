import { Car, Users, FileText, Plus, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "cars", label: "Manage Cars", icon: Car },
    { id: "add-car", label: "Add Car", icon: Plus },
    { id: "requests", label: "Car Requests", icon: FileText },
    { id: "admins", label: "Manage Admins", icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">Japs Motors</h2>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}