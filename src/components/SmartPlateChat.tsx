import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import RestaurantCard from "./RestaurantCard";
import { getGreeting, getRecommendations, getSurpriseRecommendation } from "@/lib/foodAssistant";
import { restaurants, Restaurant } from "@/data/restaurants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  restaurants?: Restaurant[];
}

// Sample demo conversations for demonstration purposes
const getDemoConversations = (): Message[] => {
  const sampleRestaurants = restaurants.slice(0, 3);
  const budgetRestaurants = restaurants.filter(r => r.priceRange === 1).slice(0, 3);
  const spicyRestaurants = restaurants.filter(r => r.tags.includes("spicy")).slice(0, 3);
  
  return [
    {
      id: "demo-1",
      role: "assistant",
      content: `Hey there, foodie! 🍽️ I'm here to help you discover the perfect spot to eat!\n\nTell me what you're in the mood for — something like "cheap and filling" or "cheesy comfort food" — and I'll find the best matches for you!`,
    },
    {
      id: "demo-2",
      role: "user",
      content: "I want something spicy under 500 rupees",
    },
    {
      id: "demo-3",
      role: "assistant",
      content: `Great choice for spice lovers! 🌶️ Try **${budgetRestaurants[0]?.name || "Annapoorna"}** because it's super budget-friendly and they bring the heat you're looking for!\n\nAlso check out **${budgetRestaurants[1]?.name || "Junior Kuppanna"}** and **${budgetRestaurants[2]?.name || "Sree Annapoorna"}** for similar fiery flavors!`,
      restaurants: budgetRestaurants.length >= 3 ? budgetRestaurants : sampleRestaurants,
    },
    {
      id: "demo-4",
      role: "user",
      content: "What about something for a family dinner?",
    },
    {
      id: "demo-5",
      role: "assistant",
      content: `For a wonderful family dinner, I recommend **${sampleRestaurants[0]?.name || "Shree Anandhaas"}**! They have a great family-friendly atmosphere with diverse menu options that will please everyone.\n\nTheir portions are generous and the ambiance is perfect for quality family time. Would you like me to suggest places with specific cuisines?`,
      restaurants: sampleRestaurants,
    },
  ];
};

const SmartPlateChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: `${getGreeting()} I'm here to help you discover the perfect spot to eat! 🍽️\n\nTell me what you're in the mood for — something like "cheap and filling" or "cheesy comfort food" — and I'll find the best matches for you!`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDemoButton, setShowDemoButton] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 800 + Math.random() * 400);
  };

  const handleSend = (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);

    simulateTyping(() => {
      const result = getRecommendations(userMessage);
      
      let responseContent = result.explanation;
      if (result.followUp) {
        responseContent += `\n\n${result.followUp}`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        restaurants: result.restaurants,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    });
  };

  const handleSurprise = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "🎲 Surprise me!",
    };
    setMessages((prev) => [...prev, userMsg]);

    simulateTyping(() => {
      const result = getSurpriseRecommendation();
      
      let responseContent = result.explanation;
      if (result.followUp) {
        responseContent += `\n\n${result.followUp}`;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        restaurants: result.restaurants,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    });
  };

  const loadDemoConversation = () => {
    setShowDemoButton(false);
    setMessages(getDemoConversations());
  };

  const clearDemo = () => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: `${getGreeting()} I'm here to help you discover the perfect spot to eat! 🍽️\n\nTell me what you're in the mood for — something like "cheap and filling" or "cheesy comfort food" — and I'll find the best matches for you!`,
      },
    ]);
    setShowDemoButton(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Demo button */}
      {showDemoButton && messages.length === 1 && (
        <div className="px-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDemoConversation}
            className="gap-2 text-xs"
          >
            <PlayCircle className="w-4 h-4" />
            Load Demo Conversation
          </Button>
        </div>
      )}
      
      {/* Clear demo button */}
      {!showDemoButton && (
        <div className="px-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDemo}
            className="text-xs text-muted-foreground"
          >
            Clear & Start Fresh
          </Button>
        </div>
      )}

      {/* Chat messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-6 space-y-6">
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-4">
              <ChatMessage
                role={message.role}
                content={message.content}
                isLatest={index === messages.length - 1}
              />
              
              {/* Restaurant cards */}
              {message.restaurants && message.restaurants.length > 0 && (
                <div className="pl-11 animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.restaurants.map((restaurant, idx) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        index={idx}
                        isHighlighted={idx === 0}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-border/50">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-lg">
        <ChatInput
          onSend={handleSend}
          onSurprise={handleSurprise}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};

export default SmartPlateChat;
