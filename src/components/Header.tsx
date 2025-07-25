import { useState } from "react";
import { Search, Menu, X, Car, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import FindMyCarForm from "./FindMyCarForm";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">JapsMotors</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Browse Cars</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Sell Your Car</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Financing</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors text-sm">Admin</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && <FindMyCarForm />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => navigate("/my-requests")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button variant="premium" size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Browse Cars</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Sell Your Car</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Financing</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user && (
                  <div className="pb-2">
                    <FindMyCarForm />
                  </div>
                )}
                {user ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate("/my-requests")}>
                      My Requests
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                    <Button variant="premium" size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;