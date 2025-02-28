import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import promptSync from "prompt-sync"

const prompt = promptSync();
let OPENAI_API_KEY = prompt("Please enter your API Key: "); // Asks user for API key

const openai = new OpenAI({
    apiKey: process.env[OPENAI_API_KEY], // API Key Initialization
  });

// Parse GPT Outputs
const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const Planet = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

let user_input_planet = prompt("Describe where you want to travel next: "); // Asks user for what planet they want to travel to in the next stage of the game

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are a planet generator. Describe to the user the environment they inputted." },
    { role: "user", content: user_input_planet },
  ],
  response_format: zodResponseFormat(Planet, "planet"),
});

const planet = completion.choices[0].message.parsed;
console.log(planet);
