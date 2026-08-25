import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HAWAYU_SYSTEM_INSTRUCTION = `당신은 네이버 스마트스토어 ‘하와유’의 신제품 상세페이지 초안을 만드는 전문 도우미입니다.

[목적]
대표가 신제품을 등록할 때 상품명, 제품 특장점, 상품 사진을 바탕으로 네이버 스마트스토어에 바로 활용할 수 있는 상세페이지 원고를 작성합니다.

[사용자]
이 도구는 하와유 대표 1명만 사용합니다.

[작성 원칙]
- 고객이 제품을 왜 선택해야 하는지 이해할 수 있도록 구체적으로 설명합니다.
- 기능과 장점은 쉬운 소비자 언어로 바꿔 씁니다.
- 과장된 표현이나 확인되지 않은 최상급 표현을 사용하지 않습니다.
- “무조건”, “최고”, “완벽”, “필수템”처럼 근거 없는 표현을 절대 피합니다.
- 하와유의 제품이 가족의 공간과 일상에서 어떻게 쓰이는지 보여줍니다.
- 감성적인 문장만 나열하지 않고 실제 쓰임과 연결합니다.
- 저렴한 가격만을 중심으로 제품 가치를 설명하지 않습니다.
- 네이버 스마트스토어 상세페이지에 그대로 옮겨 사용할 수 있는 문장으로 작성합니다.
- 기술적인 설명, 제작 과정 설명, 앱 동작 설명은 출력하지 않습니다.
- 입력된 정보에 없는 사실은 임의로 만들지 않습니다.
- 사진에서 명확하게 확인되지 않는 소재, 크기, 성능, 인증, 원산지 등의 정보는 추측하지 않습니다.
- 이모지는 일체 사용하지 않습니다.
- 마크다운 표는 사용하지 않습니다.

[출력 순서 및 형식 (반드시 엄수)]
상세페이지 원고만 출력하며, 인사말이나 부연 설명 없이 항상 아래 1~9 순서로 작성합니다:

1. 상품명
[입력된 상품명 그대로 또는 정리된 상품명]

2. 상단 핵심 문구
[제품의 가장 중요한 구매 이유를 1~2문장으로 작성]

3. 고객 상황
[이 제품이 필요한 상황이나 사용 장면을 2~3문장으로 설명]

4. 제품 특장점
[입력된 특장점을 바탕으로 핵심 장점 3개 이내로 정리]
각 장점은 아래 형식으로 작성:
- [소제목]
[고객이 이해할 수 있는 설명 1~2문장]

5. 사용 장면
[제품이 실제 공간이나 일상에서 어떻게 사용되는지 설명. 사진에서 확인할 수 있는 색감, 형태, 배치 등이 있다면 적극 반영]

6. 구매 마무리 문구
[제품의 핵심 가치를 다시 정리하는 1~2문장]

7. 배송안내
[배송안내]
- 주문 및 제작 상황에 따라 출고 일정이 달라질 수 있습니다.
- 정확한 배송 일정은 상품별 안내 내용을 확인해 주세요.
- 도서산간 지역은 추가 배송비가 발생할 수 있습니다.

8. 제품 유의사항
[제품 유의사항]
- 제품의 색상은 촬영 환경과 화면 설정에 따라 실제와 차이가 있을 수 있습니다.
- 핸드메이드 또는 소재 특성상 제품마다 형태, 무늬, 마감에 미세한 차이가 있을 수 있습니다.
- 상품의 세부 사양은 구매 전 상세 내용을 확인해 주세요.

9. 주의사항
[주의사항]
- 제품의 용도 외 사용은 피해주세요.
- 어린이가 사용하는 제품은 보호자의 확인 아래 사용해주세요.
- 강한 충격, 화기, 과도한 습기 등 제품 손상의 원인이 되는 환경은 피해주세요.

[추가 확인이 필요한 정보]
상품의 핵심 설명을 작성하기에 정보(소재, 규격, 세부 스펙 등)가 부족하면 추측하지 말고 본문 맨 마지막에 아래 형식으로 항목을 추가합니다.
[추가 확인이 필요한 정보]
- 확인이 필요한 항목 1
- 확인이 필요한 항목 2

(단, 정보가 부족하더라도 현재 입력된 내용만으로 작성 가능한 상세페이지 초안은 먼저 완성해야 합니다.)`;

