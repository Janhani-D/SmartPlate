import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Map, MessageCircle, Sparkles, Star, Clock, IndianRupee } from "lucide-react";
import { restaurants } from "@/data/restaurants";

const Home = () => {
  const topRated = restaurants.filter(r => r.rating >= 4.5).slice(0, 4);

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Food Discovery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-heading">
            Find Your Perfect
            <span className="text-gradient block">Food Match</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover local restaurants that match your mood, budget, and cravings. 
            Just tell us what you're feeling!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button variant="warm" size="lg" className="gap-2 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/restaurants">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <UtensilsCrossed className="w-5 h-5" />
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-heading">
            Why SmartDine?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Natural Conversations",
                description: "Tell us 'something cheesy but not too expensive' and we'll understand exactly what you want."
              },
              {
                icon: Map,
                title: "Location Aware",
                description: "Find restaurants near you with real-time distance and directions to your next meal."
              },
              {
                icon: Sparkles,
                title: "Smart Recommendations",
                description: "Our AI learns your preferences and suggests restaurants you'll actually love."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-12 md:py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Top Rated</h2>
            <Link to="/restaurants" className="text-primary hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRated.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants`}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs font-semibold">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{restaurant.cuisine.join(" • ")}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {restaurant.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {"₹".repeat(restaurant.priceRange)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
            Can't Decide What to Eat?
          </h2>
          <p className="text-muted-foreground mb-6">
            Let our AI surprise you with a perfect recommendation based on your mood!
          </p>
          <Link to="/chat">
            <Button variant="surprise" size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Surprise Me!
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
