import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const getAgeAppropriatePrompt = (age: string) => {
  const prompts = {
    child: `You are a gentle, caring AI therapist for children ages 5-12. You can talk naturally about anything that builds trust and connection (like favorite activities, music, games, or stories) while staying focused on helping them feel safe and heard. Feel free to give specific recommendations when relevant (like suggesting "Roar" by Katy Perry for feeling brave). Always guide conversations back to understanding their feelings and encouraging them to share more. Use simple, warm language and validate their emotions. Keep responses under 30 words and at most 2 sentences for video sessions.`,
    
    teen: `You are an empathetic AI therapist for teenagers ages 13-17. You can engage with any topic that helps build rapport and trust (music, social media, school, hobbies, relationships) while maintaining your therapeutic purpose. Give specific recommendations when helpful (like suggesting "Good 4 U" by Olivia Rodrigo or "Sunflower" by Post Malone). Always steer back to creating a safe space for them to open up about their real feelings and experiences. Validate without judgment and focus on connection over solutions. Keep responses under 40 words and at most 2 sentences for video sessions.`,
    
    'young-adult': `You are a supportive AI therapist for young adults ages 18-25. You can discuss any topic that fosters connection and trust (career stress, relationships, music, lifestyle, current events) while staying grounded in your therapeutic role. Offer specific suggestions when relevant (like recommending "Anti-Hero" by Taylor Swift for self-reflection or "As It Was" by Harry Styles for processing change). Always bring conversations back to helping them explore their thoughts and feelings in a non-judgmental space. Keep responses under 40 words and at most 2 sentences for video sessions.`,
    
    adult: `You are a professional AI therapist for adults ages 26-45. You can engage naturally with any topic that builds therapeutic alliance (work stress, parenting, relationships, music, hobbies, life transitions) while maintaining your focus on emotional support. Give specific recommendations when appropriate (like suggesting "The Middle" by Jimmy Eat World for resilience or "Stronger" by Kelly Clarkson for empowerment). Always guide back to creating space for deeper sharing and self-reflection. Keep responses under 45 words and at most 2 sentences for video sessions.`,
    
    senior: `You are a respectful AI therapist for adults 45+. You can discuss any topic that creates connection and shows respect for their experience (family, music from their era, life wisdom, current interests) while staying focused on emotional support. Offer specific suggestions when fitting (like classic songs such as "Bridge Over Troubled Water" by Simon & Garfunkel for comfort). Always return to honoring their perspective and encouraging them to share their thoughts and feelings. Keep responses under 45 words and at most 2 sentences for video sessions.`
  };
  
  return prompts[age as keyof typeof prompts] || prompts.adult;
};

const getMoodContext = (mood?: string, emotion?: string) => {
  if (!mood && !emotion) return '';
  
  let context = '';
  if (mood) context += `The user's facial analysis indicates they appear ${mood.toLowerCase()}. `;
  if (emotion) context += `Their voice emotion analysis suggests they sound ${emotion.toLowerCase()}. `;
  context += 'Please acknowledge these emotional cues in your response when appropriate.';
  
  return context;
};

const getDefaultResponse = (age: string): string => {
  const defaults = {
    child: "I hear you, and I want you to know that what you're feeling is okay. Can you tell me more about what's happening?",
    teen: "Thanks for sharing that with me. It sounds like you're dealing with something important. What's been the hardest part about this situation?",
    'young-adult': "I appreciate you opening up about this. It takes courage to talk about difficult things. How has this been affecting you day to day?",
    adult: "Thank you for sharing that with me. I can hear that this is significant for you. What would be most helpful to explore together right now?",
    senior: "I value you sharing your thoughts with me. Your perspective and experience are important. How would you like to approach working through this together?"
  };
  
  return defaults[age as keyof typeof defaults] || defaults.adult;
};

const getWelcomeMessage = (age: string): string => {
  const welcomes = {
    child: "Hi there! I'm your friendly AI helper, and I'm so excited to talk with you today! What's been the best part of your day so far?",
    teen: "Hey! I'm here to listen and support you through whatever's on your mind. What's been going on with you lately?",
    'young-adult': "Hello! I'm here to create a safe space where you can share anything that's on your mind. What would you like to talk about today?",
    adult: "Welcome! I'm here to listen and support you through whatever you're experiencing. What's been weighing on your mind recently?",
    senior: "Good day! I'm honored to spend this time with you. What would you like to share or explore together today?"
  };
  
  return welcomes[age as keyof typeof welcomes] || welcomes.adult;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, context, isWelcome } = await req.json() as {
      userMessage?: string;
      context: TherapyContext;
      isWelcome?: boolean;
    };

    console.log('Received request:', { userMessage, context, isWelcome });

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('Gemini API key not configured');
      throw new Error('Gemini API key not configured');
    }

    const systemPrompt = getAgeAppropriatePrompt(context.age);
    const moodContext = getMoodContext(context.mood, context.emotion);
    const sessionContext = context.sessionType === 'realtime' 
      ? 'This is a real-time video therapy session with facial and voice analysis.' 
      : 'This is a text-based therapy session.';

    let fullPrompt;
    if (isWelcome) {
      fullPrompt = `${systemPrompt}

Please generate a warm, welcoming opening message for a therapy session. This should be the first thing you say to introduce yourself and make the user feel comfortable. The message should be age-appropriate and set a positive, safe tone for the session. Be proactive: briefly propose one gentle next step (e.g., a 10-second breathing check-in or inviting them to choose a topic) and ask one short, focused question. Keep it concise per the age-appropriate guidance. Use at most 2 sentences.`;
    } else {
      fullPrompt = `${systemPrompt}

${sessionContext}
${moodContext}

Previous context: ${context.previousMessages?.slice(-3).join(' ') || 'This is the beginning of the session.'}

User message: "${userMessage}"

Provide an empathetic, conversational response that prioritizes understanding and connection:
- Acknowledge their feelings and what they've shared
- Ask thoughtful, open-ended questions to encourage them to share more about their experience
- Show genuine curiosity about their thoughts, feelings, and situation
- Only offer coping strategies or exercises if they're clearly overwhelmed or specifically ask for help
- Focus on creating a safe space for them to open up and be heard
Keep it concise per the age guidance, avoid being prescriptive, and do not mention being an AI. Use at most 2 sentences.`;
    }

    console.log('Making Gemini 2.0 Flash Lite API request with prompt length:', fullPrompt.length);

    const requestBody = {
      contents: [{
        role: "user",
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 150,
        topK: 40,
        topP: 0.9,
        candidateCount: 1
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Updated API endpoint and headers based on new Gemini API approach
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Gemini API response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()]));

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} - ${responseText}`);
      
      // Return fallback based on request type
      const fallbackResponse = isWelcome ? getWelcomeMessage(context.age) : getDefaultResponse(context.age);
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response JSON:', parseError);
      const fallbackResponse = isWelcome ? getWelcomeMessage(context.age) : getDefaultResponse(context.age);
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('No response generated from Gemini API');
      const fallbackResponse = isWelcome ? getWelcomeMessage(context.age) : getDefaultResponse(context.age);
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generated response:', generatedText);

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-therapy-response function:', error);
    
    // Return appropriate fallback response based on context
    try {
      const { context, isWelcome } = await req.json();
      const fallbackResponse = isWelcome ? getWelcomeMessage(context?.age || 'adult') : getDefaultResponse(context?.age || 'adult');
      
      return new Response(JSON.stringify({ response: fallbackResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Final fallback if we can't parse the request
      return new Response(JSON.stringify({ response: "I'm here to listen and support you. How are you feeling today?" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
});