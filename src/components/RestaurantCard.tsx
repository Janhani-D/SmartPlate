import { Restaurant } from "@/data/restaurants";
import { Star, MapPin, Clock, IndianRupee, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
  isHighlighted?: boolean;
}

const RestaurantCard = ({ restaurant, index = 0, isHighlighted = false }: RestaurantCardProps) => {
  const priceDisplay = "₹".repeat(restaurant.priceRange);
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl gradient-card border border-border/50 shadow-card transition-all duration-300 hover:shadow-glow hover:-translate-y-1",
        isHighlighted && "ring-2 ring-primary ring-offset-2",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.isVeg && (
            <Badge className="bg-green-500/90 text-primary-foreground border-0 shadow-sm">
              <Leaf className="w-3 h-3 mr-1" />
              Veg
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Star className="w-4 h-4 fill-warm-amber text-warm-amber" />
          <span className="text-sm font-semibold text-foreground">{restaurant.rating}</span>
          <span className="text-xs text-muted-foreground">({restaurant.reviews})</span>
        </div>
        
        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-xl font-bold text-primary-foreground drop-shadow-lg">
            {restaurant.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Cuisine tags */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.cuisine.map((c) => (
            <Badge key={c} variant="secondary" className="text-xs font-normal">
              {c}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {restaurant.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{restaurant.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{restaurant.openTime} - {restaurant.closeTime}</span>
          </div>
          <div className="flex items-center text-warm-orange font-medium">
            {priceDisplay}
          </div>
        </div>

        {/* Specialties */}
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-1.5">Must try:</p>
          <div className="flex flex-wrap gap-1">
            {restaurant.specialties.slice(0, 3).map((s) => (
              <span 
                key={s} 
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
