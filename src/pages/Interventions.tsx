import { useMemo } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Helmet } from "react-helmet-async";
import { Video, MessageCircle, HeartPulse, Brain, Wind, Footprints, NotebookPen, HeartHandshake, Scan, Waves, Timer, ListChecks, Moon, Quote } from "lucide-react";

const Interventions = () => {
  const canonical = useMemo(() => `${window.location.origin}/interventions`, []);

  const interventions = [
    {
      id: "box-breathing",
      title: "Box Breathing (4-4-4-4)",
      icon: Wind,
      summary: "A quick calming technique to reduce anxiety and steady your nervous system.",
      steps: [
        "Breathe in through your nose for 4 seconds",
        "Hold your breath for 4 seconds",
        "Exhale slowly through your mouth for 4 seconds",
        "Hold with empty lungs for 4 seconds",
        "Repeat for 3–5 minutes"
      ],
    },
    {
      id: "grounding-54321",
      title: "5-4-3-2-1 Grounding",
      icon: Footprints,
      summary: "Bring attention to the present by engaging your five senses.",
      steps: [
        "Notice 5 things you can see",
        "Notice 4 things you can feel",
        "Notice 3 things you can hear",
        "Notice 2 things you can smell",
        "Notice 1 thing you can taste"
      ],
    },
    {
      id: "thought-record",
      title: "Thought Record (CBT)",
      icon: Brain,
      summary: "Challenge unhelpful thoughts with evidence and balanced alternatives.",
      steps: [
        "Situation: Briefly describe what happened",
        "Automatic Thought: What went through your mind?",
        "Emotion: What did you feel (0–100%)?",
        "Evidence For/Against: What supports or challenges the thought?",
        "Balanced Thought: Write a more helpful, realistic thought",
      ],
    },
    {
      id: "pmr",
      title: "Progressive Muscle Relaxation",
      icon: HeartPulse,
      summary: "Release tension by tensing and relaxing muscle groups head-to-toe.",
      steps: [
        "Start with your hands: tense for 5 seconds, then release for 10",
        "Move to arms, shoulders, face, chest, stomach, legs, and feet",
        "Breathe slowly and notice the contrast between tension and relaxation",
        "End with a gentle body scan noticing areas of calm",
      ],
    },
    {
      id: "gratitude-journal",
      title: "Gratitude Journal (3 Good Things)",
      icon: NotebookPen,
      summary: "Shift attention to positives by noting three good things from today.",
      steps: [
        "Write down 3 things that went well today",
        "For each, note why it happened and how it made you feel",
        "Re-read your list slowly and notice any body sensations",
        "Optional: Share one with a friend or keep a daily log",
      ],
    },
    {
      id: "self-compassion",
      title: "Self-Compassion Break",
      icon: HeartHandshake,
      summary: "Offer yourself kindness in difficult moments using 3 short statements.",
      steps: [
        "Mindfulness: ‘This is a moment of suffering.’",
        "Common Humanity: ‘Suffering is part of being human.’",
        "Kindness: ‘May I be kind to myself right now.’",
        "Place a hand on your heart and breathe gently",
      ],
    },
    {
      id: "body-scan",
      title: "Body Scan (3–5 min)",
      icon: Scan,
      summary: "Increase awareness and release tension by scanning from head to toe.",
      steps: [
        "Sit or lie down comfortably and close your eyes if safe",
        "Bring attention to your forehead, jaw, neck—soften each area",
        "Continue down shoulders, chest, abdomen, hips, legs, and feet",
        "If the mind wanders, gently return to the next body part",
      ],
    },
    {
      id: "urge-surfing",
      title: "Urge Surfing",
      icon: Waves,
      summary: "Ride out difficult urges like waves without acting on them.",
      steps: [
        "Notice the urge in the body: location, shape, intensity",
        "Breathe slowly and imagine the urge rising, peaking, and falling",
        "Remind yourself: ‘Urges are temporary; they always pass’",
        "Choose a valued action after the wave subsides",
      ],
    },
    {
      id: "mindfulness-minute",
      title: "Mindfulness Minute",
      icon: Timer,
      summary: "Reset with a 60‑second focus on the breath and senses.",
      steps: [
        "Set a 1‑minute timer",
        "Inhale for 4, exhale for 6 — repeat gently",
        "On distraction, say ‘thinking’ and return to breath",
        "Open awareness to one sound and one sensation before ending",
      ],
    },
    {
      id: "behavioral-activation",
      title: "Behavioral Activation (Small Step)",
      icon: ListChecks,
      summary: "Lift mood by scheduling one simple, rewarding activity today.",
      steps: [
        "Choose a 10‑minute activity (walk, call a friend, tidy a corner)",
        "Schedule a clear time and place",
        "Do it regardless of motivation level",
        "Afterward, rate mood (0–10) and note any benefit",
      ],
    },
    {
      id: "affirmations",
      title: "Positive Affirmations",
      icon: Quote,
      summary: "Reinforce supportive beliefs with short, believable statements.",
      steps: [
        "Pick 1–2 realistic statements (e.g., ‘I can handle this moment’)",
        "Say them slowly out loud or write them 3 times",
        "Visualize acting as if the statement is true",
        "Repeat daily at a consistent time",
      ],
    },
    {
      id: "sleep-winddown",
      title: "Sleep Wind‑Down (15 min)",
      icon: Moon,
      summary: "Prepare for rest with a gentle routine to ease body and mind.",
      steps: [
        "Dim lights and silence notifications",
        "Practice 5 rounds of 4‑7‑8 breathing",
        "Stretch neck, shoulders, and back for 3 minutes",
        "List 3 tasks for tomorrow to offload the mind",
      ],
    },
  ];

  const itemListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: interventions.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.title,
      description: it.summary,
      url: canonical + `#${it.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>Therapeutic Interventions & Exercises | openedmind.org</title>
        <meta name="description" content="Guided therapeutic interventions anyone can use: breathing, grounding, CBT thought records, and relaxation techniques." />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(itemListStructuredData)}</script>
      </Helmet>

      <NavBar />

      <main className="container max-w-6xl mx-auto px-4 py-10">
        <header className="mx-auto text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">Therapeutic Interventions & Exercises</h1>
          <p className="text-sm md:text-lg text-muted-foreground mt-3">
            Evidence-based tools you can use anytime to calm, think clearly, and self-support.
          </p>
          <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <Button variant="therapy" size="sm" className="md:size-auto" onClick={() => (window.location.href = "/realtime-therapy")}>
              <Video className="h-4 w-4 mr-2" /> Real-Time Therapy
            </Button>
            <Button variant="calm" size="sm" className="md:size-auto" onClick={() => (window.location.href = "/text-therapy")}>
              <MessageCircle className="h-4 w-4 mr-2" /> Text Therapy
            </Button>
          </div>
        </header>

        {/* Quick navigation chips */}
        <nav aria-label="Quick navigation" className="mb-6 md:mb-8">
          <ul className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible py-2 md:py-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth md:flex-wrap md:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {interventions.map((it) => (
              <li key={it.id}>
                <a href={`#${it.id}`} className="inline-block px-3 py-1.5 rounded-full border border-border text-xs md:text-sm text-foreground hover:bg-primary/10 transition-colors">
                  {it.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Interventions list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {interventions.map(({ id, title, icon: Icon, summary, steps }) => (
            <article key={id} id={id} className="scroll-mt-24">
              <Card className="shadow-therapy animate-fade-in hover-scale">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="p-2 rounded-md bg-gradient-primary text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{summary}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="steps">
                      <AccordionTrigger className="text-sm md:text-base py-2">Show guided steps</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2">
                          {steps.map((s, i) => (
                            <li key={i} className="text-sm md:text-base text-foreground">{s}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>

        <aside className="max-w-3xl mx-auto text-center mt-10 text-sm text-muted-foreground">
          These tools support well-being but are not a substitute for professional care.
        </aside>
      </main>

      <DisclaimerFooter />
    </div>
  );
};

export default Interventions;
