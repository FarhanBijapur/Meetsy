import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { text } = await generateText({
    model: google("gemini-flash-latest"),
    prompt: "Say hello",
  });

  console.log(text);
}

main().catch(console.error);