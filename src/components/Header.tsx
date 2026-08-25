import { Sparkles, BookOpen, FolderClock, RotateCcw } from "lucide-react";

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  savedCount: number;
}

export function Header({ onOpenGuide, onOpenHistory, onReset, savedCount }: HeaderProps) {
  return (
    <header className="border-b border-[#E5E2DF] bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-lg sm:text-xl font-bold tracking-tighter text-[#1A1A1A] font-serif">
              HOW ARE YOU.
            </span>
            <span className="hidden sm:inline-block h-3.5 w-[1px] bg-[#E5E2DF]"></span>
            <span className="text-xs sm:text-sm font-medium text-[#7A7672]">
              스마트스토어 상세페이지 어시스턴트
            </span>
          </div>
          <span className="hidden lg:inline-flex items-center text-[11px] font-normal tracking-wide text-[#8C8884] bg-[#F9F8F6] px-2.5 py-0.5 rounded-full border border-[#E5E2DF]">
            하와유 대표님 전용 에디토리얼 원고
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#2D2D2D] border border-[#2D2D2D] rounded-full hover:bg-[#2D2D2D] hover:text-white transition-colors"
            title="하와유 작성 원칙 및 기준 보기"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>작성 원칙</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#2D2D2D] border border-[#2D2D2D] rounded-full hover:bg-[#2D2D2D] hover:text-white transition-colors relative"
            title="저장된 원고 기록"
          >
            <FolderClock className="w-3.5 h-3.5" />
            <span>원고 보관함</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold text-white bg-[#2D2D2D] rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-[#7A7672] hover:text-[#1A1A1A] transition-colors"
            title="입력 내용 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
}
