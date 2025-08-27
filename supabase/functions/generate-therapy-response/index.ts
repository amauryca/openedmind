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

const createTherapyPrompt = (context: TherapyContext, userMessage?: string, isWelcome = false): string => {
  const agePrompts = {
    child: "You are a gentle, caring therapist for children ages 5-12. Use simple, warm language. Keep responses very short - under 30 words.",
    teen: "You are an empathetic therapist for teenagers ages 13-17. Be understanding and non-judgmental. Keep responses under 40 words.",
    'young-adult': "You are a supportive therapist for young adults ages 18-25. Be relatable and understanding. Keep responses under 40 words.",
    adult: "You are a professional therapist for adults ages 26-45. Be warm but professional. Keep responses under 45 words.",
    senior: "You are a respectful therapist for adults 45+. Show respect for their experience. Keep responses under 45 words."
  };

  const basePrompt = agePrompts[context.age as keyof typeof agePrompts] || agePrompts.adult;

  if (isWelcome) {
    return `${basePrompt}\n\nGenerate a brief, warm welcome message to start a therapy session. Ask one simple question to begin the conversation. Be encouraging and make them feel safe.`;
  }

  let prompt = `${basePrompt}\n\n`;
  
  if (context.previousMessages && context.previousMessages.length > 0) {
    prompt += `Previous conversation: ${context.previousMessages.slice(-2).join(' ')}\n\n`;
  }
  
  if (context.mood || context.emotion) {
    prompt += `User seems ${context.mood || context.emotion}. `;
  }
  
  prompt += `User just said: "${userMessage}"\n\nRespond with empathy and ask a follow-up question to encourage them to share more. Be brief and supportive.`;
  
  return prompt;
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

    console.log('=== NEW REQUEST ===');
    console.log('User message:', userMessage);
    console.log('Context:', context);
    console.log('Is welcome:', isWelcome);

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment');
      throw new Error('API key not configured');
    }

    console.log('✅ API Key found, length:', apiKey.length);

    const prompt = createTherapyPrompt(context, userMessage, isWelcome);
    console.log('📝 Generated prompt:', prompt);

    const requestPayload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
        topP: 0.8,
        topK: 20
      }
    };

    console.log('🚀 Making API request to Gemini...');
    console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      }
    );

    console.log('📊 API Response Status:', geminiResponse.status);
    console.log('📊 API Response Headers:', Object.fromEntries(geminiResponse.headers.entries()));

    const responseText = await geminiResponse.text();
    console.log('📄 Raw API Response:', responseText);

    if (!geminiResponse.ok) {
      console.error('❌ Gemini API Error - Status:', geminiResponse.status);
      console.error('❌ Gemini API Error - Response:', responseText);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${responseText}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('✅ Parsed response data:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      throw new Error(`Invalid response format: ${parseError.message}`);
    }

    const generatedText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('❌ No text found in response structure');
      console.error('Response structure:', JSON.stringify(responseData, null, 2));
      throw new Error('No response text generated');
    }

    console.log('✅ SUCCESS - Generated text:', generatedText);

    return new Response(JSON.stringify({ response: generatedText.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ FATAL ERROR in function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});