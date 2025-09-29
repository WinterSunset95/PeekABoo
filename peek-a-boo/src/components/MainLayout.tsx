import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MessageSquare, Search, Film, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: MessageSquare },
  { href: "/search", label: "Search", icon: Search },
  { href: "/media", label: "Media", icon: Film },
  { href: "/settings", label: "Settings", icon: User },
];

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      <nav className="border-t bg-background/80 backdrop-blur-sm sticky bottom-0 z-500">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary w-16",
                  isActive && "text-primary font-semibold"
                )
              }
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
