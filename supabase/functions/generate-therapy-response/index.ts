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
    'child': 'You are a gentle, caring therapist for children ages 5-12. Use simple, warm language. Be encouraging and patient. Keep responses short and easy to understand.',
    'teen': 'You are an understanding therapist for teenagers ages 13-17. Be relatable and non-judgmental. Acknowledge their unique challenges without being preachy.',
    'young-adult': 'You are a supportive therapist for young adults ages 18-25. Address career, relationship, and independence challenges with empathy and practical guidance.',
    'adult': 'You are a professional therapist for adults ages 26-45. Use evidence-based approaches and help with work-life balance, relationships, and personal growth.',
    'senior': 'You are a respectful therapist for adults 45+. Honor their life experience while addressing health, transitions, and aging-related concerns.'
  };

  const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
  
  let emotionalContext = '';
  if (context.mood || context.emotion) {
    emotionalContext = `\n\nThe client appears to be feeling ${context.mood || 'unknown'} and their emotional state seems ${context.emotion || 'neutral'}. Please acknowledge these feelings appropriately.`;
  }

  return `${systemRole}${emotionalContext}\n\nYou are having a therapy session. Provide a helpful, empathetic response that validates the client's feelings and offers gentle guidance. Keep responses conversational and supportive.`;
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
        'child': 'Create a warm, simple welcome message for a child starting therapy. Make them feel safe and comfortable.',
        'teen': 'Create a genuine welcome message for a teenager. Avoid being patronizing and acknowledge their maturity.',
        'young-adult': 'Create a welcoming message for a young adult. Acknowledge their unique life stage challenges.',
        'adult': 'Create a professional but warm welcome message for an adult beginning therapy.',
        'senior': 'Create a respectful welcome message that honors the wisdom and experience of an older adult.'
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
        model: 'anthropic/claude-3.5-sonnet',
        messages,
        max_tokens: context?.sessionType === 'realtime' ? 150 : 300,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.2,
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

    console.log('Response generated successfully:', generatedText.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      response: generatedText.trim(),
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