import { X, CheckCircle2, AlertTriangle, ShieldCheck, FileText } from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FDFCFB] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-[#E5E2DF] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E2DF] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#2D2D2D] text-white rounded-md">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-[#1A1A1A] font-serif">
                HAWAYU EDITORIAL PRINCIPLES
              </h3>
              <p className="text-xs text-[#7A7672]">네이버 스마트스토어 등록 시 준수되는 4대 원칙</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#2D2D2D]">
          {/* Rule 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#1A1A1A] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span>1. 사실 기반 작성 및 추측 금지</span>
            </div>
            <p className="text-[#5A5A5A] text-xs pl-6 leading-relaxed">
              입력된 정보와 첨부된 사진에 없는 내용은 임의로 만들어내지 않습니다. 명확하게 확인되지 않는 소재, 크기, 성능, 인증, 원산지 등의 정보는 추측하지 않으며, 부족한 경우 원고 하단에 <strong>[추가 확인이 필요한 정보]</strong>로 명시합니다.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#1A1A1A] font-semibold">
              <AlertTriangle className="w-4 h-4 text-[#8C6D3F] shrink-0" />
              <span>2. 과장/최고급 표현 절대 배제</span>
            </div>
            <div className="pl-6 space-y-1.5">
              <p className="text-[#5A5A5A] text-xs leading-relaxed">
                근거 없는 과장 표현을 엄격히 배제하여 고객에게 진솔하고 신뢰할 수 있는 브랜드 이미지를 전달합니다.
              </p>
              <div className="p-3 bg-[#F9F8F6] border border-[#E5E2DF] rounded-md text-xs flex items-center space-x-2 text-[#2D2D2D]">
                <span className="font-bold text-[#8C3F3F]">금지 표현:</span>
                <span>"무조건", "최고", "완벽", "필수템", "인생템", "역대급"</span>
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#1A1A1A] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span>3. 가족의 공간과 일상 속 쓰임새 연결</span>
            </div>
            <p className="text-[#5A5A5A] text-xs pl-6 leading-relaxed">
              하와유의 제품이 가정의 공간(거실, 주방, 침실, 서재 등)과 일상 속에서 어떻게 쓰이는지 자연스럽게 묘사합니다. 단순 감성적 수식어 나열이 아닌, 소비자의 쉬운 일상 언어로 기능과 가치를 풀어냅니다.
            </p>
          </div>

          {/* Rule 4: Output structure */}
          <div className="space-y-2 pt-2 border-t border-[#E5E2DF]">
            <div className="flex items-center space-x-2 text-[#1A1A1A] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2D2D2D] shrink-0" />
              <span>4. 9단계 표준 출력 순서 (항상 준수)</span>
            </div>
            <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">1. 상품명</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">2. 상단 핵심 문구 (1~2문장)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">3. 고객 상황 (2~3문장)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">4. 제품 특장점 (3개 이내)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">5. 사용 장면 (사진 반영)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">6. 구매 마무리 문구 (1~2문장)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">7. 배송안내 (기본 고정문구)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded">8. 제품 유의사항 (기본 고정문구)</div>
              <div className="p-2 bg-white border border-[#E5E2DF] rounded col-span-1 sm:col-span-2">9. 주의사항 (기본 고정문구)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5E2DF] bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#2D2D2D] rounded-full hover:bg-[#F9F8F6] transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
