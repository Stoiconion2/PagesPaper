import React from "react";
import { X, FolderClock, Trash2, ArrowUpRight, Calendar, Layers } from "lucide-react";
import { SavedDraft } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDrafts: SavedDraft[];
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  savedDrafts,
  onLoadDraft,
  onDeleteDraft,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FDFCFB] h-full shadow-2xl flex flex-col border-l border-[#E5E2DF] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E2DF] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#2D2D2D] text-white rounded-md">
              <FolderClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-[#1A1A1A] font-serif">
                ARCHIVED MANUSCRIPTS
              </h3>
              <p className="text-xs text-[#7A7672]">저장된 신제품 상세페이지 초안 ({savedDrafts.length})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#7A7672] hover:text-[#1A1A1A] hover:bg-[#F2F0ED] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Drafts */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedDrafts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-[#7A7672] p-6">
              <FolderClock className="w-12 h-12 stroke-1 text-[#C4C0BB] mb-2" />
              <p className="text-xs font-semibold text-[#1A1A1A]">보관된 원고가 없습니다.</p>
              <p className="text-[11px] text-[#7A7672] mt-1 leading-relaxed">
                신제품 정보를 입력하고 초안을 작성하면 자동으로 안전하게 보관됩니다.
              </p>
            </div>
          ) : (
            savedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 bg-white hover:bg-[#F9F8F6] border border-[#E5E2DF] rounded-xl transition-all space-y-2 group shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-[#1A1A1A] font-serif leading-snug line-clamp-2">
                    {draft.productName || "제목 없는 상품"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onDeleteDraft(draft.id)}
                    className="text-[#9E9B97] hover:text-[#8C3F3F] p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="원고 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-[#5A5A5A] line-clamp-2 leading-relaxed font-sans">
                  {draft.features}
                </p>

                <div className="pt-2.5 border-t border-[#E5E2DF] flex items-center justify-between text-[11px] text-[#7A7672]">
                  <div className="flex items-center space-x-1 font-mono">
                    <Calendar className="w-3 h-3 text-[#7A7672]" />
                    <span>{new Date(draft.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLoadDraft(draft);
                      onClose();
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2D2D2D] hover:text-[#1A1A1A]"
                  >
                    <span>불러오기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
