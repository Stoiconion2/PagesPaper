import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, Check, ArrowRight, CornerDownLeft } from "lucide-react";
import { ChatMessage } from "../types";

interface RefinementChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onApplyToDraft: (replyText: string) => void;
  productName: string;
}

const QUICK_PROMPTS = [
  "💡 사용 장면에 가족 일상과 휴식 분위기 더 살려줘",
  "✂️ 특장점 소제목을 더 직관적이고 1줄로 정돈해줘",
  "📝 상단 핵심 문구를 더 담백하고 신뢰감 있게 다듬어줘",
  "🌿 원목과 패브릭의 자연스러운 감촉 느낌을 문장에 더해줘",
  "🔍 빠진 사이즈와 소재 정보를 전달할 테니 원고에 반영해줘",
];

export function RefinementChat({
  messages,
  onSendMessage,
  isLoading,
  onApplyToDraft,
  productName,
}: RefinementChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText("");
    await onSendMessage(text);
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt.replace(/^[^\s]+\s/, ""));
  };

  return (
    <div className="bg-white border border-[#E5E2DF] rounded-xl flex flex-col h-full shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-[#E5E2DF] bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#2D2D2D] text-white rounded-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] font-serif">
              EDITORIAL ASSISTANT
            </h3>
            <p className="text-[11px] text-[#7A7672]">
              {productName ? `현재 상품: ${productName}` : "원고 문구 실시간 피드백 및 부분 수정"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2.5 bg-[#F9F8F6] border-b border-[#E5E2DF] flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] uppercase tracking-widest text-[#7A7672] font-bold shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-[#5A5A40]" />
          <span>추천:</span>
        </span>
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePromptClick(p)}
            className="text-xs px-3 py-1 bg-white hover:bg-[#F2F0ED] text-[#4A4A4A] border border-[#E5E2DF] hover:border-[#2D2D2D] rounded-full shrink-0 transition-colors text-left"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#FDFCFB]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A7672] space-y-2">
            <Bot className="w-10 h-10 text-[#C4C0BB] stroke-1" />
            <p className="text-xs font-semibold text-[#1A1A1A]">
              생성된 원고에 대해 수정하고 싶은 부분이나 추가 정보를 알려주세요.
            </p>
            <p className="text-[11px] text-[#7A7672] max-w-xs leading-relaxed">
              "특장점 2번 설명을 더 간결하게 해줘", "부족한 사이즈 정보(45x45)를 추가해줘" 등 언제든 말씀하세요.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } space-y-1`}
            >
              <div className="flex items-center space-x-1.5 text-[10px] text-[#7A7672] px-1 font-mono">
                {msg.role === "user" ? (
                  <>
                    <span className="font-semibold text-[#1A1A1A]">대표님</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#5A5A40]" />
                    <span className="font-semibold text-[#1A1A1A]">하와유 AI</span>
                  </>
                )}
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.role === "user"
                    ? "bg-[#2D2D2D] text-white"
                    : "bg-[#F9F8F6] text-[#2D2D2D] border border-[#E5E2DF]"
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* If model provides a full revised draft with standard numbers, show "Apply to Draft" button */}
                {msg.role === "model" && (msg.text.includes("1. 상품명") || msg.text.includes("2. 상단 핵심 문구")) && (
                  <div className="mt-3 pt-2.5 border-t border-[#E5E2DF] flex justify-end">
                    <button
                      type="button"
                      onClick={() => onApplyToDraft(msg.text)}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-[#F2F0ED] text-[#2D2D2D] text-xs font-semibold rounded-full border border-[#2D2D2D] transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>이 수정본을 현재 원고로 덮어쓰기</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-1.5 text-[10px] text-[#7A7672] px-1 font-mono">
              <Bot className="w-3 h-3 text-[#5A5A40]" />
              <span className="font-semibold text-[#1A1A1A]">하와유 AI</span>
            </div>
            <div className="bg-[#F9F8F6] border border-[#E5E2DF] rounded-xl px-4 py-3 shadow-2xs">
              <div className="flex items-center space-x-2 text-[#7A7672] text-xs">
                <div className="w-2 h-2 rounded-full bg-[#2D2D2D] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#2D2D2D] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#2D2D2D] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-xs">에디토리얼 원고 다듬는 중...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#E5E2DF] bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="수정 요청 또는 추가할 상품 정보를 입력하세요..."
            disabled={isLoading}
            className="w-full text-xs sm:text-sm pl-4 pr-12 py-2.5 bg-white border border-[#E5E2DF] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2D2D2D] text-[#1A1A1A] placeholder:text-[#9E9B97]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 p-2 bg-[#2D2D2D] hover:bg-[#1A1A1A] disabled:bg-[#D5D2CD] text-white rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="메시지 전송"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
