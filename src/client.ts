import {config} from "dotenv";
import OpenAI from "openai";
import fetch from "node-fetch";

config(); // Loads OPENAI_API_KEY from .env

const MODEL = "gpt-4.1-mini";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Define the tool interface
const tools: OpenAI.Chat.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "Get weather forecast for a location",
            parameters: {
                type: "object",
                properties: {
                    latitude: {
                        type: "number",
                        description: "Latitude of the location (e.g. 40.7128)",
                    },
                    longitude: {
                        type: "number",
                        description: "Longitude of the location (e.g. -74.0060)",
                    },
                },
                required: ["latitude", "longitude"],
            },
        },
    },
];

// Initial user prompt
const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: "user",
        content: "What's the weather like in New York City?",
    },
];

async function run(): Promise<void> {
    const response = await openai.chat.completions.create({
        model: MODEL,
        messages,
        tools,
        tool_choice: "auto",
    });

    const msg = response.choices[0].message;

    const toolCalls = msg.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
        console.log("🤖 Assistant:", msg.content);
        return;
    }

    const toolCall = toolCalls[0];
    const args = JSON.parse(toolCall.function.arguments);
    const {latitude, longitude} = args;

    const res = await fetch(`http://localhost:3000/weather?latitude=${latitude}&longitude=${longitude}`);
    const data: WeatherResponse = await res.json() as WeatherResponse;

    const followUp = await openai.chat.completions.create({
        model: MODEL,
        messages: [
            ...messages,
            msg,
            {
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(data),
            },
        ],
    });

    console.log("🤖 Assistant:", followUp.choices[0].message?.content);
}

run().catch((err) => {
    console.error("❌ Error:", err);
});
