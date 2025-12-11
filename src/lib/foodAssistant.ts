import { restaurants, getMoodKeywords, Restaurant } from "@/data/restaurants";

interface RecommendationResult {
  restaurants: Restaurant[];
  explanation: string;
  followUp?: string;
}

const greetings = [
  "Hey there, foodie! 🍽️",
  "Namaste! Ready to find something delicious?",
  "Hello! Let's satisfy those cravings!",
  "Hey! What's your tummy telling you today?",
];

const surpriseIntros = [
  "Feeling adventurous? Here's my pick for you:",
  "Close your eyes and trust me on this one:",
  "The food gods have spoken! Try this:",
  "Let fate decide your next meal:",
];

export function getGreeting(): string {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export function getSurpriseIntro(): string {
  return surpriseIntros[Math.floor(Math.random() * surpriseIntros.length)];
}

function detectMoods(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const detectedMoods: string[] = [];

  Object.entries(getMoodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      detectedMoods.push(mood);
    }
  });

  return detectedMoods;
}

function detectPricePreference(query: string): number | null {
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes("cheap") || lowercaseQuery.includes("budget") || 
      lowercaseQuery.includes("affordable") || lowercaseQuery.includes("pocket")) {
    return 1;
  }
  if (lowercaseQuery.includes("expensive") || lowercaseQuery.includes("premium") || 
      lowercaseQuery.includes("fancy") || lowercaseQuery.includes("special occasion")) {
    return 3;
  }
  if (lowercaseQuery.includes("moderate") || lowercaseQuery.includes("mid-range")) {
    return 2;
  }
  
  return null;
}

function detectCuisinePreference(query: string): string[] {
  const lowercaseQuery = query.toLowerCase();
  const cuisines: string[] = [];
  
  const cuisineMap: Record<string, string[]> = {
    "North Indian": ["north indian", "punjabi", "tandoor", "dal", "roti", "naan"],
    "South Indian": ["south indian", "dosa", "idli", "sambar", "filter coffee"],
    "Chinese": ["chinese", "noodles", "manchurian", "hakka", "wok"],
    "Italian": ["italian", "pizza", "pasta", "cheese burst"],
    "Street Food": ["street food", "chaat", "pani puri", "gol gappa"],
    "Fast Food": ["fast food", "burger", "fries"],
    "Cafe": ["cafe", "coffee", "chai", "tea"],
    "Desserts": ["dessert", "sweet", "ice cream", "mithai"],
  };

  Object.entries(cuisineMap).forEach(([cuisine, keywords]) => {
    if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      cuisines.push(cuisine);
    }
  });

  return cuisines;
}

function scoreRestaurant(restaurant: Restaurant, moods: string[], price: number | null, cuisines: string[]): number {
  let score = 0;

  // Mood matching
  moods.forEach(mood => {
    const moodKeywords = getMoodKeywords[mood] || [];
    if (restaurant.tags.some(tag => moodKeywords.includes(tag) || tag.includes(mood))) {
      score += 3;
    }
  });

  // Price matching
  if (price !== null) {
    if (restaurant.priceRange === price) {
      score += 4;
    } else if (Math.abs(restaurant.priceRange - price) === 1) {
      score += 1;
    }
  }

  // Cuisine matching
  cuisines.forEach(cuisine => {
    if (restaurant.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase()))) {
      score += 5;
    }
  });

  // Bonus for high ratings
  score += restaurant.rating * 0.5;

  return score;
}

function generateExplanation(restaurant: Restaurant, moods: string[], query: string): string {
  const explanations: string[] = [];
  
  if (moods.includes("cheap") || moods.includes("budget")) {
    explanations.push(`it's super budget-friendly`);
  }
  if (moods.includes("comfort") && restaurant.tags.includes("comfort")) {
    explanations.push(`it's the perfect comfort food`);
  }
  if (moods.includes("cheesy") && restaurant.tags.some(t => t.includes("chees"))) {
    explanations.push(`they've got the cheesiest options in town`);
  }
  if (moods.includes("spicy") && restaurant.tags.includes("spicy")) {
    explanations.push(`they bring the heat you're looking for`);
  }
  if (moods.includes("late-night") && restaurant.tags.includes("late-night")) {
    explanations.push(`they're open late for those midnight cravings`);
  }
  if (moods.includes("healthy") && restaurant.tags.includes("healthy")) {
    explanations.push(`it's fresh and healthy without compromising on taste`);
  }
  if (moods.includes("filling") && restaurant.tags.includes("filling")) {
    explanations.push(`their portions are legendary`);
  }

  if (explanations.length === 0) {
    explanations.push(`it matches what you're looking for`);
  }

  const specialtyNote = restaurant.popularDishes.length > 0 
    ? ` Their ${restaurant.popularDishes[0]} is a must-try!`
    : "";

  return `Try **${restaurant.name}** because ${explanations.join(" and ")}!${specialtyNote}`;
}

export function getRecommendations(query: string): RecommendationResult {
  const moods = detectMoods(query);
  const price = detectPricePreference(query);
  const cuisines = detectCuisinePreference(query);

  // Score all restaurants
  const scoredRestaurants = restaurants.map(restaurant => ({
    restaurant,
    score: scoreRestaurant(restaurant, moods, price, cuisines)
  }));

  // Sort by score
  scoredRestaurants.sort((a, b) => b.score - a.score);

  // Get top 3
  const topRestaurants = scoredRestaurants.slice(0, 3).map(sr => sr.restaurant);

  if (topRestaurants.length === 0) {
    return {
      restaurants: restaurants.slice(0, 3),
      explanation: "Hmm, I couldn't find an exact match, but here are some popular spots you might like!",
      followUp: "Try telling me more about your mood or what cuisine you're craving!"
    };
  }

  const mainExplanation = generateExplanation(topRestaurants[0], moods, query);
  
  let followUp: string | undefined;
  if (topRestaurants.length > 1) {
    followUp = `Also check out **${topRestaurants[1].name}** and **${topRestaurants[2]?.name || topRestaurants[1].name}** for similar vibes!`;
  }

  return {
    restaurants: topRestaurants,
    explanation: mainExplanation,
    followUp
  };
}

export function getSurpriseRecommendation(): RecommendationResult {
  // Weighted random - prefer higher rated restaurants
  const weightedRestaurants = restaurants.flatMap(r => 
    Array(Math.round(r.rating * 2)).fill(r)
  );
  
  const randomIndex = Math.floor(Math.random() * weightedRestaurants.length);
  const surprise = weightedRestaurants[randomIndex];

  const funFacts = [
    `With a ${surprise.rating}⭐ rating, this place is loved by many!`,
    surprise.popularDishes.length > 0 ? `Pro tip: Their ${surprise.popularDishes[0]} is absolutely legendary!` : `They have amazing ${surprise.cuisine[0]} cuisine!`,
    `Average cost for two: ₹${surprise.avgPriceForTwo} - great value!`,
    `Cuisines: ${surprise.cuisine.join(", ")} - perfect for your cravings!`,
  ];

  return {
    restaurants: [surprise],
    explanation: `${getSurpriseIntro()} **${surprise.name}**! ${surprise.description}`,
    followUp: funFacts[Math.floor(Math.random() * funFacts.length)]
  };
}
