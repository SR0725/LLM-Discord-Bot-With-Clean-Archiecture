import type { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import ChatGPT3Adapter from "./chat-gpt-3-adapter";
import ChatGPT4Adapter from "./chat-gpt-4-adapter";
import ChatGeminiProAdapter from "./chat-gemini-pro-adapter";
import { LLMModel } from "@/application/port/in/llm-model";

const ChatAdapter: ChatLLMPort = async (
  useModel: string,
  prompt,
  chatHistories
) => {
  if (useModel === LLMModel.GPT3) {
    return ChatGPT3Adapter(prompt, chatHistories);
  } else if (useModel === LLMModel.GPT4) {
    return ChatGPT4Adapter(prompt, chatHistories);
  } else if (useModel === LLMModel.GEMINI_PRO) {
    return ChatGeminiProAdapter(prompt, chatHistories);
  }
  
  throw new Error("Model not supported");
};

export default ChatAdapter;
