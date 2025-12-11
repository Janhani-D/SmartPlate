import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Map, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { path: "/map", label: "Map", icon: Map },
  { path: "/chat", label: "AI Chat", icon: MessageCircle },
  { path: "/login", label: "Login", icon: User },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border md:relative md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around md:justify-center md:gap-8 h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "animate-bounce-in")} />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
