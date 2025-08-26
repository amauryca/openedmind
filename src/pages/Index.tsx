import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { Video, MessageCircle, Brain, Heart, Globe, Shield, ArrowRight, Sparkles, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import therapyHero from "@/assets/therapy-hero.jpg";
import aiTherapyBg from "@/assets/ai-therapy-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  const therapyModes = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Emotion-Aware Voice Therapy",
      description: "Real-time analysis of facial expressions, vocal tone, and speech patterns for emotionally intelligent AI responses.",
      features: ["Facial emotion detection", "Voice tone analysis", "Speech-to-text processing", "Age-adaptive responses"],
      route: "/realtime-therapy",
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Text-Based AI Therapy",
      description: "Traditional chat-based counseling powered by advanced AI language models with personalized therapeutic approaches.",
      features: ["Chat-based therapy", "Personalized responses", "Multi-language support", "Age-appropriate communication"],
      route: "/text-therapy",
      gradient: "bg-gradient-to-br from-green-500 to-teal-600"
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "3", label: "Age Groups Supported" },
    { icon: <Globe className="h-6 w-6" />, value: "24/7", label: "Available Support" },
    { icon: <Heart className="h-6 w-6" />, value: "100%", label: "Privacy Protected" },
    { icon: <Clock className="h-6 w-6" />, value: "Instant", label: "Response Time" }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>NARA.I - Personalized AI Therapy & Mental Health Support</title>
        <meta name="description" content="Experience advanced AI therapy with emotion-aware voice sessions and personalized text-based counseling. NARA.I adapts to your age and language for effective mental health support." />
        <meta name="keywords" content="AI therapy, mental health, emotional support, voice therapy, text therapy, personalized counseling" />
      </Helmet>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">NARA.I</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => navigate("/how-it-works")}>
                How It Works
              </Button>
              <Button variant="therapy" onClick={() => navigate("/realtime-therapy")}>
                Try Voice Therapy
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/40 to-background/60"></div>
          <img 
            src={therapyHero} 
            alt="Professional therapy environment" 
            className="w-full h-full object-cover opacity-40" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-xl rounded-full"></div>
              <Badge className="relative bg-primary-soft text-primary border-primary/20 px-6 py-2 text-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Advanced AI Therapy Platform
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Personalized AI Therapy
              </span>
              <br />
              <span className="text-foreground">for Every Age</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Experience revolutionary mental health support with NARA.I's emotion-aware voice therapy and adaptive text counseling that evolves with your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/realtime-therapy")}
                className="text-lg px-8 py-6 h-auto"
              >
                <Video className="h-6 w-6 mr-3" />
                Try Voice Therapy
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="calm" 
                size="lg"
                onClick={() => navigate("/text-therapy")}
                className="text-lg px-8 py-6 h-auto"
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                Try Text Therapy
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="h-12 w-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Therapy Modes Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src={aiTherapyBg} 
            alt="AI therapy technology" 
            className="w-full h-full object-cover opacity-10" 
          />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-primary-soft text-primary border-primary/20 mb-6 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Two Powerful Approaches
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Therapy Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              NARA.I offers two distinct modes of AI therapy, each designed to meet different preferences and needs for mental health support.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {therapyModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="shadow-card hover:shadow-glow transition-all duration-500 h-full group cursor-pointer"
                      onClick={() => navigate(mode.route)}>
                  <CardHeader>
                    <div className={`h-16 w-16 ${mode.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {mode.icon}
                    </div>
                    <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                      {mode.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {mode.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {mode.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      variant="therapy" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose NARA.I?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced AI therapy platform is designed with your mental health and privacy as the top priority.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Age-Adaptive AI",
                description: "Our AI automatically adjusts its communication style, vocabulary, and therapeutic approach based on your age group (child, teen, or adult)."
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Multilingual Support",
                description: "Available in multiple languages with culturally sensitive therapeutic approaches for diverse communities worldwide."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Privacy & Security",
                description: "Your conversations are encrypted end-to-end and protected with the highest security standards. Your data never leaves our secure servers."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-soft hover:shadow-card transition-all duration-300 h-full text-center border-0 bg-white/80">
                  <CardContent className="p-8">
                    <div className="h-16 w-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-glow bg-gradient-primary text-white border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
              <CardContent className="p-12 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Mental Health Journey?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Take the first step towards better mental health with NARA.I's personalized AI therapy. Choose your preferred approach and begin today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/realtime-therapy")}
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
                  >
                    <Video className="h-6 w-6 mr-3" />
                    Start Voice Therapy
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/text-therapy")}
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
                  >
                    <MessageCircle className="h-6 w-6 mr-3" />
                    Start Text Therapy
                  </Button>
                </div>
                <p className="text-sm mt-6 opacity-80">
                  Or <button 
                    onClick={() => navigate("/how-it-works")}
                    className="underline hover:no-underline transition-all"
                  >
                    learn how NARA.I works
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">NARA.I</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Personalized AI Therapy for Mental Health Support
            </p>
            <p className="text-sm text-muted-foreground">
              This is a demonstration of AI therapy technology. Always consult with licensed mental health professionals for serious mental health concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
