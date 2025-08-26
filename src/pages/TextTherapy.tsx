import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Send, ArrowLeft, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const TextTherapy = () => {
  const navigate = useNavigate();
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const ageGroups = [
    { id: "child", label: "Child (5-12)", color: "bg-green-100 text-green-800" },
    { id: "teen", label: "Teen (13-17)", color: "bg-blue-100 text-blue-800" },
    { id: "adult", label: "Adult (18+)", color: "bg-purple-100 text-purple-800" }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for sharing that with me. I understand this might be difficult to discuss. Can you tell me more about how this situation makes you feel?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>Text-Based AI Therapy | NARA.I</title>
        <meta name="description" content="Chat with NARA.I's text-based therapy assistant for personalized mental health support and counseling." />
      </Helmet>

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-semibold">NARA.I</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-soft px-4 py-2 rounded-full mb-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Text-Based Therapy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Chat with NARA.I
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience personalized therapy through conversation. Our AI adapts to your age and communication style.
            </p>
          </div>

          {!selectedAge ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Select Your Age Group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground mb-6">
                    NARA.I adapts its communication style and therapeutic approach based on your age.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {ageGroups.map((group) => (
                      <Button
                        key={group.id}
                        variant="calm"
                        className="h-auto p-6 flex-col gap-3"
                        onClick={() => setSelectedAge(group.id)}
                      >
                        <Badge className={group.color}>
                          {group.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Age-appropriate communication style
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-primary" />
                      Therapy Chat
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge className={ageGroups.find(g => g.id === selectedAge)?.color}>
                        {ageGroups.find(g => g.id === selectedAge)?.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAge("")}
                      >
                        Change
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-96 border rounded-lg p-4 space-y-4 overflow-y-auto bg-gradient-card">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-primary animate-gentle-float" />
                        <p className="text-muted-foreground">
                          Hello! I'm NARA.I, your therapy assistant. Feel free to share what's on your mind.
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary-soft'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div className={`p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background border shadow-soft'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary-soft flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-background border shadow-soft p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Share what's on your mind..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] resize-none"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      className="px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    This is a demo. In a real implementation, this would connect to advanced AI therapy models.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TextTherapy;