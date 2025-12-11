import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSurprise: () => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onSurprise, disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "something cheesy but not too expensive",
    "comfort food after a rough day",
    "quick snack near college",
    "healthy lunch options",
    "late night cravings",
  ];

  return (
    <div className="space-y-3">
      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.slice(0, 3).map((suggestion) => (
          <Button
            key={suggestion}
            variant="pill"
            size="sm"
            onClick={() => onSend(suggestion)}
            disabled={disabled}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Input area */}
      <div className="relative flex items-end gap-2 p-2 bg-card rounded-2xl border border-border shadow-card">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me what you're craving... 🍕"
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none",
            "min-h-[44px] max-h-[120px]"
          )}
          style={{ scrollbarWidth: "thin" }}
        />
        
        <div className="flex gap-2 pb-0.5">
          <Button
            variant="surprise"
            size="icon"
            onClick={onSurprise}
            disabled={disabled}
            className="rounded-xl"
            title="Surprise Me!"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
          
          <Button
            variant="warm"
            size="icon"
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
