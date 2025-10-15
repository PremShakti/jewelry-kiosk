import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userPreferences } = body;

    // Validate the request body
    if (!userPreferences || !Array.isArray(userPreferences)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected userPreferences array." },
        { status: 400 }
      );
    }

    // Log the received preferences
    console.log(
      "Received user preferences:",
      JSON.stringify(userPreferences, null, 2)
    );

    // Prepare the prompt for OpenAI
    const userAnswers = userPreferences
      .map((pref) => `${pref.question}: ${pref.answer}`)
      .join("\n");
    const GEMINI_API_KEY = "AIzaSyCyrcmiKFNqk0ho9bi1FJ5TdDTOnAvJRp4";
    
    const prompt = `Based on the following jewelry preferences, analyze the user's style and return ONLY two things:
1. A single word describing their jewelry vibe (like: bold, elegant, minimal, traditional, glamorous, edgy, classic, modern, romantic, sophisticated)
2. A celebrity name whose jewelry style matches this vibe

User preferences:
${userAnswers}

Return your response in this exact JSON format:
{
  "vibe": "single_word_vibe",
  "celebrity": "Celebrity Name"
}`;
    
    // Call Gemini API
    console.log("Calling Gemini API with key:", GEMINI_API_KEY ? "Key exists" : "Key missing");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    console.log("Gemini Response Status:", geminiResponse.status);
    console.log(
      "Gemini Response Headers:",
      Object.fromEntries(geminiResponse.headers)
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error Response:", errorText);
      throw new Error(
        `Failed to get Gemini response: ${geminiResponse.status} - ${errorText}`
      );
    }

    const geminiData = await geminiResponse.json();
    console.log("Gemini Response Data:", JSON.stringify(geminiData, null, 2));

    // Check if the response has the expected structure
    if (
      !geminiData.candidates ||
      !geminiData.candidates[0] ||
      !geminiData.candidates[0].content
    ) {
      console.error("Unexpected Gemini response structure:", geminiData);
      throw new Error("Invalid response structure from Gemini API");
    }

    const aiResponse = geminiData.candidates[0].content.parts[0].text;
    console.log("AI Response Text:", aiResponse);

    // Parse the AI response
    let parsedResponse;
    try {
      // Clean the response text in case it has markdown formatting
      const cleanResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      console.log("Cleaned AI Response:", cleanResponse);

      parsedResponse = JSON.parse(cleanResponse);
      console.log("Parsed Response:", parsedResponse);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw AI response:", aiResponse);
      // Fallback response
      parsedResponse = {
        vibe: "elegant",
        celebrity: "Zendaya",
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        vibe: parsedResponse.vibe,
        matchedCelebrity: parsedResponse.celebrity,
        styleProfile: userPreferences,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
