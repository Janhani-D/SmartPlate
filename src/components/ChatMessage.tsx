import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLatest?: boolean;
}

const ChatMessage = ({ role, content, isLatest = false }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
        isLatest && "animate-slide-up"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
          isUser 
            ? "bg-secondary text-secondary-foreground" 
            : "gradient-warm text-primary-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl shadow-soft",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border/50 text-foreground rounded-bl-md"
        )}
      >
        <p 
          className="text-sm leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>') 
          }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;
