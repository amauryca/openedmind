import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { Video, Mic, Brain, ArrowLeft, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RealtimeTherapy = () => {
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [selectedAge, setSelectedAge] = useState<string>("");

  const ageGroups = [
    { id: "child", label: "Child (5-12)", color: "bg-green-100 text-green-800" },
    { id: "teen", label: "Teen (13-17)", color: "bg-blue-100 text-blue-800" },
    { id: "adult", label: "Adult (18+)", color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>Emotion-Aware Voice Therapy | NARA.I</title>
        <meta name="description" content="Experience real-time emotion-aware AI therapy with facial expression analysis, vocal tone detection, and personalized responses." />
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
              <Video className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Emotion-Aware Therapy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Real-Time Voice Therapy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience AI therapy that understands your emotions through facial expressions, voice tone, and speech patterns.
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
                    <Brain className="h-6 w-6 text-primary" />
                    Select Your Age Group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground mb-6">
                    NARA.I adapts its language, tone, and therapeutic approach based on your age group.
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
                          Optimized therapy approach for this age range
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
                      <Mic className="h-6 w-6 text-primary" />
                      Therapy Session
                    </span>
                    <Badge className={ageGroups.find(g => g.id === selectedAge)?.color}>
                      {ageGroups.find(g => g.id === selectedAge)?.label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
                    <div className="relative z-10 text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 animate-gentle-float" />
                      <p className="text-xl font-semibold mb-2">
                        {isSessionActive ? "Session Active" : "Ready to Begin"}
                      </p>
                      <p className="opacity-90">
                        {isSessionActive 
                          ? "NARA.I is listening and analyzing your emotions..."
                          : "Click start to begin your emotion-aware therapy session"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      variant={isSessionActive ? "destructive" : "hero"}
                      size="lg"
                      onClick={() => setIsSessionActive(!isSessionActive)}
                      className="flex items-center gap-2"
                    >
                      {isSessionActive ? (
                        <>
                          <Pause className="h-5 w-5" />
                          Stop Session
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Start Session
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedAge("")}
                    >
                      Change Age Group
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 pt-6 border-t">
                    <Card className="bg-gradient-card border-0">
                      <CardContent className="p-4 text-center">
                        <div className="h-12 w-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <Video className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Face Analysis</h3>
                        <p className="text-sm text-muted-foreground">Real-time emotion detection</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-card border-0">
                      <CardContent className="p-4 text-center">
                        <div className="h-12 w-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <Mic className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Voice Tone</h3>
                        <p className="text-sm text-muted-foreground">Vocal emotion analysis</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-card border-0">
                      <CardContent className="p-4 text-center">
                        <div className="h-12 w-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-3">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">AI Response</h3>
                        <p className="text-sm text-muted-foreground">Personalized therapy</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RealtimeTherapy;