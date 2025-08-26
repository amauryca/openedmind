import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Video, MessageCircle, Brain, Heart, Globe, Shield, Mic, Bot } from "lucide-react";
import heroImage from "@/assets/therapy-hero.jpg";
import therapyOffice from "@/assets/therapy-office.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
const Index = () => {
  const navigate = useNavigate();
  useScrollAnimation();
  return <div className="min-h-screen bg-gradient-calm">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Professional Therapy Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-background/20 to-background/40"></div>
          <img src={therapyOffice} alt="Professional therapy environment" className="w-full h-full object-cover object-center opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 -m-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-soft"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-primary/30 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-accent/30 rounded-full blur-xl animate-float delay-1000"></div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-white/20 rounded-full blur-lg animate-pulse-soft delay-500"></div>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 relative z-10 animate-fade-in">
                <span className="bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent drop-shadow-lg font-bold text-8xl">Opened
Mind</span>
                <span className="text-white/90 drop-shadow-lg"></span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in">
              Advanced therapeutic AI with personalized conversations and emotional intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
              <Button onClick={() => navigate("/realtime-therapy")} variant="therapy" size="lg" className="text-lg px-8 py-6">
                <Video className="h-6 w-6 mr-3" />
                Start Real-Time Therapy
              </Button>
              <Button onClick={() => navigate("/text-therapy")} variant="calm" size="lg" className="text-lg px-8 py-6">
                <MessageCircle className="h-6 w-6 mr-3" />
                Begin Text Therapy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Advanced Therapeutic Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI therapist combines multiple advanced technologies to provide personalized, 
              age-appropriate mental health support in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Intelligent Analysis */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Intelligent Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Advanced AI-powered emotional intelligence that understands context 
                  and provides meaningful therapeutic insights.
                </p>
              </CardContent>
            </Card>

            {/* Age-Adaptive AI */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Age-Adaptive AI</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Personalized therapeutic approach that adapts communication style 
                  and methods based on your age and needs.
                </p>
              </CardContent>
            </Card>

            {/* Multilingual Support */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Global Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Available in multiple languages with cultural sensitivity, 
                  making mental health support accessible worldwide.
                </p>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Complete Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  End-to-end encryption ensures your conversations remain completely 
                  confidential with no personal data storage.
                </p>
              </CardContent>
            </Card>

            {/* Voice Recognition */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Voice Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Advanced speech recognition with emotional tone analysis 
                  for deeper therapeutic understanding.
                </p>
              </CardContent>
            </Card>

            {/* AI Responses */}
            <Card className="shadow-therapy hover:shadow-glow hover:scale-105 transition-all duration-300 ease-out group scroll-reveal">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center group-hover:animate-float transform-gpu">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Compassionate AI</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Natural, empathetic responses powered by advanced AI 
                  that truly understands and cares.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Therapy Types Section */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Therapy Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the therapy format that best suits your comfort level and needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Real-Time Therapy Card */}
            <Card className="shadow-therapy hover:scale-105 transition-bounce scroll-reveal card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center">
                  <Video className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Real-Time Therapy</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Experience cutting-edge therapy with live facial analysis, voice emotion detection, 
                  and real-time AI responses. Perfect for immersive therapeutic sessions.
                </p>
                
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">📹 Video Analysis</Badge>
                  <Badge variant="secondary" className="mr-2">🎤 Voice Detection</Badge>
                  <Badge variant="secondary" className="mr-2">🤖 Live AI Response</Badge>
                  <Badge variant="secondary">🔊 Text-to-Speech</Badge>
                </div>

                <Button onClick={() => navigate("/realtime-therapy")} variant="therapy" size="lg" className="w-full mt-6">
                  Start Real-Time Session
                </Button>
              </CardContent>
            </Card>

            {/* Text Therapy Card */}
            <Card className="shadow-therapy hover:scale-105 transition-bounce scroll-reveal card-hover">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Text-Based Therapy</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Traditional chat-based therapy with advanced AI. Perfect for those who prefer 
                  written communication and thoughtful, reflective conversations.
                </p>
                
                <div className="space-y-2">
                  <Badge variant="secondary" className="mr-2">💬 Chat Interface</Badge>
                  <Badge variant="secondary" className="mr-2">🧠 AI Analysis</Badge>
                  <Badge variant="secondary" className="mr-2">📝 Written Responses</Badge>
                  <Badge variant="secondary">🔒 Private & Secure</Badge>
                </div>

                <Button onClick={() => navigate("/text-therapy")} variant="calm" size="lg" className="w-full mt-6">
                  Begin Text Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <DisclaimerFooter />

      {/* Footer */}
      <footer className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">openedmind.org</h3>
          <p className="text-muted-foreground mb-6">
            Empowering emotional intelligence through advanced AI technology
          </p>
          <p className="text-sm text-muted-foreground">© 2025 Amaury Castillo-Acevedo. All rights reserved. | Your emotional well-being matters.</p>
        </div>
      </footer>
    </div>;
};
export default Index;