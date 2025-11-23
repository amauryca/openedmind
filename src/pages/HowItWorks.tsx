import React from "react";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Zap, Lock, Globe, MessageCircle, Mic } from "lucide-react";

const HowItWorks: React.FC = () => {
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
          <Card className="shadow-empathy hover-scale">
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

          <Card className="shadow-empathy hover-scale">
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
          <Card className="shadow-gentle hover-scale">
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
          <Card className="shadow-gentle hover-scale">
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
          <Card className="shadow-gentle hover-scale">
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
            <Card className="shadow-empathy hover-scale">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Emergency Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                AI-powered crisis keyword detection with context analysis. High-risk situations trigger immediate emergency resources and professional help information.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale">
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Age-Adaptive AI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Responses tailored to 6 age groups (Infancy to Senior) with appropriate language, tone, and guidance. The AI adjusts complexity and approach based on user age.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>12 Languages</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Full support for English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, and Russian with localized responses.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale">
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                All conversations stored locally in your browser only. No server-side storage, no databases, no personal information required. Data cleared on session end.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale">
              <CardHeader>
                <Mic className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Voice Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Real-time speech recognition with text-to-speech responses. Speak naturally and receive empathetic voice replies in your chosen language.
              </CardContent>
            </Card>

            <Card className="shadow-empathy hover-scale">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Request Flow</h2>
          <Card className="shadow-empathy">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">User Input</h3>
                    <p className="text-sm text-muted-foreground">Message typed or speech recognized in the browser</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Validation & Safety Check</h3>
                    <p className="text-sm text-muted-foreground">Input sanitized and checked for emergency keywords using AI-powered context analysis</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Context Building</h3>
                    <p className="text-sm text-muted-foreground">Age, language, mood, and conversation history compiled for personalized response</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Edge Function Call</h3>
                    <p className="text-sm text-muted-foreground">Supabase Edge Function invoked with full context via secure HTTPS</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">AI Processing</h3>
                    <p className="text-sm text-muted-foreground">Google Gemini AI generates age-appropriate, culturally sensitive, empathetic response</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">6</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Response Delivery</h3>
                    <p className="text-sm text-muted-foreground">Text displayed in chat and optionally spoken via text-to-speech in selected language</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">7</div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Session Continuation</h3>
                    <p className="text-sm text-muted-foreground">Conversation stored locally in browser until session ends - no server-side data retention</p>
                  </div>
                </div>
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
