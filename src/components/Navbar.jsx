import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 px-4 py-6 ">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-bold text-foreground">TickTrack</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hello,</span>
              <span className="font-medium text-foreground">
                {user?.name || "User"}
              </span>
            </div>

            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
