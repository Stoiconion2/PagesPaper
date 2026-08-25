import { ParsedSections } from "../types";

export function parseDraftManuscript(text: string): ParsedSections {
  const defaultSections: ParsedSections = {
    productName: "",
    headline: "",
    customerSituation: "",
    features: [],
    usageScene: "",
    closingStatement: "",
    shippingInfo: `[배송안내]
- 주문 및 제작 상황에 따라 출고 일정이 달라질 수 있습니다.
- 정확한 배송 일정은 상품별 안내 내용을 확인해 주세요.
- 도서산간 지역은 추가 배송비가 발생할 수 있습니다.`,
    productNotice: `[제품 유의사항]
- 제품의 색상은 촬영 환경과 화면 설정에 따라 실제와 차이가 있을 수 있습니다.
- 핸드메이드 또는 소재 특성상 제품마다 형태, 무늬, 마감에 미세한 차이가 있을 수 있습니다.
- 상품의 세부 사양은 구매 전 상세 내용을 확인해 주세요.`,
    caution: `[주의사항]
- 제품의 용도 외 사용은 피해주세요.
- 어린이가 사용하는 제품은 보호자의 확인 아래 사용해주세요.
- 강한 충격, 화기, 과도한 습기 등 제품 손상의 원인이 되는 환경은 피해주세요.`,
    additionalInfoNeeded: [],
  };

  if (!text || !text.trim()) {
    return defaultSections;
  }

  // Regex patterns to identify sections 1 to 9 + additional info
  const lines = text.split("\n");
  let currentSection = 0; // 1 to 9, 10 for additional info
  let currentFeatureTitle = "";
  let currentFeatureDesc = "";

  const sectionHeaders = [
    { num: 1, regex: /^1\.\s*상품명/i },
    { num: 2, regex: /^2\.\s*상단\s*핵심\s*문구/i },
    { num: 3, regex: /^3\.\s*고객\s*상황/i },
    { num: 4, regex: /^4\.\s*제품\s*특장점/i },
    { num: 5, regex: /^5\.\s*사용\s*장면/i },
    { num: 6, regex: /^6\.\s*구매\s*마무리\s*문구/i },
    { num: 7, regex: /^7\.\s*배송안내|^\[배송안내\]/i },
    { num: 8, regex: /^8\.\s*제품\s*유의사항|^\[제품 유의사항\]/i },
    { num: 9, regex: /^9\.\s*주의사항|^\[주의사항\]/i },
    { num: 10, regex: /^\[추가\s*확인이\s*필요한\s*정보\]/i },
  ];

  const sectionTexts: { [key: number]: string[] } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    let matchedSection = 0;
    for (const sh of sectionHeaders) {
      if (sh.regex.test(trimmed)) {
        matchedSection = sh.num;
        break;
      }
    }

    if (matchedSection > 0) {
      currentSection = matchedSection;
      continue;
    }

    if (currentSection > 0) {
      sectionTexts[currentSection].push(rawLine);
    }
  }

  // Process Section 1
  defaultSections.productName = (sectionTexts[1] || []).join("\n").trim();

  // Process Section 2
  defaultSections.headline = (sectionTexts[2] || []).join("\n").trim();

  // Process Section 3
  defaultSections.customerSituation = (sectionTexts[3] || []).join("\n").trim();

  // Process Section 4 (Features)
  const featLines = sectionTexts[4] || [];
  const parsedFeats: Array<{ title: string; desc: string }> = [];
  let tempTitle = "";
  let tempDescLines: string[] = [];

  for (const fLine of featLines) {
    const trimmed = fLine.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("1)") || trimmed.startsWith("2)") || trimmed.startsWith("3)")) {
      if (tempTitle) {
        parsedFeats.push({ title: tempTitle, desc: tempDescLines.join(" ").trim() });
        tempDescLines = [];
      }
      tempTitle = trimmed.replace(/^[-•\d\)]\s*/, "").replace(/^\[|\]$/g, "");
    } else {
      if (tempTitle) {
        tempDescLines.push(trimmed);
      } else {
        tempTitle = trimmed;
      }
    }
  }

  if (tempTitle) {
    parsedFeats.push({ title: tempTitle, desc: tempDescLines.join(" ").trim() });
  }

  defaultSections.features = parsedFeats;

  // Process Section 5
  defaultSections.usageScene = (sectionTexts[5] || []).join("\n").trim();

  // Process Section 6
  defaultSections.closingStatement = (sectionTexts[6] || []).join("\n").trim();

  // Process Section 7
  const s7 = (sectionTexts[7] || []).join("\n").trim();
  if (s7) defaultSections.shippingInfo = s7;

  // Process Section 8
  const s8 = (sectionTexts[8] || []).join("\n").trim();
  if (s8) defaultSections.productNotice = s8;

  // Process Section 9
  const s9 = (sectionTexts[9] || []).join("\n").trim();
  if (s9) defaultSections.caution = s9;

  // Process Section 10 (Additional info)
  const s10Lines = (sectionTexts[10] || [])
    .map((l) => l.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean);
  defaultSections.additionalInfoNeeded = s10Lines;

  return defaultSections;
}

