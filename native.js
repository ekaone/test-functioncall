import OpenAI from "openai";
import dotenv from "dotenv";

// functions
import { getCurrentWeather, getUserStatus } from "./functions.js";

dotenv.config();
const { log } = console;

/**
 *  Start of the main code
 */

const functionCall = {
  get_user_status: getUserStatus,
  get_current_weather: getCurrentWeather,
};

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
    content: "show me current status of inactive users",
  },
];

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
            description: "The status of the users, e.g. active, inactive, etc.",
          },
        },
        required: ["status"],
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
const responseMessage = response.choices[0];
const finish_reason = responseMessage.finish_reason;
// const toolInfo = responseMessage?.message?.tool_calls[0];

async function generate() {
  if (finish_reason === "tool_calls") {
    if (!responseMessage?.message?.tool_calls) {
      return {
        response:
          "there was an error processing your request, please try again later.",
        links: [],
      };
    }
    const toolInfo = responseMessage?.message?.tool_calls[0];
    try {
      const args = JSON.parse(toolInfo.function.arguments);
      const status = args.status;
      const name = toolInfo?.function?.name;
      return await functionCall[name](status);
    } catch (error) {
      log(error);
    }
  } else {
    const response = responseMessage.message.content;
    return {
      response: response,
      links: [],
    };
  }
}

generate().then((res) => {
  log(res);
});
