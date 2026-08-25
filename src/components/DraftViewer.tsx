import React, { useState } from "react";
import { Copy, Check, FileText, Code2, AlertTriangle, CheckCircle2, Layers, Edit3, Sparkles } from "lucide-react";
import { ParsedSections } from "../types";
import { generateSmartStoreHTML } from "../utils/parser";

interface DraftViewerProps {
  draftText: string;
  onDraftChange: (newText: string) => void;
  parsed: ParsedSections;
  imageUrls: string[];
}

const BANNED_KEYWORDS = ["무조건", "최고", "완벽", "필수템", "인생템", "역대급", "극강", "종결자"];

export function DraftViewer({ draftText, onDraftChange, parsed, imageUrls }: DraftViewerProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"editor" | "sections">("editor");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyHTML = () => {
    const html = generateSmartStoreHTML(parsed, imageUrls);
    copyToClipboard(html, "html");
  };

  // Check for banned words in the current text
  const detectedBannedWords = BANNED_KEYWORDS.filter((word) => draftText.includes(word));

  const charCount = draftText.length;
  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white border border-[#E5E2DF] rounded-xl flex flex-col h-full shadow-xs overflow-hidden">
      {/* Top Action Toolbar */}
      <div className="px-5 py-3.5 border-b border-[#E5E2DF] bg-white flex flex-wrap items-center justify-between gap-3">
        {/* Left Sub-tabs */}
        <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 rounded-full border border-[#E5E2DF] text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab("editor")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              activeSubTab === "editor"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-[#7A7672] hover:text-[#1A1A1A]"
            }`}
          >
            <span className="flex items-center space-x-1.5 text-xs">
              <Edit3 className="w-3.5 h-3.5" />
              <span>원고 전문 (편집기)</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("sections")}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              activeSubTab === "sections"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-[#7A7672] hover:text-[#1A1A1A]"
            }`}
          >
            <span className="flex items-center space-x-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>섹션별 분할 카드</span>
            </span>
          </button>
        </div>

        {/* Right Copy Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyHTML}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#2D2D2D] border border-[#2D2D2D] rounded-full hover:bg-[#2D2D2D] hover:text-white transition-colors"
            title="스마트스토어 스마트에디터 ONE HTML 소스로 복사"
          >
            {copiedType === "html" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span className="font-semibold">HTML 복사됨</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5 text-[#7A7672]" />
                <span>HTML 서식 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(draftText, "all")}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#2D2D2D] hover:bg-[#1A1A1A] rounded-full transition-colors shadow-xs"
            title="원고 전체 텍스트 클립보드 복사"
          >
            {copiedType === "all" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>전체 복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>전체 원고 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification / Alert Banner */}
      <div className="px-5 py-2.5 bg-[#FDFCFB] border-b border-[#E5E2DF] flex flex-wrap items-center justify-between text-xs text-[#7A7672] gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-[#5A5A40]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span className="font-medium text-[#2D2D2D]">9단계 에디토리얼 표준 준수</span>
          </span>

          {detectedBannedWords.length > 0 ? (
            <span className="flex items-center space-x-1 text-[#8B0000] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>과장 금지어 감지: {detectedBannedWords.join(", ")}</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[#5A5A40] font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>과장 표현 없음 (청정 원고)</span>
            </span>
          )}
        </div>

        <div className="text-[11px] text-[#7A7672] font-mono">
          공백포함 {charCount}자 · 단어 {wordCount}개
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-[#FDFCFB]">
        {activeSubTab === "editor" ? (
          <div className="h-full flex flex-col">
            <div className="mb-2 flex items-center justify-between text-xs text-[#7A7672]">
              <span>* 스마트스토어 상세페이지 본문에 바로 붙여넣을 수 있는 완성 원고입니다.</span>
            </div>
            <textarea
              value={draftText}
              onChange={(e) => onDraftChange(e.target.value)}
              className="flex-1 w-full min-h-[460px] p-4 bg-white border border-[#E5E2DF] rounded-md text-[#2D2D2D] font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#2D2D2D] shadow-xs resize-y"
              placeholder="상세페이지 초안이 생성되면 이곳에 표시됩니다."
              spellCheck={false}
            />
          </div>
        ) : (
          /* Section by Section Breakdown View */
          <div className="space-y-4 max-w-4xl mx-auto pb-10">
            {/* Section 1: Product Name */}
            <div className="p-5 bg-white border border-[#E5E2DF] rounded-lg shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">1. PRODUCT NAME</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(parsed.productName, "sec1")}
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec1" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <p className="text-base font-semibold text-[#1A1A1A] font-serif">{parsed.productName || "-"}</p>
            </div>

            {/* Section 2: Headline */}
            <div className="p-5 bg-white border border-[#E5E2DF] rounded-lg shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">2. CORE HEADLINE (1~2문장)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(parsed.headline, "sec2")}
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec2" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <p className="text-base italic text-[#5A5A40] leading-relaxed font-serif">{parsed.headline || "-"}</p>
            </div>

            {/* Section 3: Customer Situation */}
            <div className="p-6 bg-[#F9F8F6] border-l-4 border-[#5A5A40] border border-t-[#E5E2DF] border-r-[#E5E2DF] border-b-[#E5E2DF] rounded-r-lg shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">3. CUSTOMER SITUATION</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(parsed.customerSituation, "sec3")}
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec3" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">{parsed.customerSituation || "-"}</p>
            </div>

            {/* Section 4: Features */}
            <div className="p-5 bg-white border border-[#E5E2DF] rounded-lg shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">4. CORE FEATURES (최대 3개)</span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      parsed.features.map((f) => `- ${f.title}\n${f.desc}`).join("\n\n"),
                      "sec4"
                    )
                  }
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec4" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <div className="space-y-4">
                {parsed.features.map((f, idx) => (
                  <div key={idx} className="p-4 bg-[#F9F8F6] rounded-md border border-[#E5E2DF]">
                    <h4 className="text-sm font-bold text-[#1A1A1A] mb-1.5 border-b border-[#2D2D2D] pb-0.5 inline-block">
                      {f.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Usage Scene */}
            <div className="p-5 bg-white border border-[#E5E2DF] rounded-lg shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">5. USAGE SCENE</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(parsed.usageScene, "sec5")}
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec5" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">{parsed.usageScene || "-"}</p>
            </div>

            {/* Section 6: Closing Statement */}
            <div className="p-5 bg-white border border-[#E5E2DF] rounded-lg shadow-xs text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">6. CLOSING STATEMENT</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(parsed.closingStatement, "sec6")}
                  className="text-xs text-[#7A7672] hover:text-[#1A1A1A] flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedType === "sec6" ? "복사됨" : "복사"}</span>
                </button>
              </div>
              <p className="text-sm sm:text-base text-[#1A1A1A] font-medium leading-relaxed">{parsed.closingStatement || "-"}</p>
            </div>

            {/* Section 7, 8, 9 Standard Notices */}
            <div className="bg-[#F5F5F0] border border-[#E5E2DF] rounded-md p-6 text-[11px] text-[#7A7672] space-y-4 leading-normal">
              <div>
                <p className="font-bold mb-1 text-[#2D2D2D]">[배송안내]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">{parsed.shippingInfo}</p>
              </div>
              <div className="pt-3 border-t border-[#E5E2DF]">
                <p className="font-bold mb-1 text-[#2D2D2D]">[제품 유의사항]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">{parsed.productNotice}</p>
              </div>
              <div className="pt-3 border-t border-[#E5E2DF]">
                <p className="font-bold mb-1 text-[#2D2D2D]">[주의사항]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">{parsed.caution}</p>
              </div>
            </div>

            {/* Section 10 (If any additional info needed) */}
            {parsed.additionalInfoNeeded && parsed.additionalInfoNeeded.length > 0 && (
              <div className="p-5 bg-[#FDFCFB] border border-[#C4C0BB] rounded-md">
                <div className="flex items-center space-x-2 text-[#2D2D2D] font-bold text-xs mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#5A5A40]" />
                  <span className="tracking-wide">[추가 확인이 필요한 정보]</span>
                </div>
                <ul className="list-disc list-inside text-xs text-[#5A5A40] space-y-1">
                  {parsed.additionalInfoNeeded.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-[#7A7672]">
                  * 추가 스펙이나 정보를 채팅창에 입력하시면 즉시 원고에 반영됩니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
