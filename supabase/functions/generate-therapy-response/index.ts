import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

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
    'child': 'You are a caring child therapist. Use simple, warm language. Keep responses under 20 words.',
    'teen': 'You are a teen therapist. Be relatable and supportive. Keep responses under 25 words.',
    'young-adult': 'You are a therapist for young adults. Be empathetic and practical. Keep responses under 30 words.',
    'adult': 'You are a professional therapist. Use evidence-based approaches. Keep responses under 30 words.',
    'senior': 'You are a respectful therapist for older adults. Honor their experience. Keep responses under 30 words.'
  };

  const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
  
  let emotionalContext = '';
  if (context.mood || context.emotion) {
    emotionalContext = `\n\nThe client appears to be feeling ${context.mood || 'unknown'} and their emotional state seems ${context.emotion || 'neutral'}. Please acknowledge these feelings appropriately.`;
  }

  const coreInstructions = `
CRITICAL RULES - NEVER BREAK THESE:
1. You are ONLY a therapist. Do not discuss other topics.
2. If asked about non-therapy topics, redirect: "Let's focus on your feelings and wellbeing."
3. For inappropriate content, respond: "I'm here to support your mental health in a safe space."
4. Keep responses therapeutic, empathetic, and under the word limit.
5. Always guide back to emotional wellbeing and self-reflection.`;

  return `${systemRole}${emotionalContext}${coreInstructions}\n\nProvide a brief, therapeutic response that validates feelings. Stay strictly within your role as a therapist.`;
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
        'child': 'Create a warm, brief welcome for a child starting therapy.',
        'teen': 'Create a genuine, concise welcome for a teenager.',
        'young-adult': 'Create a brief welcoming message for a young adult.',
        'adult': 'Create a professional but warm, brief welcome for an adult.',
        'senior': 'Create a respectful, concise welcome for an older adult.'
      };

      const instruction = welcomeInstructions[context.age as keyof typeof welcomeInstructions] || welcomeInstructions.adult;
      
      messages = [
        {
          role: "system",
          content: `You are a professional therapist meeting a new client for the first time. ${instruction}`
        },
        {
          role: "user",
          content: "Hi, I'm here for my first therapy session."
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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com',
        'X-Title': 'Therapy Chat Assistant'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages,
        max_tokens: context?.sessionType === 'realtime' ? 50 : 80,
        temperature: 0.5,
        top_p: 0.8,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
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