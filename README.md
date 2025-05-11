# 🌦️ OpenAI Weather API with Express and Tool Calling

This project demonstrates how to connect OpenAI's function calling (tool calling)
feature to a local Express-based weather API using TypeScript.

## 🧰 Features

- 🌐 Express server providing weather forecast via `/weather`
- 🔍 Uses latitude and longitude query parameters
- 🔁 Consumes real weather data (e.g. from National Weather Service)
- 🤖 Client with OpenAI tool-calling using `gpt-4.1-mini`

---

## 🚀 Getting Started

### 1. Configure environment variables

Create a `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key
```

### 2. Run the dev server

```bash
npm run start:server    # Runs src/server.ts via tsx
npm run start:client    # Runs src/client.ts via tsx
```

---

## 🔧 API Overview

### `GET /weather?latitude=...&longitude=...`

Returns a JSON forecast for a given location:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "forecast": [
    {
      "period": "Tonight",
      "temperature": "12°C",
      "wind": "10 km/h NW",
      "forecast": "Partly cloudy"
    },
    ...
  ]
}
```

---

## 🧠 Tool Calling Example

```ts
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
```

---

## 👋 Acknowledgments

- [OpenAI API](https://platform.openai.com/docs)
- [National Weather Service](https://www.weather.gov/)
