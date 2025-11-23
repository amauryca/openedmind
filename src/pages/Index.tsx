import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Video, MessageCircle, Brain, Heart, Globe, Shield, Mic, Bot } from "lucide-react";
import heroImage from "@/assets/therapy-hero.jpg";
import therapyOffice from "@/assets/therapy-office.jpg";
import mastLogo from "@/assets/mast-logo.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
const Index = () => {
  const navigate = useNavigate();
  useScrollAnimation();
  return <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Section - Apple Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-foreground mb-8 animate-fade-in leading-none">
              Opened Mind
            </h1>
            
            <p className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground mb-12 font-light tracking-tight max-w-4xl mx-auto animate-slide-in leading-tight">
              Advanced empathetic AI with personalized conversations and emotional intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in">
              <Button 
                onClick={() => navigate("/realtime-support")} 
                size="lg" 
                className="text-base px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Real-Time Support
              </Button>
              <Button 
                onClick={() => navigate("/text-support")} 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 rounded-full border-2 hover:bg-accent transition-all duration-300"
              >
                Begin Text Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Apple Style */}
      <section className="py-32 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Advanced Technology
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Combining intelligence, empathy, and security for personalized mental health support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Intelligent Analysis */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Brain className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Intelligent Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  AI-powered emotional intelligence that understands context and provides meaningful insights.
                </p>
              </CardContent>
            </Card>

            {/* Age-Adaptive AI */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Heart className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Age-Adaptive</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Personalized approach that adapts communication based on your age and needs.
                </p>
              </CardContent>
            </Card>

            {/* Multilingual Support */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Globe className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Global Access</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Available in multiple languages, making support accessible worldwide.
                </p>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Shield className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Private & Secure</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Your conversations remain completely confidential with no data storage.
                </p>
              </CardContent>
            </Card>

            {/* Voice Recognition */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Mic className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Voice Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Speech recognition with emotional tone analysis for deeper understanding.
                </p>
              </CardContent>
            </Card>

            {/* AI Responses */}
            <Card className="border-0 bg-card hover:shadow-xl transition-all duration-500 group scroll-reveal p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center">
                  <Bot className="h-14 w-14 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Compassionate AI</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Natural, empathetic responses that truly understand and care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Options Section - Apple Style */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Choose Your Experience
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              Select the format that works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Real-Time Support Card */}
            <Card className="border-0 bg-card hover:shadow-2xl transition-all duration-500 scroll-reveal overflow-hidden group">
              <CardHeader className="text-center pb-6 pt-12">
                <div className="mx-auto mb-8 w-20 h-20 flex items-center justify-center">
                  <Video className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardTitle className="text-3xl font-semibold mb-4">Real-Time Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-8 px-8 pb-12">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Experience live facial analysis, voice emotion detection, and real-time AI responses for immersive support.
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge variant="secondary" className="text-sm px-4 py-2">Video Analysis</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Voice Detection</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Live AI</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Text-to-Speech</Badge>
                </div>

                <Button 
                  onClick={() => navigate("/realtime-support")} 
                  size="lg" 
                  className="w-full mt-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Real-Time Session
                </Button>
              </CardContent>
            </Card>

            {/* Text Support Card */}
            <Card className="border-0 bg-card hover:shadow-2xl transition-all duration-500 scroll-reveal overflow-hidden group">
              <CardHeader className="text-center pb-6 pt-12">
                <div className="mx-auto mb-8 w-20 h-20 flex items-center justify-center">
                  <MessageCircle className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardTitle className="text-3xl font-semibold mb-4">Text-Based Session</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-8 px-8 pb-12">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Traditional chat-based support perfect for those who prefer written communication and thoughtful conversations.
                </p>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge variant="secondary" className="text-sm px-4 py-2">Chat Interface</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">AI Analysis</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Written</Badge>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Secure</Badge>
                </div>

                <Button 
                  onClick={() => navigate("/text-support")} 
                  variant="outline" 
                  size="lg" 
                  className="w-full mt-8 rounded-full border-2 hover:bg-accent py-6 text-base transition-all duration-300"
                >
                  Begin Text Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <DisclaimerFooter />

      {/* Footer - Apple Style */}
      <footer className="py-16 bg-muted/30 relative border-t">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">openedmind.org</h3>
          <p className="text-muted-foreground mb-8 text-lg font-light">
            Empowering emotional intelligence through advanced AI
          </p>
          <p className="text-sm text-muted-foreground font-light">
            © 2025 Amaury Castillo-Acevedo. All rights reserved.
          </p>
          
          {/* Easter Egg - MAST Logo */}
          <div 
            onClick={() => navigate("/dedication")}
            className="absolute bottom-6 right-6 w-8 h-8 opacity-10 hover:opacity-100 transition-opacity duration-500 cursor-pointer group"
            title="🥚"
          >
            <img 
              src={mastLogo} 
              alt="" 
              className="w-full h-full rounded-full group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;