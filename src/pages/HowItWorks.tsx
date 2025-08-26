import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { Brain, Video, MessageCircle, Heart, Shield, Globe, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Choose Your Approach",
      description: "Select between emotion-aware voice therapy or text-based counseling based on your comfort level."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Age & Language Adaptation",
      description: "NARA.I adapts its communication style, vocabulary, and therapeutic approach to your age group and preferred language."
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Real-time Analysis",
      description: "For voice therapy, we analyze facial expressions, vocal tone, and speech patterns to understand your emotional state."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Personalized Response",
      description: "Our AI provides tailored therapeutic responses based on your emotional state, age, and individual needs."
    }
  ];

  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "Emotion-Aware Voice Therapy",
      description: "Real-time facial expression and vocal tone analysis for emotionally intelligent responses."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Text-Based Counseling",
      description: "Traditional chat-based therapy powered by advanced AI language models."
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Age-Adaptive AI",
      description: "Therapy approach automatically adjusts for children, teens, and adults."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multilingual Support",
      description: "Available in multiple languages with culturally sensitive approaches."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy & Security",
      description: "Your conversations are encrypted and protected with the highest security standards."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "24/7 Availability",
      description: "Access mental health support whenever you need it, day or night."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>How NARA.I Works | AI Therapy Platform</title>
        <meta name="description" content="Learn how NARA.I's advanced AI therapy platform uses emotion recognition and personalized approaches for effective mental health support." />
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

      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-soft px-4 py-2 rounded-full mb-6">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">How It Works</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Advanced AI Therapy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              NARA.I combines cutting-edge emotion recognition technology with personalized therapeutic approaches to provide effective mental health support for all ages.
            </p>
          </div>

          {/* How It Works Steps */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">The NARA.I Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-card hover:shadow-glow transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        {step.icon}
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        Step {index + 1}
                      </Badge>
                      <h3 className="font-semibold mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-card hover:shadow-glow transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary-soft rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Technology Section */}
          <section className="mb-20">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Advanced Technology Stack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Emotion Recognition
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Real-time facial expression analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Vocal tone and pitch detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Speech pattern analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Contextual emotion understanding
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Therapy Engine
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Advanced language models (Gemini Flash 2.0)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Age-adaptive communication
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Multilingual therapy support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Personalized therapeutic approaches
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="shadow-glow bg-gradient-primary text-white border-0">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Experience NARA.I?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Start your personalized AI therapy journey today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/realtime-therapy")}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Try Voice Therapy
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/text-therapy")}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Try Text Therapy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default HowItWorks;