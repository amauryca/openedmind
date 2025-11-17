import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportContext {
  age: string;
  sessionType: 'realtime' | 'text';
  mood?: string;
  emotion?: string;
  previousMessages?: string[];
  language?: string;
}

const createSystemPrompt = (context: SupportContext): string => {
  const systemInstructions = {
    'child': 'You are OpenedMind, a supportive friend helping kids with their feelings. Use simple, kind words. Keep responses to 2-3 short sentences.',
    'teen': 'You are OpenedMind, a supportive companion for teens. Be authentic and understanding. Keep responses focused and concise (2-3 sentences).',
    'young-adult': 'You are OpenedMind, helping young adults navigate emotional challenges. Be insightful yet concise (2-3 sentences).',
    'adult': 'You are OpenedMind, an empathetic emotional support companion. Provide thoughtful, focused responses (2-3 sentences).',
    'senior': 'You are OpenedMind, offering respectful emotional support. Honor their experience with thoughtful, concise responses (2-3 sentences).'
  };

  const systemRole = systemInstructions[context.age as keyof typeof systemInstructions] || systemInstructions.adult;
  
  let emotionalContext = '';
  if (context.mood || context.emotion) {
    emotionalContext = `\nTheir current emotional state: ${context.mood || 'unknown'}, ${context.emotion || 'complex emotions'}.`;
  }

  // Map language codes to proper language names for better AI understanding
  const languageNames: Record<string, string> = {
    'english': 'English',
    'spanish': 'Spanish (Español)',
    'french': 'French (Français)',
    'german': 'German (Deutsch)',
    'italian': 'Italian (Italiano)',
    'portuguese': 'Portuguese (Português)',
    'russian': 'Russian (Русский)',
    'japanese': 'Japanese (日本語)',
    'korean': 'Korean (한국어)',
    'chinese': 'Chinese (中文)',
    'arabic': 'Arabic (العربية)',
    'hindi': 'Hindi (हिन्दी)'
  };
  
  const targetLanguage = context.language ? languageNames[context.language.toLowerCase()] || context.language : 'English';
  
  const languageInstruction = context.language && context.language !== 'english' 
    ? `\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST respond ENTIRELY in ${targetLanguage}. Every single word of your response must be in ${targetLanguage}, NOT in English. This is non-negotiable. Do not mix languages.` 
    : '';

  const coreInstructions = `

CORE RULES:
1. ONLY discuss emotions, feelings, mental wellbeing, and coping strategies
2. If user asks about unrelated topics (sports, weather, facts, etc.), respond: "I'm here specifically to support your emotional wellbeing. What's something you're feeling today?"
3. Ask ONE focused question to help them explore their feelings deeper
4. Validate their emotions specifically (e.g., "Feeling anxious about that makes complete sense")
5. Keep responses SHORT - 2-3 sentences maximum
6. Never give medical advice or diagnose conditions
7. For crisis situations, immediately say: "Your safety is most important. Please reach out to a crisis helpline or emergency services."

RESPONSE FORMAT:
- First sentence: Validate their feeling
- Second sentence: Brief insight or reflection
- Third sentence: One thoughtful question to explore deeper`;

  return `${systemRole}${emotionalContext}${languageInstruction}${coreInstructions}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, context, isWelcome } = await req.json();

    console.log('Generating empathetical response:', { 
      age: context?.age, 
      sessionType: context?.sessionType,
      isWelcome,
      messageLength: userMessage?.length,
      previousMessagesCount: context?.previousMessages?.length || 0
    });

    let messages;
    
    if (isWelcome) {
      const welcomeInstructions = {
        'child': 'Greet them warmly as a supportive friend. Use simple, kind words. Ask how they are feeling today. Keep it to 2 sentences.',
        'teen': 'Greet them authentically. Let them know you are here to listen without judgment. Ask what is on their mind. Keep it to 2 sentences.',
        'young-adult': 'Welcome them warmly. Introduce yourself as a safe space for their thoughts and feelings. Ask what brings them here. Keep it to 2 sentences.',
        'adult': 'Welcome them genuinely. Introduce yourself as emotional support. Ask how they are feeling. Keep it to 2 sentences.',
        'senior': 'Greet them respectfully. Express that you are honored to be here with them. Ask how they are doing. Keep it to 2 sentences.'
      };

      const instruction = welcomeInstructions[context.age as keyof typeof welcomeInstructions] || welcomeInstructions.adult;
      
      // Map language codes to proper names
      const languageNames: Record<string, string> = {
        'english': 'English',
        'spanish': 'Spanish (Español)',
        'french': 'French (Français)',
        'german': 'German (Deutsch)',
        'italian': 'Italian (Italiano)',
        'portuguese': 'Portuguese (Português)',
        'russian': 'Russian (Русский)',
        'japanese': 'Japanese (日本語)',
        'korean': 'Korean (한국어)',
        'chinese': 'Chinese (中文)',
        'arabic': 'Arabic (العربية)',
        'hindi': 'Hindi (हिन्दी)'
      };
      
      const targetLang = context.language ? languageNames[context.language.toLowerCase()] || context.language : 'English';
      
      const languageInstruction = context.language && context.language !== 'english' 
        ? ` CRITICAL: You must respond ENTIRELY in ${targetLang}. Do not use any English words. Every word must be in ${targetLang}.` 
        : '';
      
      messages = [
        {
          role: "system",
          content: `You are OpenedMind, an emotional support companion. ${instruction}${languageInstruction}`
        },
        {
          role: "user",
          content: "Hi, I'm here for my first session."
        }
      ];
    } else {
      // Build messages array with conversation history
      messages = [
        {
          role: "system",
          content: createSystemPrompt(context)
        }
      ];

      // Add conversation history if available
      if (context?.previousMessages && context.previousMessages.length > 0) {
        // Convert previous messages to alternating user/assistant format
        // Assuming messages alternate between user and AI
        for (let i = 0; i < context.previousMessages.length; i++) {
          const role = i % 2 === 0 ? "assistant" : "user"; // First message is AI welcome, so starts with assistant
          messages.push({
            role: role,
            content: context.previousMessages[i]
          });
        }
      }

      // Add current user message
      messages.push({
        role: "user",
        content: userMessage
      });
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
        max_tokens: 200,
        temperature: 0.7,
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

    // Clean up the response and ensure complete sentences
    let cleanedResponse = generatedText
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/\*\*Support\*\*[:\s]*/gi, '') // Remove **Support:** or **Support**
      .replace(/^Support[:\s]*/gi, '') // Remove "Support:" at start
      .replace(/\*\*[^*]*\*\*/g, '') // Remove any other **bold** formatting
      .replace(/\*[^*]+\*/g, '') // Remove italic formatting
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert markdown links to plain text
      .replace(/^["\s]+|["\s]+$/g, '') // Remove quotes and whitespace at start/end
      .replace(/^[^\p{L}\p{N}]*/u, '') // Remove non-letter/number at start (Unicode-aware for all scripts)
      .trim();

    // Ensure the response ends with proper punctuation for complete sentences
    // Support punctuation from multiple languages: . ! ? 。！？ । ।
    if (cleanedResponse && !cleanedResponse.match(/[.!?。！？।]$/u)) {
      // Find the last complete sentence with various punctuation marks
      const lastSentenceMatch = cleanedResponse.match(/^(.*[.!?。！？।])/u);
      if (lastSentenceMatch) {
        cleanedResponse = lastSentenceMatch[1].trim();
      } else {
        // If no complete sentence found, add appropriate punctuation based on likely script
        const hasEastAsianChars = /[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(cleanedResponse);
        const hasDevanagari = /[\u0900-\u097F]/.test(cleanedResponse);
        if (hasEastAsianChars) {
          cleanedResponse = cleanedResponse + '。';
        } else if (hasDevanagari) {
          cleanedResponse = cleanedResponse + '।';
        } else {
          cleanedResponse = cleanedResponse + '.';
        }
      }
    }

    console.log('Response generated successfully:', cleanedResponse.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      response: cleanedResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-support-response function:', error);
    
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