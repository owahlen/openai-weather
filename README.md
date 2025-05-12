# 🌦️ OpenAI Function Calling with Weather API

This project demonstrates how to connect OpenAI's 
[function calling](https://platform.openai.com/docs/guides/function-calling)
feature to a custom API.

## Project components

1. Proxy server providing US weather forecast from _National Weather Service_ via `/weather` endpoint for given latitude and longitude parameters
2. Client that integrates the server with OpenAI using _function-calling_

---

## How it works

### Request flow
``` mermaid
sequenceDiagram
    participant U as User
    participant C as Local Client App
    participant OAI as OpenAI ChatGPT
    participant S as Local Weather Proxy Server
    participant NWS as National Weather Service API

    U->>C: "What's the weather like in New York City?"
    C->>OAI: ChatCompletion request (tools = get_weather)
    OAI-->>C: function_call get_weather(lat, lon)
    C->>S: GET /weather?latitude=40.71&longitude=-74.00
    S->>NWS: Get grid point(lat, long)
    NWS-->>S: grid point
    S->>NWS: Get forecast(grid point)
    NWS-->>S: forecast for periods
    S-->>C: JSON forecast
    C->>OAI: Tool result with forecast JSON
    OAI-->>C: Final assistant message (natural language)
    C-->>U: Display forecast
```

In order to integrate a custom service a client app is necessary.
The client orchestrates the communication between ChatGPT and the service.

In the example, the user prompts the weather of New York City.
The client simply forwards this request to ChatGPT.
It however includes a _function calling_ section as shown below into the API request.
Hereby it tells ChatGPT that the client has the capability to retrieve
the weather forecast for a location as long as latitude and longitude are provided.

ChatGPT responds with a _tool_calls_ message that contains the latitude and longitude of New York
and the client uses the local weather proxy server to retrieve the weather information.

The JSON forecast response is shown below.
The client passes it to ChatGPT which formulates a natural language response from the JSON.
The client forwards this response to the user.

### Function calling
The following information is passed from the client to ChatGPT in the initial request.

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

### Weather API proxy endpoint

`GET /weather?latitude=40.7128&longitude=-74.0060`

Returns a JSON forecast for a given location:

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "forecast": [
    {
      "period": "Overnight",
      "temperature": "55°F",
      "wind": "7 mph E",
      "forecast": "Mostly Clear"
    },
    {
      "period": "Monday",
      "temperature": "74°F",
      "wind": "6 to 12 mph SE",
      "forecast": "Sunny"
    },
    {
      "period": "Monday Night",
      "temperature": "59°F",
      "wind": "2 to 10 mph S",
      "forecast": "Mostly Cloudy then Slight Chance Rain Showers"
    },
    {
      "period": "Tuesday",
      "temperature": "65°F",
      "wind": "2 to 8 mph SE",
      "forecast": "Chance Rain Showers"
    },
    {
      "period": "Tuesday Night",
      "temperature": "61°F",
      "wind": "9 mph SE",
      "forecast": "Rain Showers Likely"
    },
    {
      "period": "Wednesday",
      "temperature": "64°F",
      "wind": "12 mph E",
      "forecast": "Rain Showers Likely"
    },
    {
      "period": "Wednesday Night",
      "temperature": "62°F",
      "wind": "5 to 10 mph E",
      "forecast": "Rain Showers Likely"
    },
    {
      "period": "Thursday",
      "temperature": "67°F",
      "wind": "6 mph E",
      "forecast": "Chance Rain Showers"
    },
    {
      "period": "Thursday Night",
      "temperature": "64°F",
      "wind": "2 to 6 mph S",
      "forecast": "Chance Showers And Thunderstorms then Slight Chance Showers And Thunderstorms"
    },
    {
      "period": "Friday",
      "temperature": "73°F",
      "wind": "2 to 6 mph S",
      "forecast": "Mostly Cloudy then Chance Showers And Thunderstorms"
    },
    {
      "period": "Friday Night",
      "temperature": "66°F",
      "wind": "2 to 6 mph SW",
      "forecast": "Chance Showers And Thunderstorms"
    },
    {
      "period": "Saturday",
      "temperature": "77°F",
      "wind": "2 to 12 mph SW",
      "forecast": "Chance Rain Showers"
    },
    {
      "period": "Saturday Night",
      "temperature": "64°F",
      "wind": "8 mph SW",
      "forecast": "Chance Rain Showers"
    },
    {
      "period": "Sunday",
      "temperature": "72°F",
      "wind": "9 mph W",
      "forecast": "Slight Chance Rain Showers"
    }
  ]

}
```

### Natural language response from ChatGPT
> The weather in New York City is mostly clear overnight with a temperature of around 55°F and winds from the east at 7 mph.
> On Monday, expect sunny skies with a high of 74°F and southeast winds at 6 to 12 mph. 
> Monday night will be mostly cloudy with a slight chance of rain showers, and temperatures around 59°F.
> The following days include chances of rain showers and thunderstorms with temperatures ranging from the mid-60s to mid-70s throughout the week.

## How to run
### 1. Configure environment variables

Create a `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key
```
Note, that the client uses the model `gpt-4.1-mini` which must be usable with this key.

### 2. Run the weather proxy server

```bash
npm run start:server
```

### 3. Run the client app

```bash
npm run start:client
```

---

## Acknowledgments

- [OpenAI API](https://platform.openai.com/docs)
- [National Weather Service](https://www.weather.gov/)
