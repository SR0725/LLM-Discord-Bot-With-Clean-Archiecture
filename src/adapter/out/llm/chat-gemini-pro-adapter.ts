import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Role } from "@/application/port/out/chat";
import fileToGenerativeBufferPart from "@/common/file-to-generative-buffer-part";
// need refactor
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const chatRoleToCompletionMap = {
  [Role.Bot]: "model",
  [Role.User]: "user",
};

const chatPricePerInputToken = 0;
const chatPricePerOutputToken = 0;

const ChatGeminiProAdapter: LLMApiUsePort = async (prompt, chatHistories) => {
  const lastChat = chatHistories[chatHistories.length - 1];
  const chatHistoriesWithoutLast = chatHistories.slice(0, -1);
  const usedModel = lastChat.imagePaths && lastChat.imagePaths.length > 1
        ? "gemini-pro-vision"
        : "gemini-pro"
  const model = genAI.getGenerativeModel({
    model: usedModel,
    generationConfig: {
      temperature: 0,
    },
  });

  const imageParts = lastChat.imagePaths?.map(({ path, mimeType }) =>
    fileToGenerativeBufferPart(path, mimeType)
  );

  const chat = model.startChat({
    history: [
      ...(prompt ? [{ role: "user", parts: prompt }] : []),
      ...(chatHistoriesWithoutLast.map((chat) => ({
        role: chatRoleToCompletionMap[chat.role],
        parts: chat.content,
      })) as Array<any>),
    ],
  });

  const result = imageParts
    ? await model.generateContent([lastChat.content, ...imageParts])
    : await chat.sendMessage(lastChat.content);
  const response = await result.response;
  const content = response.text();

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
