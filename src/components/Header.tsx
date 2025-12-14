import { UtensilsCrossed } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center shadow-soft">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-warm-amber rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gradient">
              SmartPlate
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Your Food Discovery Assistant
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">18 eateries</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-600 font-medium">Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
