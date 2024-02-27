import OpenAI from "openai";
import dotenv from "dotenv";

// functions
import {
  getCurrentWeather,
  getUserStatus,
  getCurrentTimeByCountry,
} from "./functions.js";

dotenv.config();
const { log } = console;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages = [
  {
    role: "system",
    content:
      "you are a helpful assistant. Use the provided functions to answer questions.",
  },
  {
    role: "user",
    content:
      "what's time and weather in Tokyo, also please show me 2 name list active status?",
  },
];

async function runConversation() {
  // Step 1: send the conversation and available functions to the model

  const tools = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_user_status",
        description: "Get the current user status, e.g. Alice, John, etc.",
        parameters: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description:
                "The status of the users, e.g. active, inactive, etc.",
            },
            age: {
              type: "string",
              description: "The age of the users, e.g. 20, 22, etc",
            },
          },
          required: ["status", "age"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_countries_time",
        description: "Get current time in a given country",
        parameters: {
          type: "object",
          properties: {
            country: {
              type: "string",
              description: "The country, e.g. France, Japan, etc.",
            },
          },
          required: ["country"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages,
    tools,
    top_p: 1,
    temperature: 0.8,
    tool_choice: "auto",
  });
  const responseMessage = response.choices[0].message;

  // Step 2: check if the model wanted to call a function
  const toolCalls = responseMessage.tool_calls;
  // log(toolCalls);
  if (responseMessage.tool_calls) {
    // Step 3: call the function
    // Note: the JSON response may not always be valid; be sure to handle errors
    const availableFunctions = {
      get_current_weather: getCurrentWeather,
      get_user_status: getUserStatus,
      get_countries_time: getCurrentTimeByCountry,
    }; // only one function in this example, but you can have multiple
    messages.push(responseMessage); // extend conversation with assistant's reply
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(
        functionArgs.status ||
          functionArgs.location ||
          functionArgs.unit ||
          functionArgs.country
      );

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse,
      });
      // extend conversation with function response
    }
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    }); // get a new response from the model where it can see the function response
    return secondResponse.choices[0].message.content;
  } else {
    return responseMessage.content;
  }
}

runConversation().then(log).catch(console.error);
