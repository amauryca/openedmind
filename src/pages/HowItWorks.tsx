import React from "react";
import NavBar from "@/components/NavBar";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <Card className="shadow-empathy">
            <CardHeader>
              <CardTitle>Frontend (Your Browser)</CardTitle>
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

          <Card className="shadow-empathy">
            <CardHeader>
              <CardTitle>AI & Backend</CardTitle>
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
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>1) Start</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 animate-fade-in">Choose your modality:</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/realtime-support"><Button variant="outline" size="sm">Real-Time</Button></Link>
                <Link to="/text-support"><Button variant="outline" size="sm">Text</Button></Link>
                <Link to="/interventions"><Button variant="outline" size="sm">Interventions</Button></Link>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>2) Converse</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Your inputs are validated and optionally analyzed (voice/face). The Edge Function generates an empathetical, age-adaptive response.</CardContent>
          </Card>
          <Card className="shadow-gentle">
            <CardHeader><CardTitle>3) Safety & Privacy</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">Emergency phrases trigger guidance. The app avoids storing sensitive data client-side beyond session state.</CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">System Architecture</h2>
          <Card className="shadow-empathy mb-6">
            <CardContent className="pt-6">
              <lov-presentation-mermaid>{`
graph TB
    User[User Browser] --> Frontend[React Frontend]
    Frontend --> TextMode[Text Support]
    Frontend --> RealtimeMode[Real-Time Support]
    Frontend --> Interventions[Interventions Library]
    
    TextMode --> Safety[Emergency Detection]
    RealtimeMode --> Safety
    
    Safety --> EdgeFunc[Supabase Edge Functions]
    EdgeFunc --> Gemini[Google Gemini AI]
    
    Gemini --> Response[AI Response]
    Response --> TTS[Text-to-Speech]
    TTS --> User
    
    Frontend --> LocalStorage[Local Storage - Privacy Protected]
    
    style User fill:#e8f5e9
    style Frontend fill:#bbdefb
    style EdgeFunc fill:#fff9c4
    style Gemini fill:#f8bbd0
    style LocalStorage fill:#c5e1a5
              `}</lov-presentation-mermaid>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Request Flow Diagrams</h2>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Support Flow</TabsTrigger>
              <TabsTrigger value="realtime">Real-Time Support Flow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-6">
              <Card className="shadow-empathy">
                <CardHeader>
                  <CardTitle>Text-Based Support Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <lov-presentation-mermaid>{`
sequenceDiagram
    participant User
    participant Browser
    participant Safety as Emergency Detection
    participant Edge as Edge Function
    participant AI as Gemini AI
    
    User->>Browser: Types message
    Browser->>Browser: Validate input
    Browser->>Safety: Check for crisis keywords
    
    alt Emergency Detected
        Safety-->>Browser: Show emergency resources
        Browser-->>User: Display crisis modal
    else Safe to proceed
        Browser->>Edge: Send message + context
        Note over Edge: Context includes:<br/>- Age<br/>- Language<br/>- Previous messages
        Edge->>AI: Generate empathetic response
        AI-->>Edge: AI response
        Edge-->>Browser: Return response
        Browser->>Browser: Store in local session
        Browser-->>User: Display message
    end
                  `}</lov-presentation-mermaid>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="realtime" className="mt-6">
              <Card className="shadow-empathy">
                <CardHeader>
                  <CardTitle>Real-Time Voice Support Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <lov-presentation-mermaid>{`
sequenceDiagram
    participant User
    participant Browser
    participant Speech as Speech Recognition
    participant Safety as Emergency Detection
    participant Edge as Edge Function
    participant AI as Gemini AI
    participant TTS as Text-to-Speech
    
    User->>Browser: Speaks into microphone
    Browser->>Speech: Capture audio
    Speech->>Speech: Convert speech to text
    Speech->>Safety: Check for crisis keywords
    
    alt Emergency Detected
        Safety-->>Browser: Show emergency resources
        Browser-->>User: Display + speak crisis message
    else Safe to proceed
        Speech->>Edge: Send text + context
        Note over Edge: Context includes:<br/>- Age<br/>- Language<br/>- Voice preferences
        Edge->>AI: Generate empathetic response
        AI-->>Edge: AI response
        Edge-->>Browser: Return response
        Browser->>TTS: Convert to speech
        TTS-->>User: Speak response
        Browser->>Browser: Store in local session
        Browser-->>User: Display text
    end
                  `}</lov-presentation-mermaid>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Safety & Emergency Detection</h2>
          <Card className="shadow-empathy">
            <CardContent className="pt-6">
              <lov-presentation-mermaid>{`
flowchart TD
    Start([User Input Received]) --> Validate[Input Validation]
    Validate --> Keywords{Contains<br/>Crisis Keywords?}
    
    Keywords -->|Yes| Analyze[AI-Powered<br/>Context Analysis]
    Analyze --> Severity{Severity<br/>Assessment}
    
    Severity -->|High Risk| Emergency[Show Emergency Modal]
    Emergency --> Resources[Display:<br/>- Crisis Hotlines<br/>- Professional Help<br/>- Safety Resources]
    
    Severity -->|Medium Risk| Gentle[Gentle Redirection]
    Gentle --> Support[Continue with<br/>Supportive Response]
    
    Keywords -->|No| Process[Process Normally]
    Process --> AI[Generate AI Response]
    AI --> Display[Display to User]
    
    Resources --> Log[Log Incident]
    Support --> AI
    
    style Start fill:#e8f5e9
    style Emergency fill:#ffcdd2
    style Resources fill:#fff9c4
    style Display fill:#bbdefb
              `}</lov-presentation-mermaid>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Privacy & Data Flow</h2>
          <Card className="shadow-empathy">
            <CardContent className="pt-6">
              <lov-presentation-mermaid>{`
graph LR
    User[User Device] -->|Encrypted| Browser[Browser Session]
    Browser -->|Temporary Storage| LocalStorage[Local Storage]
    Browser -->|HTTPS Only| EdgeFunc[Edge Functions]
    
    LocalStorage -.->|Session Only| Clear[Cleared on Exit]
    
    EdgeFunc -->|API Call| AI[AI Service]
    AI -->|Response Only| EdgeFunc
    
    EdgeFunc -.->|No Storage| NoStore[No Database Storage]
    
    subgraph "Your Device - Private"
        User
        Browser
        LocalStorage
        Clear
    end
    
    subgraph "Secure Backend"
        EdgeFunc
        NoStore
    end
    
    subgraph "External AI"
        AI
    end
    
    style LocalStorage fill:#c5e1a5
    style Clear fill:#a5d6a7
    style NoStore fill:#fff59d
    style User fill:#e1bee7
              `}</lov-presentation-mermaid>
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-semibold mb-2">Privacy Guarantees:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>All conversations stored locally in your browser only</li>
                  <li>Data cleared automatically when you close the session</li>
                  <li>No server-side conversation storage or databases</li>
                  <li>Encrypted HTTPS communication for all requests</li>
                  <li>No personal information required to use the service</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Age-Adaptive Response System</h2>
          <Card className="shadow-empathy">
            <CardContent className="pt-6">
              <lov-presentation-mermaid>{`
graph TD
    Input[User Input] --> Context[Build Context]
    Context --> Age{User Age<br/>Range}
    
    Age -->|0-1| Infancy[Infancy Mode<br/>Simple, soothing]
    Age -->|6-12| Child[Childhood Mode<br/>Age-appropriate language]
    Age -->|13-19| Teen[Teen Mode<br/>Relatable, peer-like]
    Age -->|20-39| Young[Young Adult Mode<br/>Direct, practical]
    Age -->|40-64| Middle[Middle Age Mode<br/>Balanced approach]
    Age -->|65+| Senior[Senior Mode<br/>Respectful, clear]
    
    Infancy --> Prompt[Tailored AI Prompt]
    Child --> Prompt
    Teen --> Prompt
    Young --> Prompt
    Middle --> Prompt
    Senior --> Prompt
    
    Prompt --> Lang{Language<br/>Selection}
    Lang -->|12 Languages| Localized[Localized Response]
    
    Localized --> Generate[Generate Response]
    Generate --> Validate[Validate Safety]
    Validate --> Deliver[Deliver to User]
    
    style Age fill:#bbdefb
    style Prompt fill:#fff9c4
    style Generate fill:#c5e1a5
    style Deliver fill:#f8bbd0
              `}</lov-presentation-mermaid>
            </CardContent>
          </Card>
        </section>

        <article className="prose prose-neutral dark:prose-invert max-w-none mb-10">
          <h2>Step-by-Step Process</h2>
          <ol>
            <li><strong>User Input:</strong> Message typed or speech recognized in the browser</li>
            <li><strong>Validation:</strong> Input sanitized and checked for emergency keywords</li>
            <li><strong>Context Building:</strong> Age, language, and conversation history compiled</li>
            <li><strong>Edge Function Call:</strong> Supabase Edge Function invoked with full context</li>
            <li><strong>AI Processing:</strong> Google Gemini AI generates age-appropriate, empathetic response</li>
            <li><strong>Response Delivery:</strong> Text displayed and optionally spoken via TTS</li>
            <li><strong>Session Continuation:</strong> Conversation stored locally until session ends</li>
          </ol>
        </article>

        <div className="mt-10 text-center">
          <Link to="/text-support"><Button variant="empathy">Begin Text Session</Button></Link>
        </div>
      </main>

      <DisclaimerFooter />
    </div>
  );
};

export default HowItWorks;
