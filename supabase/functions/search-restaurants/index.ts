import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, location } = await req.json();
    
    console.log('Searching restaurants for:', query, 'in location:', location);

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `You are a restaurant recommendation assistant. When given a user's food craving or mood, suggest 5-8 real restaurants that would satisfy their request.

For each restaurant, provide realistic data in this exact JSON format:
{
  "restaurants": [
    {
      "id": "unique-id",
      "name": "Restaurant Name",
      "cuisine": ["Cuisine Type 1", "Cuisine Type 2"],
      "priceRange": 1-3 (1=budget, 2=moderate, 3=expensive),
      "rating": 4.0-5.0,
      "reviews": 100-1000,
      "location": "Specific Address or Area",
      "address": "Full street address with city",
      "distance": "X.X km",
      "openTime": "HH:MM AM/PM",
      "closeTime": "HH:MM AM/PM",
      "specialties": ["Dish 1", "Dish 2", "Dish 3"],
      "description": "Brief enticing description",
      "tags": ["relevant", "tags"],
      "image": "unsplash-food-image-url",
      "isVeg": true/false,
      "phone": "+1-XXX-XXX-XXXX"
    }
  ]
}

Use realistic restaurant names and addresses for the location provided. Include varied price ranges and ratings. Use high-quality Unsplash food images (use format: https://images.unsplash.com/photo-XXXXX?w=400).`;

    const userPrompt = `User is looking for: "${query}"
Location: ${location || 'New Delhi, India'}

Suggest restaurants that match this craving. Return ONLY valid JSON, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);

    // Parse the JSON from the response
    let restaurants;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        restaurants = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Failed to parse restaurant data');
    }

    return new Response(JSON.stringify(restaurants), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in search-restaurants function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
