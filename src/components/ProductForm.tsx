import React, { useRef } from "react";
import { Sparkles, Upload, X, Image as ImageIcon, Lightbulb, FileText, Check } from "lucide-react";
import { ProductInput, UploadedImage } from "../types";

interface ProductFormProps {
  input: ProductInput;
  onChange: (updated: Partial<ProductInput>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onApplyPreset: (preset: { name: string; features: string; notes: string; images?: UploadedImage[] }) => void;
}

const PRESETS = [
  {
    title: "워싱 린넨 소파 쿠션 커버",
    name: "하와유 네추럴 워싱 린넨 소파 쿠션 커버 (45x45cm)",
    features: `- 바이오 워싱 가공 처리된 린넨 100% 원단으로 피부에 닿는 촉감이 부드럽고 쾌적함
- 통기성과 흡수성이 뛰어나 사계절 내내 땀 차지 않고 쾌적하게 사용 가능
- 지퍼가 겉으로 드러나지 않는 히든 콘솔 지퍼 마감으로 소파나 피부에 걸림 없이 깔끔함
- 차분한 오트밀, 베이지, 차콜 톤으로 거실 인테리어에 자연스럽게 어우러짐`,
    notes: "거실 소파와 침실 공간에서 편안하게 기댈 수 있는 일상 속 포근함을 강조해주세요.",
  },
  {
    title: "원목 캔들 워머 트레이",
    name: "하와유 원목 캔들 워머 앤 인센스 트레이",
    features: `- 단단한 물푸레나무(애쉬 원목)를 깎아 제작하여 나뭇결이 살아있고 내구성이 높음
- 천연 오일 마감으로 은은한 원목 본연의 온기를 느낄 수 있음
- 캔들 워머 받침뿐 아니라 룸스프레이, 쥬얼리, 열쇠 등 일상 소품 정리 트레이로 다용도 활용 가능
- 바닥면에 논슬립 실리콘 패드가 부착되어 테이블 스크래치 방지 및 미끄럼 방지`,
    notes: "퇴근 후 저녁 시간, 서재나 침실 협탁 위에서 차분한 휴식을 돕는 제품입니다.",
  },
  {
    title: "순면 와플 키친 크로스 3종",
    name: "하와유 코튼 와플 키친 크로스 3P 세트",
    features: `- 올록볼록한 와플 조직으로 수분 흡수 속도가 빠르고 건조가 빨라 위생적임
- 무형광 100% 순면 원사로 주방 식기 물기 닦기, 냄비 손잡이, 티매트 등 안심하고 사용 가능
- 고리 스트랩이 부착되어 있어 주방 걸이나 S자 고리에 걸어두기 편리함
- 세탁 후에도 조직감이 쉽게 무너지지 않아 데일리 주방 패브릭으로 적합`,
    notes: "매일 요리하고 차를 마시는 주방 식탁 위에서 가족과 함께하는 정갈한 일상을 표현해주세요.",
  },
];

export function ProductForm({
  input,
  onChange,
  onSubmit,
  isLoading,
  onApplyPreset,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const validImages = files.filter((f) => f.type.startsWith("image/"));
    if (validImages.length === 0) return;

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newImg: UploadedImage = {
          id: Math.random().toString(36).substring(2, 9),
          data: result,
          mimeType: file.type,
          name: file.name,
          size: file.size,
        };
        onChange({ images: [...input.images, newImg] });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    onChange({ images: input.images.filter((img) => img.id !== id) });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files) as File[]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.productName.trim() || !input.features.trim()) return;
    onSubmit();
  };

  return (
    <div className="bg-[#F9F8F6] border border-[#E5E2DF] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      {/* Top Header & Presets */}
      <div className="mb-5 pb-4 border-b border-[#E5E2DF]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] font-serif">
              PRODUCT INFORMATION
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#7A7672] font-semibold bg-white border border-[#E5E2DF] px-2.5 py-0.5 rounded-full">
            대표님 전용
          </span>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
            <Lightbulb className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>예시 템플릿:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onApplyPreset({
                    name: preset.name,
                    features: preset.features,
                    notes: preset.notes,
                  })
                }
                className="text-xs px-3 py-1 bg-white hover:bg-[#F2F0ED] text-[#4A4A4A] border border-[#E5E2DF] hover:border-[#2D2D2D] rounded-full transition-colors text-left"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        {/* 1. Product Name */}
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
            1. PRODUCT NAME <span className="text-[#8B0000]">*</span>
          </label>
          <input
            type="text"
            value={input.productName}
            onChange={(e) => onChange({ productName: e.target.value })}
            placeholder="예: [하와유] 네추럴 워싱 린넨 소파 쿠션 커버 (45x45cm)"
            className="w-full bg-white border border-[#E5E2DF] p-3 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#2D2D2D] text-[#1A1A1A] placeholder:text-[#9E9B97]"
            required
          />
        </div>

        {/* 2. Product Features */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
              2. CORE FEATURES <span className="text-[#8B0000]">*</span>
            </label>
            <span className="text-[10px] text-[#8C8884]">
              핵심 특징 줄바꿈 입력
            </span>
          </div>
          <textarea
            value={input.features}
            onChange={(e) => onChange({ features: e.target.value })}
            rows={5}
            placeholder={`- 소재 및 가공 방식 (예: 100% 린넨 바이오 워싱)\n- 사용 편의성 및 디테일 (예: 히든 콘솔 지퍼 마감)\n- 일상/가정에서의 실용성 (예: 사계절 쾌적한 통기성)\n- 색상/사이즈 등 기본 정보`}
            className="w-full bg-white border border-[#E5E2DF] p-3 text-xs sm:text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#2D2D2D] text-[#1A1A1A] placeholder:text-[#9E9B97] leading-relaxed resize-none font-sans"
            required
          />
          <p className="text-[10px] text-[#8C8884]">
            * 입력되지 않은 크기, 원산지 등은 임의로 추측하지 않고 작성됩니다.
          </p>
        </div>

        {/* 3. Product Photos */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
              3. ASSET UPLOAD (선택)
            </label>
            <span className="text-[10px] text-[#8C8884]">
              {input.images.length > 0 ? `${input.images.length}장 첨부됨` : "사진 분석 기반"}
            </span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-[#C4C0BB] hover:border-[#2D2D2D] bg-white rounded-md p-3 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center justify-center space-x-2 text-[#7A7672] text-xs py-1">
              <Upload className="w-4 h-4 text-[#5A5A40]" />
              <span>사진 클릭 또는 드래그하여 업로드</span>
            </div>
          </div>

          {/* Thumbnails */}
          {input.images.length > 0 && (
            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {input.images.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-md overflow-hidden border border-[#E5E2DF] aspect-square bg-[#F9F8F6]"
                >
                  <img
                    src={img.data}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-[#1A1A1A]/80 hover:bg-[#8B0000] text-white rounded-full transition-colors opacity-90 group-hover:opacity-100"
                    title="사진 삭제"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Additional Notes / Requirements */}
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
            4. EDITORIAL NOTES (선택)
          </label>
          <input
            type="text"
            value={input.additionalNotes}
            onChange={(e) => onChange({ additionalNotes: e.target.value })}
            placeholder="예: 신혼부부나 아이가 있는 집 추천, 따뜻하고 정갈한 분위기 강조"
            className="w-full bg-white border border-[#E5E2DF] p-3 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-[#2D2D2D] text-[#1A1A1A] placeholder:text-[#9E9B97]"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2 mt-auto">
          <button
            type="submit"
            disabled={isLoading || !input.productName.trim() || !input.features.trim()}
            className="w-full py-3 px-4 bg-[#2D2D2D] hover:bg-[#1A1A1A] active:bg-black disabled:bg-[#D5D2CD] text-white rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>원고 작성 중... (9단계 에디토리얼 구성)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FDFCFB]" />
                <span>하와유 상세페이지 초안 작성하기</span>
              </>
            )}
          </button>
          <div className="mt-2 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest text-[#7A7672] text-center font-medium">
            <span>과장 표현 배제</span>
            <span>·</span>
            <span>일상 쓰임새 집중</span>
            <span>·</span>
            <span>9단계 표준 규격</span>
          </div>
        </div>
      </form>
    </div>
  );
}
