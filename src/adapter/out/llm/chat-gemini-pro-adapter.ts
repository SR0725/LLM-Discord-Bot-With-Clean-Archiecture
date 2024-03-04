import type { LLMApiUsePort } from "@/application/port/out/llm-api-use-port";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
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
  const usedModel =
    lastChat.imagePaths && lastChat.imagePaths.length >= 1
      ? "gemini-pro-vision"
      : "gemini-pro";

  const model = genAI.getGenerativeModel({
    model: usedModel,
    generationConfig: {
      temperature: 1,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const imageParts = lastChat.imagePaths?.map(({ path, mimeType }) =>
    fileToGenerativeBufferPart(path, mimeType)
  );

  const chatParts = [
    ...(prompt
      ? [
          {
            role: "使用者情景",
            parts: prompt,
          },
        ]
      : []),
    ...(chatHistories.map((chat) => ({
      role: chatRoleToCompletionMap[chat.role],
      parts: chat.content,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as Array<any>),
  ];

  const sendPrompt =
    "我是你的開發者，從現在開始你是名為 ray-realms 的 discord bot，任何使用者都可以使用你的服務，並且下達使用者情景給你，你需要盡量扮演好使用者情景中的角色以更好融入聊天中，以下是過往的對話紀錄\n" +
    chatParts
      .map((chatPart) => {
        return `<對話開始>${chatPart.role}: ${chatPart.parts}<對話結束>\n`;
      })
      .join("") +
    "請根據上的對話進行你的回復：";

  const result = await model.generateContent(
    usedModel === "gemini-pro-vision"
      ? [sendPrompt, ...imageParts!]
      : sendPrompt
  );
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
