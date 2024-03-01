import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Role } from "@/application/port/out/chat";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const chatRoleToCompletionMap = {
  [Role.Bot]: "model",
  [Role.User]: "user",
};

const chatPricePerInputToken = 0;
const chatPricePerOutputToken = 0;

const ChatGeminiProAdapter: LLMApiUsePort = async (prompt, chatHistories) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      temperature: 0,
    },
  });
  const lastChat = chatHistories[chatHistories.length - 1];
  const chatHistoriesWithoutLast = chatHistories.slice(0, -1);

  const chat = model.startChat({
    history: [
      ...(prompt ? [{ role: "system", parts: prompt }] : []),
      ...(chatHistoriesWithoutLast.map((chat) => ({
        role: chatRoleToCompletionMap[chat.role],
        parts: chat.content,
      })) as Array<any>),
    ],
  });

  const result = await chat.sendMessage(lastChat.content);
  const response = await result.response;
  const content = response.text();
  console.log(JSON.stringify(response), content);
  const { totalTokens: promptTokens } = await model.countTokens(
    lastChat.content
  );
  const { totalTokens: completionTokens } = await model.countTokens(content);

  return {
    role: Role.Bot,
    content: content || "Gemini Pro chat failed",
    cost:
      promptTokens * chatPricePerInputToken +
      completionTokens * chatPricePerOutputToken,
  };
};

export default ChatGeminiProAdapter;
