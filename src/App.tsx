import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { GuideModal } from "./components/GuideModal";
import { ProductForm } from "./components/ProductForm";
import { DraftViewer } from "./components/DraftViewer";
import { SmartstorePreview } from "./components/SmartstorePreview";
import { RefinementChat } from "./components/RefinementChat";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { ProductInput, SavedDraft, ChatMessage, UploadedImage } from "./types";
import { parseDraftManuscript } from "./utils/parser";
import { FileText, Eye, MessageSquare, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

const LOCAL_STORAGE_KEY = "hawayu_saved_drafts_v1";

const INITIAL_INPUT: ProductInput = {
  productName: "하와유 네추럴 워싱 린넨 소파 쿠션 커버 (45x45cm)",
  features: `- 바이오 워싱 가공 처리된 린넨 100% 원단으로 피부에 닿는 감촉이 부드럽고 쾌적함
- 통기성과 땀 흡수력이 뛰어나 사계절 내내 끈적임 없이 편안하게 사용 가능
- 지퍼가 겉으로 드러나지 않는 히든 콘솔 지퍼 마감으로 소파나 피부에 걸림 없이 깔끔함
- 차분한 오트밀, 베이지, 차콜 톤으로 거실 인테리어에 자연스럽게 어우러짐`,
  additionalNotes: "가족들이 편안히 머무는 거실 소파 공간에서의 따뜻한 일상을 표현해주세요.",
  images: [],
};

export default function App() {
  const [input, setInput] = useState<ProductInput>(INITIAL_INPUT);
  const [draftText, setDraftText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "chat">("editor");

  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);

  // Load saved drafts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedDrafts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load drafts from storage:", e);
    }
  }, []);

  // Save drafts to localStorage helper
  const persistDrafts = (drafts: SavedDraft[]) => {
    setSavedDrafts(drafts);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.error("Failed to save drafts to storage:", e);
    }
  };

  const handleInputChange = (updated: Partial<ProductInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    if (window.confirm("입력한 내용과 현재 원고를 초기화하시겠습니까?")) {
      setInput({
        productName: "",
        features: "",
        additionalNotes: "",
        images: [],
      });
      setDraftText("");
      setChatHistory([]);
      setErrorMessage(null);
    }
  };

  const handleApplyPreset = (preset: {
    name: string;
    features: string;
    notes: string;
    images?: UploadedImage[];
  }) => {
    setInput({
      productName: preset.name,
      features: preset.features,
      additionalNotes: preset.notes,
      images: preset.images || [],
    });
    setErrorMessage(null);
  };

  // Generate Detail Page Draft
  const handleGenerateDraft = async () => {
    if (!input.productName.trim() || !input.features.trim()) {
      setErrorMessage("상품명과 제품 특장점을 모두 입력해 주세요.");
      return;
    }

    setIsLoadingDraft(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: input.productName,
          features: input.features,
          additionalNotes: input.additionalNotes,
          images: input.images.map((img) => ({
            data: img.data,
            mimeType: img.mimeType,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "원고 생성에 실패했습니다.");
      }

      const generatedText = data.draft || "";
      setDraftText(generatedText);

      // Auto-save to saved drafts
      const newDraftItem: SavedDraft = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        productName: input.productName,
        features: input.features,
        additionalNotes: input.additionalNotes,
        images: input.images,
        draftText: generatedText,
        chatHistory: [],
      };

      const updatedList = [newDraftItem, ...savedDrafts.filter((d) => d.productName !== input.productName)];
      persistDrafts(updatedList);

      // Welcome chat message
      setChatHistory([
        {
          id: Math.random().toString(36).substring(2, 9),
          role: "model",
          text: `대표님, [${input.productName}]의 9단계 표준 상세페이지 초안 작성이 완료되었습니다. 과장된 표현 없이 일상 속 가치를 살려 구성했습니다. 수정이나 추가하고 싶은 부분이 있다면 말씀해주세요.`,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      console.error("Error generating draft:", err);
      setErrorMessage(err.message || "원고를 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoadingDraft(false);
    }
  };

  // Send Refinement Chat Message
  const handleSendChatMessage = async (userMessage: string) => {
    const userMsgObj: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      text: userMessage,
      timestamp: Date.now(),
    };

    const newHistory = [...chatHistory, userMsgObj];
    setChatHistory(newHistory);
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/chat-refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentDraft: draftText,
          productName: input.productName,
          features: input.features,
          history: newHistory.map((h) => ({ role: h.role, text: h.text })),
          images: input.images.map((img) => ({
            data: img.data,
            mimeType: img.mimeType,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "메시지 응답 처리에 실패했습니다.");
      }

      const replyText = data.reply || "";
      const modelMsgObj: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: "model",
        text: replyText,
        timestamp: Date.now(),
      };

      setChatHistory((prev) => [...prev, modelMsgObj]);

      // If reply is a complete manuscript (contains section headers), optionally update or let user click button
      if (replyText.includes("1. 상품명") && replyText.includes("2. 상단 핵심 문구")) {
        // We also offer direct overwrite in the chat item UI
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          role: "model",
          text: `오류가 발생했습니다: ${err.message}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleApplyChatToDraft = (replyText: string) => {
    setDraftText(replyText);
    setActiveTab("editor");
  };

  const handleLoadSavedDraft = (draft: SavedDraft) => {
    setInput({
      productName: draft.productName,
      features: draft.features,
      additionalNotes: draft.additionalNotes || "",
      images: draft.images || [],
    });
    setDraftText(draft.draftText);
    setChatHistory(draft.chatHistory || []);
    setErrorMessage(null);
  };

  const handleDeleteSavedDraft = (id: string) => {
    const updated = savedDrafts.filter((d) => d.id !== id);
    persistDrafts(updated);
  };

  const parsed = parseDraftManuscript(draftText);
  const imageUrls = input.images.map((img) => img.data);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] flex flex-col font-sans selection:bg-[#2D2D2D] selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        savedCount={savedDrafts.length}
      />

      {/* Error notification banner */}
      {errorMessage && (
        <div className="bg-[#FFF8F8] border-b border-[#E5C2C2] px-4 py-2.5 text-xs text-[#8C3F3F] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-[#8C3F3F] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-[#8C3F3F] hover:underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Information Input Form */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
          <ProductForm
            input={input}
            onChange={handleInputChange}
            onSubmit={handleGenerateDraft}
            isLoading={isLoadingDraft}
            onApplyPreset={handleApplyPreset}
          />
        </div>

        {/* Right Column: Manuscript Output & Studio */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
          {/* Main Tabs Navigation */}
          <div className="flex items-center justify-between mb-3.5 bg-white p-1 rounded-full border border-[#E5E2DF] shadow-2xs">
            <div className="flex items-center space-x-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === "editor"
                    ? "bg-[#2D2D2D] text-white shadow-xs"
                    : "text-[#7A7672] hover:text-[#1A1A1A]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>원고 전문 & 편집</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  activeTab === "preview"
                    ? "bg-[#2D2D2D] text-white shadow-xs"
                    : "text-[#7A7672] hover:text-[#1A1A1A]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>스마트스토어 뷰</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all relative ${
                  activeTab === "chat"
                    ? "bg-[#2D2D2D] text-white shadow-xs"
                    : "text-[#7A7672] hover:text-[#1A1A1A]"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI 원고 다듬기</span>
                {chatHistory.length > 1 && (
                  <span className="w-2 h-2 rounded-full bg-[#5A5A40] absolute top-1.5 right-1.5" />
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center text-[10px] uppercase tracking-widest text-[#7A7672] font-serif font-bold px-3">
              <span>SMARTSTORE MANUSCRIPT</span>
            </div>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 min-h-0">
            {activeTab === "editor" && (
              <DraftViewer
                draftText={draftText}
                onDraftChange={setDraftText}
                parsed={parsed}
                imageUrls={imageUrls}
              />
            )}

            {activeTab === "preview" && (
              <SmartstorePreview
                parsed={parsed}
                images={input.images}
              />
            )}

            {activeTab === "chat" && (
              <RefinementChat
                messages={chatHistory}
                onSendMessage={handleSendChatMessage}
                isLoading={isLoadingChat}
                onApplyToDraft={handleApplyChatToDraft}
                productName={input.productName}
              />
            )}
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDrafts={savedDrafts}
        onLoadDraft={handleLoadSavedDraft}
        onDeleteDraft={handleDeleteSavedDraft}
      />
    </div>
  );
}
