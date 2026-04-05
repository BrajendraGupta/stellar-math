const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const askAI = async (prompt, modelType = "logic") => {
  const modelMap = {
    "logic": "deepseek/deepseek-r1:free",
    "speed": "meta-llama/llama-3.1-8b-instruct:free",
    "creative": "google/gemini-2.0-flash-exp:free"
  };

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelMap[modelType],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "Houston, we have a problem. I couldn't reach the co-pilot.";
  }
};

