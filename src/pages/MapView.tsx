import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { restaurants } from "@/data/restaurants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navigation, Star, Clock, MapPin, ExternalLink } from "lucide-react";

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.209, 28.6139], // Delhi coordinates
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for restaurants
    restaurants.forEach((restaurant) => {
      const markerEl = document.createElement("div");
      markerEl.className = "restaurant-marker";
      markerEl.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <span class="text-white text-lg">🍽️</span>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([restaurant.coordinates.lng, restaurant.coordinates.lat])
        .addTo(map.current!);

      markerEl.addEventListener("click", () => {
        setSelectedRestaurant(restaurant);
        map.current?.flyTo({
          center: [restaurant.coordinates.lng, restaurant.coordinates.lat],
          zoom: 16,
        });
      });
    });

    setIsMapReady(true);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  const getDirections = (restaurant: typeof restaurants[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
    window.open(url, "_blank");
  };

  if (!isMapReady) {
    return (
      <div className="min-h-screen pb-20 md:pb-8 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2 font-heading">Map View</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Enter your Mapbox public token to view restaurant locations on the map.
              Get your token from{" "}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="space-y-3">
              <Input
                placeholder="pk.eyJ1IjoiLi4u"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="text-center"
              />
              <Button
                variant="warm"
                className="w-full"
                onClick={initializeMap}
                disabled={!mapboxToken}
              >
                Load Map
              </Button>
            </div>
          </div>

          {/* Restaurant List Preview */}
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Nearby Restaurants</h3>
            {restaurants.slice(0, 5).map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card rounded-xl border border-border p-3 flex items-center gap-3"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      {restaurant.rating}
                    </span>
                    <span>•</span>
                    <span>{restaurant.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Restaurant Info Panel */}
      {selectedRestaurant && (
        <div className="absolute bottom-24 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card rounded-2xl border border-border shadow-card p-4 animate-slide-up">
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          <div className="flex gap-3">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{selectedRestaurant.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedRestaurant.cuisine.join(" • ")}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  {selectedRestaurant.rating}
                </span>
                <span className="text-sm text-muted-foreground">{selectedRestaurant.distance}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {selectedRestaurant.description}
          </p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="warm"
              className="flex-1 gap-2"
              onClick={() => getDirections(selectedRestaurant)}
            >
              <Navigation className="w-4 h-4" />
              Directions
            </Button>
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Restaurant Quick List */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80">
        <div className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border shadow-card p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            {restaurants.length} Restaurants Nearby
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {restaurants.slice(0, 6).map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  map.current?.flyTo({
                    center: [restaurant.coordinates.lng, restaurant.coordinates.lat],
                    zoom: 16,
                  });
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-muted transition-colors flex items-center gap-2"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{restaurant.name}</p>
                  <p className="text-xs text-muted-foreground">{restaurant.distance}</p>
                </div>
                <Star className="w-3 h-3 fill-primary text-primary flex-shrink-0" />
                <span className="text-xs">{restaurant.rating}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
