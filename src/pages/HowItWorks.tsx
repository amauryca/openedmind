import React from "react";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const HowItWorks: React.FC = () => {
  const canonical = typeof window !== "undefined" ? `${window.location.origin}/how-it-works` : "/how-it-works";
  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>openedmind.org: How it works – AI Therapy Flow</title>
        <meta name="description" content="Learn how openedmind.org works: real-time and text therapy, AI responses, safety, and privacy." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <NavBar />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">How openedmind.org Works</h1>
          <p className="text-lg text-muted-foreground mt-3">End-to-end flow of our age-adaptive AI therapy experience</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 mb-10">
          <Card className="shadow-therapy">
            <CardHeader>
              <CardTitle>Frontend (Your Browser)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Built with React + Vite + Tailwind. No server render, fully client-side.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-Time Therapy: optional camera/microphone for live analysis.</li>
                <li>Text Therapy: chat interface with safe input handling.</li>
                <li>Safety: emergency keyword detection and input validation.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-therapy">
            <CardHeader>
              <CardTitle>AI & Backend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>AI responses are generated locally using OpenAI's open-source GPT-OSS model.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Model: GPT-OSS-20b running in browser</li>
                <li>Age-aware prompts and empathetic replies</li>
                <li>No data sent to external servers</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>1) Start</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 animate-fade-in">Choose your modality:</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/realtime-therapy"><Button variant="outline" size="sm">Real-Time</Button></Link>
                <Link to="/text-therapy"><Button variant="outline" size="sm">Text</Button></Link>
                <Link to="/interventions"><Button variant="outline" size="sm">Interventions</Button></Link>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>2) Converse</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Your inputs are validated and optionally analyzed (voice/face). The Edge Function generates an empathetic, age-adaptive response.</CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>3) Safety & Privacy</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Emergency phrases trigger guidance. The app avoids storing sensitive data client-side beyond session state.</CardContent>
          </Card>
        </section>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Request flow overview</h2>
          <ol>
            <li>User message or speech recognized in the browser.</li>
            <li>Input sanitized and checked for emergencies.</li>
            <li>Supabase Edge Function invoked with context (age, recent messages).</li>
            <li>Google AI returns the crafted therapeutic response.</li>
            <li>Response rendered, spoken (optional), and session continues.</li>
          </ol>
        </article>

        <div className="mt-10 text-center">
          <Link to="/text-therapy"><Button variant="therapy">Begin Text Therapy</Button></Link>
        </div>
      </main>

      <DisclaimerFooter />
    </div>
  );
};

export default HowItWorks;
