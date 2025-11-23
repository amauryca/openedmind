import { useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DisclaimerFooter from "@/components/DisclaimerFooter";
import { Helmet } from "react-helmet-async";
import { Video, MessageCircle, HeartPulse, Brain, Wind, Footprints, NotebookPen, HeartHandshake, Scan, Waves, Timer, ListChecks, Moon, Quote, StopCircle, Heart, Compass, Clock, Snowflake, Zap, TreePine, Target, Filter, Music, Palette, User, Users, Mountain, Coffee, BookOpen, Sparkles, Activity, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Interventions = () => {
  const canonical = useMemo(() => `${window.location.origin}/interventions`, []);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  useScrollAnimation();

  const categories = [
    { id: "all", name: "All Interventions", icon: Target },
    { id: "breathing", name: "Breathing & Calming", icon: Wind },
    { id: "grounding", name: "Grounding & Crisis", icon: Footprints },
    { id: "thought-work", name: "Thought Work & CBT", icon: Brain },
    { id: "body-movement", name: "Body & Movement", icon: HeartPulse },
    { id: "self-compassion", name: "Self-Compassion & Mood", icon: Heart },
    { id: "behavioral", name: "Behavioral & Action", icon: ListChecks },
  ];

  const interventions = [
    {
      id: "box-breathing",
      title: "Box Breathing (4-4-4-4)",
      icon: Wind,
      category: "breathing",
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
      category: "grounding",
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
      category: "thought-work",
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
      category: "body-movement",
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
      category: "self-compassion",
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
      category: "self-compassion",
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
      category: "body-movement",
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
      category: "body-movement",
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
      category: "breathing",
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
      category: "behavioral",
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
      category: "self-compassion",
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
      category: "breathing",
      summary: "Prepare for rest with a gentle routine to ease body and mind.",
      steps: [
        "Dim lights and silence notifications",
        "Practice 5 rounds of 4‑7‑8 breathing",
        "Stretch neck, shoulders, and back for 3 minutes",
        "List 3 tasks for tomorrow to offload the mind",
      ],
    },
    {
      id: "stop-technique",
      title: "STOP Technique",
      icon: StopCircle,
      category: "grounding",
      summary: "Emergency grounding for overwhelming moments using 4 quick steps.",
      steps: [
        "Stop: Pause whatever you're doing",
        "Take a breath: One deep, slow breath",
        "Observe: Notice thoughts, feelings, and body sensations without judgment",
        "Proceed: Choose your next step mindfully",
        "Use when feeling overwhelmed, angry, or about to react impulsively"
      ],
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness Meditation",
      icon: Heart,
      category: "self-compassion",
      summary: "Build self-compassion and emotional resilience through kind wishes.",
      steps: [
        "Start with yourself: 'May I be happy, may I be healthy, may I be at peace'",
        "Extend to someone you love: 'May you be happy, may you be healthy, may you be at peace'",
        "Include someone neutral: a stranger or acquaintance",
        "If ready, include someone difficult",
        "End by sending kindness to all beings everywhere"
      ],
    },
    {
      id: "values-clarification",
      title: "Values Clarification",
      icon: Compass,
      category: "thought-work",
      summary: "Connect with your core values to guide decisions and find motivation.",
      steps: [
        "List 5-10 things that matter most to you (family, creativity, justice, etc.)",
        "Choose your top 3 values from this list",
        "For each value, write one sentence about why it matters to you",
        "Identify one small action you can take today to honor one of these values",
        "Notice how connecting with values affects your mood and clarity"
      ],
    },
    {
      id: "worry-time",
      title: "Scheduled Worry Time",
      icon: Clock,
      category: "thought-work",
      summary: "Contain anxiety by designating specific time for worries.",
      steps: [
        "Set aside 15-20 minutes daily at the same time for worrying",
        "When worries arise outside this time, write them down and save for worry time",
        "During worry time, review your list and allow yourself to worry fully",
        "For each worry, ask: 'Is this within my control?' and 'What action can I take?'",
        "End worry time by engaging in a pleasant or grounding activity"
      ],
    },
    {
      id: "cold-water-reset",
      title: "Cold Water Reset",
      icon: Snowflake,
      category: "grounding",
      summary: "Use temperature change to quickly calm intense emotions and reset.",
      steps: [
        "Hold cold water or ice cubes in your hands for 30 seconds",
        "Splash cold water on your face and wrists",
        "Take slow, deep breaths while feeling the cold sensation",
        "Notice how the temperature shift affects your emotional intensity",
        "Use when emotions feel overwhelming or out of control"
      ],
    },
    {
      id: "tipp-technique",
      title: "TIPP (DBT Crisis Skills)",
      icon: Zap,
      category: "grounding",
      summary: "Four rapid techniques to change body chemistry and reduce crisis intensity.",
      steps: [
        "Temperature: Hold ice or splash cold water on face",
        "Intense exercise: Do jumping jacks or run in place for 10 minutes",
        "Paced breathing: Exhale longer than you inhale (4 in, 6 out)",
        "Paired muscle relaxation: Tense and release muscle groups",
        "Use when emotions are 7/10 or higher in intensity"
      ],
    },
    {
      id: "mindful-walking",
      title: "Mindful Walking",
      icon: TreePine,
      category: "body-movement",
      summary: "Combine movement with mindfulness to ground yourself in the present.",
      steps: [
        "Walk slowly, focusing on the sensation of your feet touching the ground",
        "Notice the rhythm of your steps and coordinate with your breathing",
        "Observe your surroundings with fresh eyes - colors, sounds, textures",
        "When your mind wanders, gently return attention to walking",
        "Walk for 5-10 minutes, either indoors or outside"
      ],
    },
    {
      id: "emotion-wheel",
      title: "Emotional Check-In Wheel",
      icon: Target,
      category: "behavioral",
      summary: "Identify and process emotions using a systematic approach.",
      steps: [
        "Rate your current emotion intensity from 1-10",
        "Name the primary emotion you're feeling (sad, angry, anxious, etc.)",
        "Identify any secondary emotions underneath (hurt under anger, fear under sadness)",
        "Ask: 'What does this emotion need right now?' (comfort, action, expression)",
        "Choose one small step to honor what the emotion is telling you"
      ],
    },
    {
      id: "expressive-writing",
      title: "Expressive Writing",
      icon: BookOpen,
      category: "self-compassion",
      summary: "Process difficult emotions through free-form journaling.",
      steps: [
        "Set a timer for 10-15 minutes",
        "Write continuously about what's bothering you without stopping or editing",
        "Don't worry about grammar, spelling, or making sense",
        "Let your deepest thoughts and feelings flow onto the page",
        "After writing, notice if you feel any emotional shift or relief"
      ],
    },
    {
      id: "opposite-action",
      title: "Opposite Action (DBT)",
      icon: TrendingUp,
      category: "behavioral",
      summary: "Change your mood by acting opposite to your emotional urge.",
      steps: [
        "Identify the emotion you're feeling and what it's urging you to do",
        "Ask: 'Does this emotion fit the facts?' and 'Is acting on it effective?'",
        "If no, do the opposite: approach when anxious, rest when manic, engage when depressed",
        "Do it all the way - facial expression, body language, thoughts",
        "Notice how your mood shifts when you act opposite to the urge"
      ],
    },
    {
      id: "radical-acceptance",
      title: "Radical Acceptance",
      icon: Mountain,
      category: "thought-work",
      summary: "Reduce suffering by fully accepting reality as it is, not as you wish it to be.",
      steps: [
        "Notice what you're fighting against or denying",
        "Acknowledge: 'This is the reality right now, whether I like it or not'",
        "Let go of bitterness and 'shoulds' - reality doesn't care what should be",
        "Turn your mind toward acceptance each time you notice rejection",
        "Ask: 'What can I do to move forward from here?'"
      ],
    },
    {
      id: "anchor-statement",
      title: "Personal Anchor Statements",
      icon: Compass,
      category: "grounding",
      summary: "Create personalized grounding phrases for intense moments.",
      steps: [
        "Write 3-5 short statements that feel true and calming to you",
        "Examples: 'This feeling will pass,' 'I am safe right now,' 'I've survived this before'",
        "Keep them on your phone or a card you carry",
        "During distress, repeat your anchor statements slowly",
        "Combine with slow breathing or hand on heart"
      ],
    },
    {
      id: "mindful-music",
      title: "Mindful Music Listening",
      icon: Music,
      category: "self-compassion",
      summary: "Use music intentionally to shift mood and process emotions.",
      steps: [
        "Choose a song that matches your current mood (don't fight it)",
        "Sit or lie down and listen with full attention - no multitasking",
        "Notice the layers: vocals, instruments, rhythm, silence between notes",
        "Then choose a song that reflects the mood you want to move toward",
        "Let the music carry you through the emotional transition"
      ],
    },
    {
      id: "art-emotion-release",
      title: "Art for Emotional Release",
      icon: Palette,
      category: "self-compassion",
      summary: "Express difficult emotions through creative art without judgment.",
      steps: [
        "Gather paper and any coloring materials (crayons, markers, paint)",
        "Without planning, draw or paint your current feeling",
        "Use colors, shapes, and lines that represent the emotion",
        "Don't aim for 'good art' - this is purely for release",
        "When finished, notice if the emotion has shifted or softened"
      ],
    },
    {
      id: "social-connection-plan",
      title: "Social Connection Plan",
      icon: Users,
      category: "behavioral",
      summary: "Combat isolation by scheduling meaningful social contact.",
      steps: [
        "List 3-5 people who generally lift your mood or feel safe",
        "Choose one low-pressure way to connect (text, call, coffee)",
        "Schedule it within the next 3 days - put it in your calendar",
        "If you feel resistance, start with just 15 minutes",
        "After connecting, note how you feel compared to before"
      ],
    },
    {
      id: "physiological-sigh",
      title: "Physiological Sigh",
      icon: Wind,
      category: "breathing",
      summary: "Rapidly reduce stress with a double-inhale exhale pattern.",
      steps: [
        "Inhale deeply through your nose",
        "Take a second, shorter inhale through your nose (to expand lungs fully)",
        "Exhale fully and slowly through your mouth",
        "Repeat 2-3 times",
        "This quickly offloads CO2 and calms the nervous system in seconds"
      ],
    },
    {
      id: "cognitive-defusion",
      title: "Cognitive Defusion",
      icon: Brain,
      category: "thought-work",
      summary: "Separate yourself from unhelpful thoughts by changing how you relate to them.",
      steps: [
        "Notice a sticky thought (e.g., 'I'm a failure')",
        "Add: 'I'm having the thought that...' in front of it",
        "Then say: 'I notice I'm having the thought that...'",
        "Visualize the thought as words on a screen, or leaves floating down a stream",
        "The goal is to watch thoughts without buying into them or fighting them"
      ],
    },
    {
      id: "micro-breaks",
      title: "Micro-Breaks Throughout the Day",
      icon: Coffee,
      category: "behavioral",
      summary: "Prevent burnout with intentional 2-5 minute breaks every hour.",
      steps: [
        "Set hourly reminders on your phone or computer",
        "Every hour, stop work and take a 2-5 minute break",
        "Do something restorative: stretch, breathe, walk, look outside",
        "Avoid screens during the break if possible",
        "Notice how these small pauses affect your energy and focus"
      ],
    },
    {
      id: "imagery-safe-place",
      title: "Safe Place Imagery",
      icon: Sparkles,
      category: "self-compassion",
      summary: "Create a mental sanctuary you can visit anytime for comfort.",
      steps: [
        "Close your eyes and imagine a place where you feel completely safe",
        "It can be real or imaginary - a beach, forest, room, or fantasy world",
        "Notice the details: what you see, hear, smell, feel",
        "Anchor it with a cue word (e.g., 'sanctuary' or 'peace')",
        "Return to this place whenever you need comfort or grounding"
      ],
    },
    {
      id: "pros-cons-list",
      title: "Pros & Cons List (Wise Mind)",
      icon: ListChecks,
      category: "thought-work",
      summary: "Make balanced decisions by weighing emotional and rational pros/cons.",
      steps: [
        "Draw a grid with 4 boxes: Pros of action, Cons of action, Pros of not acting, Cons of not acting",
        "Fill each box honestly without rushing",
        "Notice both emotional and logical pros/cons",
        "Review the full picture and ask: 'What does my wise mind say?'",
        "Decide based on both reason and emotion, not just one"
      ],
    },
    {
      id: "sensory-box",
      title: "Sensory Comfort Box",
      icon: HeartHandshake,
      category: "grounding",
      summary: "Keep a collection of comforting sensory items for crisis moments.",
      steps: [
        "Gather items for each sense: soft fabric, favorite scent, hard candy, calming image, soothing music",
        "Keep them in a dedicated box, bag, or drawer",
        "During distress, engage with 2-3 items slowly and mindfully",
        "Focus fully on the sensory experience",
        "This grounds you in the present and soothes the nervous system"
      ],
    },
    {
      id: "energy-tracking",
      title: "Energy & Mood Tracking",
      icon: Activity,
      category: "behavioral",
      summary: "Identify patterns by tracking your energy and mood throughout the day.",
      steps: [
        "Each day, rate your energy (1-10) and mood (1-10) at morning, afternoon, evening",
        "Note what you did before each rating (sleep, food, activity, social contact)",
        "After a week, look for patterns: What lifts your mood? What drains energy?",
        "Use insights to schedule important tasks during high-energy times",
        "Adjust daily habits based on what you learn"
      ],
    },
    {
      id: "self-soothing-touch",
      title: "Self-Soothing Touch",
      icon: Heart,
      category: "self-compassion",
      summary: "Use gentle physical touch to activate self-compassion and calm.",
      steps: [
        "Place one or both hands over your heart",
        "Feel the warmth and gentle pressure",
        "Take slow, deep breaths while keeping your hand in place",
        "Optional: gently stroke your arm, face, or give yourself a hug",
        "Notice the sense of comfort and safety this creates"
      ],
    },
  ];

  const filteredInterventions = selectedCategory === "all" 
    ? interventions 
    : interventions.filter(intervention => intervention.category === selectedCategory);

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
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">Empathetical Interventions & Exercises</h1>
          <p className="text-sm md:text-lg text-muted-foreground mt-3">
            Evidence-based tools you can use anytime to calm, think clearly, and self-support.
          </p>
          <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <Button variant="empathy" size="sm" className="md:size-auto" onClick={() => (window.location.href = "/realtime-support")}>
              <Video className="h-4 w-4 mr-2" /> Real-Time Support
            </Button>
            <Button variant="calm" size="sm" className="md:size-auto" onClick={() => (window.location.href = "/text-support")}>
              <MessageCircle className="h-4 w-4 mr-2" /> Text Support
            </Button>
          </div>
        </header>

        {/* Category filters */}
        <nav aria-label="Category filters" className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by category:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth md:flex-wrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs md:text-sm transition-colors whitespace-nowrap snap-start ${
                  selectedCategory === id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-foreground hover:bg-primary/10'
                }`}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4" />
                {name}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick navigation chips */}
        <nav aria-label="Quick navigation" className="mb-6 md:mb-8">
          <ul className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible py-2 md:py-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scroll-smooth md:flex-wrap md:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredInterventions.map((it) => (
              <li key={it.id}>
                <a href={`#${it.id}`} className="inline-block px-3 py-1.5 rounded-full border border-border text-xs md:text-sm text-foreground hover:bg-primary/10 transition-colors">
                  {it.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Interventions list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredInterventions.map(({ id, title, icon: Icon, summary, steps }) => (
            <article key={id} id={id} className="scroll-mt-24">
              <Card className="shadow-empathy scroll-reveal hover-scale">
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
