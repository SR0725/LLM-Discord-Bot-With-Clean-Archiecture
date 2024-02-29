import type { ChatLLMPort } from "@/application/port/out/chat-llm-port";
import ChatGPT3Adapter from "./chat-gpt-3-adapter";
import { LLMModel } from "@/application/port/in/llm-model";

const ChatAdapter: ChatLLMPort = async (
  useModel: string,
  prompt,
  chatHistories
) => {
  if (useModel === LLMModel.GPT3) {
    return ChatGPT3Adapter(prompt, chatHistories);
  }
  throw new Error("Model not supported");
};

export default ChatAdapter;