export function generateSmartStoreHTML(parsed: ParsedSections, imageUrls: string[] = []): string {
  let html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #222; line-height: 1.7; max-width: 860px; margin: 0 auto; padding: 24px 16px;">\n`;

  // Headline & Product Name
  html += `  <!-- 상단 핵심 문구 -->\n`;
  html += `  <div style="text-align: center; margin-bottom: 40px; padding: 32px 20px; background-color: #f8f6f2; border-radius: 12px;">\n`;
  html += `    <p style="font-size: 14px; color: #887b6e; letter-spacing: 1px; margin-bottom: 8px; font-weight: 600;">HAWAYU BRAND STORY</p>\n`;
  html += `    <h1 style="font-size: 24px; font-weight: 700; color: #2d2926; margin: 0 0 16px 0; line-height: 1.4;">${escapeHtml(parsed.productName || "하와유 신제품")}</h1>\n`;
  html += `    <p style="font-size: 18px; color: #4a453f; line-height: 1.6; margin: 0; font-weight: 500;">${escapeHtml(parsed.headline)}</p>\n`;
  html += `  </div>\n\n`;

  // First image if available
  if (imageUrls.length > 0) {
    html += `  <div style="text-align: center; margin-bottom: 40px;">\n`;
    html += `    <img src="${imageUrls[0]}" alt="${escapeHtml(parsed.productName)}" style="max-width: 100%; border-radius: 8px;" />\n`;
    html += `  </div>\n\n`;
  }

  // Customer Situation
  if (parsed.customerSituation) {
    html += `  <!-- 고객 상황 -->\n`;
    html += `  <div style="margin-bottom: 48px; padding: 24px; border-left: 3px solid #887b6e; background-color: #faf9f6;">\n`;
    html += `    <h3 style="font-size: 16px; font-weight: 700; color: #333; margin: 0 0 12px 0;">이런 순간에 함께해보세요</h3>\n`;
    html += `    <p style="font-size: 15px; color: #555; margin: 0; white-space: pre-line;">${escapeHtml(parsed.customerSituation)}</p>\n`;
    html += `  </div>\n\n`;
  }

  // Features
  if (parsed.features && parsed.features.length > 0) {
    html += `  <!-- 제품 특장점 -->\n`;
    html += `  <div style="margin-bottom: 48px;">\n`;
    html += `    <h2 style="font-size: 20px; font-weight: 700; color: #2d2926; border-bottom: 2px solid #2d2926; padding-bottom: 12px; margin-bottom: 24px;">POINT & DETAIL</h2>\n`;
    parsed.features.forEach((feat, idx) => {
      html += `    <div style="margin-bottom: 24px; padding: 18px 20px; background-color: #ffffff; border: 1px solid #e8e4dc; border-radius: 8px;">\n`;
      html += `      <h4 style="font-size: 16px; font-weight: 700; color: #735d48; margin: 0 0 8px 0;">POINT ${idx + 1}. ${escapeHtml(feat.title)}</h4>\n`;
      html += `      <p style="font-size: 15px; color: #444; margin: 0; line-height: 1.6;">${escapeHtml(feat.desc)}</p>\n`;
      html += `    </div>\n`;
    });
    html += `  </div>\n\n`;
  }

  // Usage Scene
  if (parsed.usageScene) {
    html += `  <!-- 사용 장면 -->\n`;
    html += `  <div style="margin-bottom: 48px; background-color: #f6f4f0; padding: 28px; border-radius: 10px;">\n`;
    html += `    <h3 style="font-size: 18px; font-weight: 700; color: #2d2926; margin: 0 0 14px 0;">공간과 일상에서의 쓰임</h3>\n`;
    html += `    <p style="font-size: 15px; color: #4a453f; line-height: 1.7; margin: 0; white-space: pre-line;">${escapeHtml(parsed.usageScene)}</p>\n`;
    html += `  </div>\n\n`;
  }

  // Closing statement
  if (parsed.closingStatement) {
    html += `  <!-- 구매 마무리 문구 -->\n`;
    html += `  <div style="text-align: center; margin: 48px 0; padding: 24px;">\n`;
    html += `    <p style="font-size: 17px; font-weight: 600; color: #2d2926; line-height: 1.6; margin: 0;">${escapeHtml(parsed.closingStatement)}</p>\n`;
    html += `  </div>\n\n`;
  }

  // Notices / Shipping / Cautions
  html += `  <!-- 기본 안내사항 -->\n`;
  html += `  <div style="margin-top: 56px; padding: 24px; background-color: #f9f9f9; border-radius: 8px; font-size: 13px; color: #666; line-height: 1.8;">\n`;
  html += `    <h4 style="font-size: 14px; font-weight: 700; color: #333; margin: 0 0 8px 0;">[배송안내]</h4>\n`;
  html += `    <p style="margin: 0 0 16px 0; white-space: pre-line;">${escapeHtml(parsed.shippingInfo.replace(/^\[배송안내\]\n?/, ""))}</p>\n`;
  html += `    <h4 style="font-size: 14px; font-weight: 700; color: #333; margin: 0 0 8px 0;">[제품 유의사항]</h4>\n`;
  html += `    <p style="margin: 0 0 16px 0; white-space: pre-line;">${escapeHtml(parsed.productNotice.replace(/^\[제품 유의사항\]\n?/, ""))}</p>\n`;
  html += `    <h4 style="font-size: 14px; font-weight: 700; color: #333; margin: 0 0 8px 0;">[주의사항]</h4>\n`;
  html += `    <p style="margin: 0; white-space: pre-line;">${escapeHtml(parsed.caution.replace(/^\[주의사항\]\n?/, ""))}</p>\n`;
  html += `  </div>\n`;

  html += `</div>`;
  return html;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
