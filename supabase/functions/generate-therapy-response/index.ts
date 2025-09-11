import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TherapyContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
}

const createSystemPrompt = (context: TherapyContext): string => {
  const systemInstructions = {
    'child': 'You are OpenedMind, a warm and caring friend who helps kids understand their feelings. Speak like a kind older sibling who really listens. Use simple words but show genuine care.',
    'teen': 'You are OpenedMind, a supportive companion who truly gets what teens go through. Be authentic, relatable, and show real empathy. Speak naturally like someone who genuinely cares.',
    'young-adult': 'You are OpenedMind, a thoughtful guide who understands the complexities of young adult life. Be genuine, insightful, and offer perspective with warmth and understanding.',
    'adult': 'You are OpenedMind, a wise and empathetic companion. Share thoughtful reflections, ask meaningful questions, and respond with the depth and understanding of someone who truly cares.',
    'senior': 'You are OpenedMind, a respectful and understanding companion who honors life experience. Offer thoughtful insights and show deep respect for the wisdom that comes with age.'
  };

  const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
  
  let emotionalContext = '';
  if (context.mood || context.emotion) {
    emotionalContext = `\n\nI notice you seem to be feeling ${context.mood || 'something'} and your emotional state appears ${context.emotion || 'complex'}. I want to understand and be here with you through this.`;
  }

  const coreInstructions = `
CONVERSATION APPROACH:
- Be genuinely curious about their inner world
- Ask thoughtful follow-up questions that show you're really listening
- Share gentle insights when appropriate, not just advice
- Validate their feelings deeply and specifically
- Use "I wonder" and "It sounds like" to explore with them
- Be present and authentic, like a caring human friend
- Acknowledge the courage it takes to share feelings
- Sometimes just sit with their emotions without rushing to fix

THERAPEUTIC BOUNDARIES:
- Stay focused on emotional wellbeing and self-discovery
- If they discuss other topics, gently redirect: "I'm curious how that connects to what you're feeling inside?"
- For concerning content: "I care about your safety. Let's talk about getting you proper support."
- Be human-like but maintain professional care`;

  return `${systemRole}${emotionalContext}${coreInstructions}\n\nRespond as someone who genuinely cares and wants to understand their experience. Be thoughtful, warm, and authentically human while maintaining therapeutic purpose.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, context, isWelcome } = await req.json();

    console.log('Generating therapy response:', { 
      age: context?.age, 
      sessionType: context?.sessionType,
      isWelcome,
      messageLength: userMessage?.length 
    });

    let messages;
    
    if (isWelcome) {
      const welcomeInstructions = {
        'child': 'Introduce yourself warmly as "OpenedMind" and ask genuinely how they are feeling. Show you care and are excited to get to know them.',
        'teen': 'Be authentic as "OpenedMind" - introduce yourself like a friend who really wants to understand their world. Ask what brings them here.',
        'young-adult': 'Introduce yourself thoughtfully as "OpenedMind" and ask what\'s on their mind or heart today. Show genuine interest in their experience.',
        'adult': 'Introduce yourself as "OpenedMind" with warmth and depth. Ask how they\'re doing and what would feel most helpful to explore together.',
        'senior': 'Introduce yourself respectfully as "OpenedMind" and ask how they\'re feeling today. Honor their experience and wisdom.'
      };

      const instruction = welcomeInstructions[context.age as keyof typeof welcomeInstructions] || welcomeInstructions.adult;
      
      messages = [
        {
          role: "system",
          content: `You are OpenedMind, a deeply caring and thoughtful companion who creates a safe space for authentic human connection. ${instruction} Be genuinely curious and show that you truly want to understand their inner world. Speak like someone who genuinely cares about them as a person.`
        },
        {
          role: "user",
          content: "Hi, I'm here for my first session."
        }
      ];
    } else {
      messages = [
        {
          role: "system",
          content: createSystemPrompt(context)
        },
        {
          role: "user",
          content: userMessage
        }
      ];
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: context?.sessionType === 'realtime' ? 50 : 80,
        temperature: 0.3,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No response generated');
    }

    // Clean up the response by removing any formatting and unwanted text
    const cleanedResponse = generatedText
      .replace(/\*\*Therapist\*\*[:\s]*/gi, '') // Remove **Therapist:** or **Therapist**
      .replace(/^Therapist[:\s]*/gi, '') // Remove "Therapist:" at start
      .replace(/\*\*[^*]*\*\*/g, '') // Remove any other **bold** formatting
      .replace(/^["\s]+|["\s]+$/g, '') // Remove quotes and whitespace at start/end
      .replace(/^[^a-zA-Z]*/, '') // Remove any non-letter characters at start
      .trim();

    console.log('Response generated successfully:', cleanedResponse.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      response: cleanedResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-therapy-response function:', error);
    
    // Fallback responses
    const fallbacks = {
      'child': "I'm here to listen to you. Can you tell me more about how you're feeling?",
      'teen': "That sounds really tough. I'm here to help you work through this. What's been the hardest part?",
      'young-adult': "Thank you for sharing that with me. It takes courage to open up. What would feel most helpful to explore?",
      'adult': "I hear what you're saying, and your feelings are valid. How can we work on this together?",
      'senior': "I appreciate you sharing this with me. Your experience and feelings matter. What support would be most helpful?"
    };
    
    const context = await req.json().then(body => body.context).catch(() => ({ age: 'adult' }));
    const fallbackResponse = fallbacks[context?.age as keyof typeof fallbacks] || fallbacks.adult;
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});