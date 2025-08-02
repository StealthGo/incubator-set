import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversation, systemPrompt } = await request.json();

    // For now, let's create a simple mock response that simulates an LLM
    // In a real implementation, you would integrate with OpenAI, Anthropic, or another LLM provider
    
    const responses = {
      greeting: [
        "Hey there! I'm so excited to help you plan your perfect trip! 🌟 Where are you dreaming of going?",
        "Hello! Ready for an amazing adventure? ✈️ What destination has caught your eye?",
        "Hi! I'm here to create the most incredible itinerary for you! Where would you like to explore?"
      ],
      followup: [
        "That sounds amazing! How many days are you planning to stay?",
        "Fantastic choice! What time of year are you thinking of visiting?",
        "Love it! Are you traveling solo, with family, or friends?",
        "Perfect! What's your budget range for this trip?",
        "Great! What type of activities interest you most - adventure, culture, relaxation, or food?",
        "Wonderful! Do you prefer luxury accommodations or are you more of a budget traveler?",
        "That's exciting! Any specific must-see places or experiences on your wishlist?"
      ],
      completion: [
        "Perfect! I have all the information I need to create your dream itinerary! 🎉",
        "Excellent! With all these details, I can craft the perfect trip for you! ✨",
        "Amazing! I'm ready to put together an incredible adventure just for you! 🚀"
      ]
    };

    // Simple logic to determine response type
    let response: string;
    
    if (conversation.length === 0) {
      // First message - greeting
      response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (conversation.length >= 6) {
      // After several exchanges, offer to complete
      response = responses.completion[Math.floor(Math.random() * responses.completion.length)];
    } else {
      // Follow-up questions
      response = responses.followup[Math.floor(Math.random() * responses.followup.length)];
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return NextResponse.json({
      response,
      shouldComplete: conversation.length >= 6
    });

  } catch (error) {
    console.error('Error in chat conversation:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}
