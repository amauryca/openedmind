import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateTherapyResponse, generateWelcomeMessage, TherapyContext } from "@/lib/therapyApi";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import EmergencyModal from "@/components/EmergencyModal";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { detectEmergency } from "@/utils/emergencyDetection";
import { securityManager } from "@/lib/security";
import SystemStatus from "@/components/SystemStatus";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const TextTherapy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat container to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleStartSession = async () => {
    if (!selectedAge) {
      alert("Please select an age range to continue");
      return;
    }
    
    // Reset security manager for new session
    securityManager.resetSession();
    
    setSessionActive(true);
    setIsTyping(true);
    
    try {
      // Generate AI welcome message
      const welcomeContent = await generateWelcomeMessage(selectedAge);
      const welcomeMessage: Message = {
        id: 1,
        type: "ai",
        content: welcomeContent,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error generating welcome message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI therapist. Please try again.",
        variant: "destructive"
      });
      // Fallback to default message
      const welcomeMessage: Message = {
        id: 1,
        type: "ai",
        content: getDefaultWelcomeMessage(selectedAge),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getDefaultWelcomeMessage = (ageGroup: string) => {
    const messages = {
      "child": "Hi there! I'm your friendly AI helper. I'm here to listen and help you feel better. Would you like to tell me about your day? Remember, it's okay to feel different emotions - that's totally normal!",
      "teen": "Hey! I'm your AI therapist, and I'm here to support you. I know being a teenager can be really tough sometimes with school, friends, and all the changes happening. What's been on your mind lately?",
      "young-adult": "Hello! I'm here to provide you with a safe space to talk about anything that's bothering you. Young adulthood brings unique challenges - career decisions, relationships, independence. What would you like to discuss today?",
      "adult": "Welcome to your therapy session. I'm here to listen and provide support as you navigate life's complexities. Whether it's work stress, relationships, family, or personal growth, we can explore whatever is important to you right now.",
      "senior": "Good day! I'm honored to be here with you today. Life brings so much wisdom and experience, along with its own unique challenges. I'm here to listen and support you through whatever you'd like to share."
    };
    return messages[ageGroup as keyof typeof messages] || messages.adult;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sessionEnded) return;

    // Validate input
    const validation = securityManager.validateInput(inputMessage);
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    // Check for emergency keywords
    if (detectEmergency(inputMessage)) {
      setShowEmergencyModal(true);
      return;
    }

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Prepare context for therapy API
      const context: TherapyContext = {
        age: selectedAge,
        sessionType: 'text',
        previousMessages: messages.slice(-6).map(m => m.content) // Last 6 messages for context
      };

      // Generate AI response using OpenRouter
      const aiContent = await generateTherapyResponse(currentInput, context);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        type: "ai",
        content: aiContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Response Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      
      // Fallback response with proper ID calculation
      const aiMessage: Message = {
        id: Date.now(), // Use timestamp for unique ID
        type: "ai",
        content: "I apologize, but I'm having trouble connecting right now. Could you please repeat that? I'm here to help.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndSession = () => {
    setSessionEnded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Text-Based Therapy Session
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughtful conversations with your AI therapeutic companion
          </p>
        </div>

        {!sessionActive ? (
          /* Setup Screen */
          <div className="max-w-md mx-auto">
            <Card className="shadow-therapy animate-slide-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Start Your Therapy Session</CardTitle>
                <p className="text-muted-foreground">
                  Choose your age for personalized support
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child (6-12 years)</SelectItem>
                    <SelectItem value="teen">Teen (13-17 years)</SelectItem>
                    <SelectItem value="young-adult">Young Adult (18-25 years)</SelectItem>
                    <SelectItem value="adult">Adult (26-64 years)</SelectItem>
                    <SelectItem value="senior">Senior (65+ years)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleStartSession}
                  variant="therapy"
                  size="lg"
                  className="w-full"
                  disabled={!selectedAge}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Begin Therapy Session
                </Button>
              </CardContent>
            </Card>

            {/* Information */}
            <div className="mt-8 grid gap-4">
              <Card className="shadow-gentle animate-slide-in">
                <CardContent className="p-6 text-center">
                  <Bot className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">AI-Powered Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI technology provides personalized therapeutic responses
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-gentle animate-slide-in">
                <CardContent className="p-6 text-center">
                  <Badge className="h-8 w-8 mx-auto mb-3 text-primary flex items-center justify-center">🔒</Badge>
                  <h3 className="font-semibold mb-2">Safe & Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your conversations are confidential and secure
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="shadow-gentle">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      Age Group: {selectedAge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <Badge variant="outline" className="animate-pulse-soft">
                      Active Session
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleEndSession}
                    variant="destructive"
                    size="sm"
                  >
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="shadow-therapy">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Therapy Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div ref={chatContainerRef} className="h-96 overflow-y-auto bg-gradient-calm rounded-lg p-4 mb-4 space-y-4 scroll-smooth">
                  {sessionEnded ? (
                    <div className="text-center text-muted-foreground p-8">
                      <h3 className="text-lg font-semibold mb-2">Session Ended</h3>
                      <p>Thank you for using our therapy service. Take care of yourself.</p>
                      <div className="flex gap-3 justify-center mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSessionEnded(false);
                            setMessages([]);
                          }}
                        >
                          Start New Session
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSessionActive(false);
                            setSessionEnded(false);
                            setMessages([]);
                            setSelectedAge("");
                          }}
                        >
                          Change Age
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 shadow-gentle animate-slide-in ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white/90 text-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.type === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                              <span className="text-xs font-semibold">
                                {message.type === 'user' ? 'You' : 'AI Therapist'}
                              </span>
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && !sessionEnded && (
                        <div className="flex justify-start">
                          <div className="bg-white/90 rounded-lg p-4 shadow-gentle">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4" />
                              <span className="text-xs font-semibold">AI Therapist</span>
                            </div>
                            <div className="animate-pulse-soft text-sm text-muted-foreground">
                              Typing...
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {!sessionEnded && (
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Share your thoughts and feelings here..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      variant="therapy"
                      size="lg"
                      disabled={!inputMessage.trim() || isTyping}
                      className="h-[60px]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <EmergencyModal 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />

      <SystemStatus sessionType="text" aiResponding={isTyping} listening={false} />

      <DisclaimerFooter />
    </div>
  );
};

export default TextTherapy;