import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";
import { Trash2, Plus } from "lucide-react";

interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export function AdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);

    try {
      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newAdminPassword, saltRounds);

      const { error } = await supabase
        .from("admins")
        .insert({
          email: newAdminEmail,
          password_hash: passwordHash
        });

      if (error) throw error;

      toast.success("Admin added successfully!");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowAddForm(false);
      loadAdmins();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("An admin with this email already exists");
      } else {
        toast.error("Failed to add admin");
      }
    } finally {
      setAddingAdmin(false);
    }
  };

  const deleteAdmin = async (id: string, email: string) => {
    // Prevent deleting the current admin
    const currentAdminEmail = localStorage.getItem("adminEmail");
    if (email === currentAdminEmail) {
      toast.error("You cannot delete your own admin account");
      return;
    }

    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) return;

    try {
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Admin deleted successfully");
      loadAdmins();
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  if (loading) {
    return <div>Loading admins...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
            <CardDescription>
              Create a new admin account with email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addingAdmin}>
                  {addingAdmin ? "Adding..." : "Add Admin"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="font-semibold">{admin.email}</p>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAdmin(admin.id, admin.email)}
                disabled={admin.email === localStorage.getItem("adminEmail")}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {admins.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No admins found
        </div>
      )}
    </div>
  );
}