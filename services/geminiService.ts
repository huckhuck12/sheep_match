import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateGameCommentary = async (status: 'WON' | 'LOST', moveCount: number) => {
  const ai = getAiClient();
  if (!ai) {
    return status === 'WON' 
      ? "太神了！你竟然通关了！" 
      : "别灰心，99%的人都过不去这一关。";
  }

  const prompt = status === 'WON'
    ? `玩家刚刚通关了一个极难的消除游戏（类似于羊了个羊），用了 ${moveCount} 步。请写一段简短、极其热情、庆祝性的中文评价（最多两句话）。夸赞他们的天才。`
    : `玩家刚刚在“羊了个羊”风格的游戏中失败了，用了 ${moveCount} 步。这个游戏以让人崩溃和极高难度著称。请写一段简短、幽默、略带嘲讽但最终令人感到安慰的中文评价（最多两句话）。提一下这个游戏有多难。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return status === 'WON' ? "你赢了！（AI惊呆了）" : "游戏结束！（AI去睡了）";
  }
};