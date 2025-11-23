import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Zap, Lock, Globe, MessageCircle, Mic, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  useScrollAnimation();
  
  const requestFlowSteps = [
    {
      id: 1,
      title: "User Input",
      description: "Message typed or speech recognized in the browser",
      details: "Users can type their message in the chat interface or use speech recognition for hands-free input. The Web Speech API captures voice input in real-time, converting it to text with high accuracy across 12 supported languages.",
      icon: MessageCircle
    },
    {
      id: 2,
      title: "Validation & Safety Check",
      description: "Input sanitized and checked for emergency keywords using AI-powered context analysis",
      details: "Every message undergoes input validation to prevent XSS attacks and malicious code. Simultaneously, an AI-powered emergency detection system analyzes the content for crisis keywords and self-harm indicators, considering context to minimize false positives.",
      icon: Shield
    },
    {
      id: 3,
      title: "Context Building",
      description: "Age, language, mood, and conversation history compiled for personalized response",
      details: "The system compiles a comprehensive context package including the user's age group (from 6 categories), selected language, emotional tone detected from previous messages, and the entire conversation history within the session.",
      icon: Brain
    },
    {
      id: 4,
      title: "Edge Function Call",
      description: "Supabase Edge Function invoked with full context via secure HTTPS",
      details: "The compiled context is sent to a Supabase Edge Function running on Deno. This serverless function handles all backend processing, ensuring scalability and security. All communication uses encrypted HTTPS protocols.",
      icon: Zap
    },
    {
      id: 5,
      title: "AI Processing",
      description: "Google Gemini AI generates age-appropriate, culturally sensitive, empathetic response",
      details: "Google Gemini 2.5 Flash processes the request with specialized prompts tailored to the user's age group. The AI considers cultural context, generates emotionally intelligent responses, and adapts its language complexity and tone appropriately.",
      icon: Brain
    },
    {
      id: 6,
      title: "Response Delivery",
      description: "Text displayed in chat and optionally spoken via text-to-speech in selected language",
      details: "The AI's response is displayed in the chat interface with smooth animations. For real-time sessions, the Web Speech API synthesizes the text into natural-sounding speech in the user's selected language, creating a more immersive experience.",
      icon: MessageCircle
    },
    {
      id: 7,
      title: "Session Continuation",
      description: "Conversation stored locally in browser until session ends - no server-side data retention",
      details: "All conversation data is stored exclusively in the browser's localStorage. This ensures complete privacy as no messages are ever stored on servers. When the session ends, all data is automatically cleared, leaving no trace of the conversation.",
      icon: Lock
    }
  ];

  const canonical = typeof window !== "undefined" ? `${window.location.origin}/how-it-works` : "/how-it-works";
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>openedmind.org: How it works – AI Flow</title>
        <meta name="description" content="Learn how openedmind.org works: real-time and text-based empathetical support, AI responses, safety, and privacy." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <NavBar />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">How openedmind.org Works</h1>
          <p className="text-lg text-muted-foreground mt-3">End-to-end flow of our age-adaptive AI empathetical support experience</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 mb-10">
          <Card className="shadow-empathy hover-scale scroll-reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Frontend (Your Browser)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Built with React + Vite + Tailwind. No server render, fully client-side.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-Time Session: optional camera/microphone for live analysis.</li>
                <li>Text Session: chat interface with safe input handling.</li>
                <li>Safety: emergency keyword detection and input validation.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-empathy hover-scale scroll-reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI & Backend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>AI responses are generated using Gemini 2.5 Flash</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Age-aware prompts and empathetic replies</li>
                <li>Secure API communication via Supabase Edge Functions</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="shadow-gentle hover-scale scroll-reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">1</span>
                Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Choose your modality:</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/realtime-support"><Button variant="outline" size="sm">Real-Time</Button></Link>
                <Link to="/text-support"><Button variant="outline" size="sm">Text</Button></Link>
                <Link to="/interventions"><Button variant="outline" size="sm">Interventions</Button></Link>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-gentle hover-scale scroll-reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">2</span>
                Converse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Your inputs are validated and optionally analyzed (voice/face). The Edge Function generates an empathetical, age-adaptive response.
            </CardContent>
          </Card>
          <Card className="shadow-gentle hover-scale scroll-reveal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">3</span>
                Safety & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Emergency phrases trigger guidance. The app avoids storing sensitive data client-side beyond session state.
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Core Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Emergency Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                AI-powered crisis keyword detection with context analysis. High-risk situations trigger immediate emergency resources and professional help information.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Age-Adaptive AI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Responses tailored to 6 age groups (Infancy to Senior) with appropriate language, tone, and guidance. The AI adjusts complexity and approach based on user age.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>12 Languages</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Full support for English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, and Russian with localized responses.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                All conversations stored locally in your browser only. No server-side storage, no databases, no personal information required. Data cleared on session end.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Mic className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Voice Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Real-time speech recognition with text-to-speech responses. Speak naturally and receive empathetic voice replies in your chosen language.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale scroll-reveal">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Instant Response</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Fast AI-powered responses using Google Gemini 2.5 Flash. Context-aware conversations that remember your chat history within each session.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Interactive Request Flow</h2>
          <p className="text-center text-muted-foreground mb-8">Click on any step to learn more</p>
          
          <div className="grid gap-4 mb-6">
            {/* Step Navigation */}
            <div className="flex flex-wrap justify-center gap-3">
              {requestFlowSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2",
                    activeStep === step.id
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"
                  )}
                >
                  <span className="font-bold">{step.id}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                  {activeStep > step.id && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>

            {/* Active Step Details */}
            <Card className="shadow-xl border-2 border-primary/20 overflow-hidden">
              <CardContent className="pt-6">
                {requestFlowSteps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "transition-all duration-500",
                      activeStep === step.id ? "animate-fade-in" : "hidden"
                    )}
                  >
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                          <step.icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-primary">Step {step.id} of 7</span>
                          <div className="h-px flex-1 bg-border"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-base text-muted-foreground font-medium mb-4">{step.description}</p>
                        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                          <p className="text-sm text-foreground leading-relaxed">{step.details}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                        disabled={activeStep === 1}
                        className="gap-2"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Previous
                      </Button>
                      
                      <div className="flex gap-1">
                        {requestFlowSteps.map((s) => (
                          <div
                            key={s.id}
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              s.id === activeStep ? "w-8 bg-primary" : "w-2 bg-muted"
                            )}
                          />
                        ))}
                      </div>

                      <Button
                        onClick={() => setActiveStep(Math.min(7, activeStep + 1))}
                        disabled={activeStep === 7}
                        className="gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Complete Flow Overview</h3>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                {requestFlowSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => setActiveStep(step.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-md transition-colors duration-200",
                        activeStep === step.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-background text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {step.id}. {step.title}
                    </button>
                    {index < requestFlowSteps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Privacy Guarantees</h2>
          <Card className="shadow-empathy border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Local Storage Only</h3>
                    <p className="text-sm text-muted-foreground">All conversations stored in your browser, never on our servers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Auto-Delete</h3>
                    <p className="text-sm text-muted-foreground">Data automatically cleared when you close the session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">No Database</h3>
                    <p className="text-sm text-muted-foreground">Zero server-side conversation storage or long-term data retention</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Encrypted Communication</h3>
                    <p className="text-sm text-muted-foreground">All requests use HTTPS encryption for secure data transmission</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">No Personal Info</h3>
                    <p className="text-sm text-muted-foreground">No registration, no emails, no personal data collection required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Anonymous Usage</h3>
                    <p className="text-sm text-muted-foreground">Use the service completely anonymously with zero tracking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-10 text-center space-y-4">
          <Link to="/text-support"><Button variant="empathy" size="lg" className="mr-3">Begin Text Session</Button></Link>
          <Link to="/realtime-support"><Button variant="outline" size="lg">Try Real-Time Support</Button></Link>
        </div>
      </main>

      <DisclaimerFooter />
    </div>
  );
};

export default HowItWorks;