let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Generate Draft API
  app.post("/api/generate-draft", async (req, res) => {
    try {
      const { productName, features, images, additionalNotes } = req.body;

      if (!productName || !features) {
        return res.status(400).json({
          error: "상품명과 제품 특장점은 필수 입력 항목입니다.",
        });
      }

      const ai = getGenAI();

      const parts: Array<any> = [];

      // Add image parts if provided
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (img.data && img.mimeType) {
            // Strip data URL prefix if present
            const cleanBase64 = img.data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
            parts.push({
              inlineData: {
                data: cleanBase64,
                mimeType: img.mimeType,
              },
            });
          }
        }
      }

      let promptText = `네이버 스마트스토어 ‘하와유’ 신제품 상세페이지 초안을 작성해주세요.

[입력 정보]
- 상품명: ${productName}
- 제품 특장점: ${features}
${additionalNotes ? `- 추가 요청사항/참고내용: ${additionalNotes}\n` : ""}
${images && images.length > 0 ? `첨부된 상품 사진 ${images.length}장을 참고하여 제품의 시각적 형태, 분위기, 공간 활용 모습을 '5. 사용 장면'과 설명에 자연스럽게 반영해주세요. 사진으로 확실하지 않은 스펙은 추측하지 마세요.` : "사진은 첨부되지 않았으므로 입력된 정보만 바탕으로 작성해주세요."}

작성 원칙과 출력 순서(1. 상품명 ~ 9. 주의사항 및 부족한 정보 표시)를 철저히 지켜서 순수 원고 형태로 작성해주세요.`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: { parts },
        config: {
          systemInstruction: HAWAYU_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const draftText = response.text || "";

      res.json({
        success: true,
        draft: draftText,
      });
    } catch (error: any) {
      console.error("Error generating draft:", error);
      res.status(500).json({
        error: error.message || "상세페이지 초안 생성 중 오류가 발생했습니다.",
      });
    }
  });

  // Chat & Refine API
  app.post("/api/chat-refine", async (req, res) => {
    try {
      const { history, message, currentDraft, productName, features, images } = req.body;

      if (!message) {
        return res.status(400).json({ error: "수정 요청 메시지를 입력해주세요." });
      }

      const ai = getGenAI();

      // Construct conversational contents
      const contents: Array<any> = [];

      // Initial context
      let baseContext = `하와유 신제품 상세페이지 원고 수정/다듬기 요청입니다.
기본 원칙:
- 과장/최고/완벽 등 금지어 배제
- 가족의 일상과 공간 쓰임새에 집중
- 이모지 및 마크다운 표 미사용
- 번호가 매겨진 9개 표준 섹션 구조 유지

[현재 상품 정보]
- 상품명: ${productName || "기존 상품명 유지"}
- 특장점: ${features || "기존 특장점 유지"}
- 현재 작성된 상세페이지 원고:
\"\"\"
${currentDraft || "원고 없음"}
\"\"\"`;

      const initialParts: Array<any> = [];

      // Add image parts if provided
      if (Array.isArray(images) && images.length > 0) {
        for (const img of images) {
          if (img.data && img.mimeType) {
            const cleanBase64 = img.data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
            initialParts.push({
              inlineData: {
                data: cleanBase64,
                mimeType: img.mimeType,
              },
            });
          }
        }
      }

      initialParts.push({ text: baseContext });

      contents.push({
        role: "user",
        parts: initialParts,
      });

      contents.push({
        role: "model",
        parts: [{ text: "네, 대표님. 하와유 상세페이지 작성 원칙을 준수하여 준비되었습니다. 원고 수정 또는 질문 사항을 말씀해 주세요." }],
      });

      // Append past history if any
      if (Array.isArray(history) && history.length > 0) {
        for (const turn of history) {
          if (turn.role === "user" || turn.role === "model") {
            contents.push({
              role: turn.role,
              parts: [{ text: turn.text }],
            });
          }
        }
      }

      // Append current user message
      contents.push({
        role: "user",
        parts: [{
          text: `대표님의 수정/추가 요청:
${message}

위 요청을 반영하여, 수정된 전체 완성 상세페이지 원고(1. 상품명 ~ 9. 주의사항 포맷) 또는 요청에 대한 명확한 원고 답변을 작성해주세요. 하와유 작성 원칙과 포맷을 유지해주세요.`
        }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: HAWAYU_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "";

      res.json({
        success: true,
        reply: replyText,
      });
    } catch (error: any) {
      console.error("Error in chat refinement:", error);
      res.status(500).json({
        error: error.message || "원고 수정 중 오류가 발생했습니다.",
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hawayu SmartStore Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
