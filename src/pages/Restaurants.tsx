import { useState, useMemo } from "react";
import { restaurants } from "@/data/restaurants";
import RestaurantCard from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

const cuisineOptions = ["All", "North Indian", "South Indian", "Chinese", "Italian", "Street Food", "Cafe", "Desserts"];
const priceOptions = ["All", "₹", "₹₹", "₹₹₹"];

const Restaurants = () => {
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
        restaurant.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCuisine = selectedCuisine === "All" || 
        restaurant.cuisine.some(c => c.toLowerCase().includes(selectedCuisine.toLowerCase()));
      
      const matchesPrice = selectedPrice === "All" || 
        restaurant.priceRange === selectedPrice.length;
      
      const matchesVeg = !vegOnly || restaurant.isVeg;

      return matchesSearch && matchesCuisine && matchesPrice && matchesVeg;
    });
  }, [search, selectedCuisine, selectedPrice, vegOnly]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCuisine("All");
    setSelectedPrice("All");
    setVegOnly(false);
  };

  const hasActiveFilters = search || selectedCuisine !== "All" || selectedPrice !== "All" || vegOnly;

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-heading">Restaurants</h1>
          <p className="text-muted-foreground">Discover {restaurants.length} amazing eateries near you</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurants, cuisines, moods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary/10 border-primary" : ""}
            >
              <Filter className="w-4 h-4" />
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-4 space-y-3 animate-slide-up">
              {/* Cuisine Filter */}
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-2 block">Cuisine</span>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <Button
                      key={cuisine}
                      variant={selectedCuisine === cuisine ? "warm" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCuisine(cuisine)}
                      className="h-8 text-xs"
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-2 block">Price Range</span>
                <div className="flex flex-wrap gap-2">
                  {priceOptions.map((price) => (
                    <Button
                      key={price}
                      variant={selectedPrice === price ? "warm" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPrice(price)}
                      className="h-8 text-xs"
                    >
                      {price}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Veg Filter */}
              <div className="flex items-center gap-2">
                <Button
                  variant={vegOnly ? "warm" : "outline"}
                  size="sm"
                  onClick={() => setVegOnly(!vegOnly)}
                  className="h-8 text-xs gap-1"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Veg Only
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} found
        </p>
        
        {filteredRestaurants.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No restaurants match your filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
