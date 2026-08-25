import React, { useState } from "react";
import { Smartphone, Monitor, ShoppingBag, Heart, Share2, Star, Truck, ShieldAlert, ChevronRight } from "lucide-react";
import { ParsedSections, UploadedImage } from "../types";

interface SmartstorePreviewProps {
  parsed: ParsedSections;
  images: UploadedImage[];
}

export function SmartstorePreview({ parsed, images }: SmartstorePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "pc">("pc");

  return (
    <div className="bg-white border border-[#E5E2DF] rounded-xl flex flex-col h-full shadow-xs overflow-hidden">
      {/* Preview Header / Device Toggle */}
      <div className="px-5 py-3.5 border-b border-[#E5E2DF] bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#5A5A40]" />
          <span className="text-xs uppercase tracking-widest font-bold text-[#1A1A1A] font-serif">
            EDITORIAL PREVIEW
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-[#F9F8F6] p-1 rounded-full border border-[#E5E2DF] text-xs">
          <button
            type="button"
            onClick={() => setDeviceMode("pc")}
            className={`px-3.5 py-1 rounded-full font-medium flex items-center space-x-1 transition-all ${
              deviceMode === "pc"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-[#7A7672] hover:text-[#1A1A1A]"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>에디토리얼 와이드</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3.5 py-1 rounded-full font-medium flex items-center space-x-1 transition-all ${
              deviceMode === "mobile"
                ? "bg-[#2D2D2D] text-white shadow-xs"
                : "text-[#7A7672] hover:text-[#1A1A1A]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>모바일 뷰</span>
          </button>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FDFCFB] flex justify-center items-start">
        <div
          className={`bg-white border border-[#E5E2DF] shadow-xs transition-all duration-300 ${
            deviceMode === "mobile"
              ? "w-full max-w-[420px] rounded-2xl overflow-hidden my-2 border-[#D5D2CD] ring-1 ring-black/5"
              : "w-full max-w-2xl rounded-xl my-4"
          }`}
        >
          {/* SmartStore Simulated Header */}
          <div className="border-b border-[#E5E2DF] bg-white px-5 py-3.5 flex items-center justify-between text-xs sticky top-0 z-10">
            <div className="flex items-center space-x-2 font-bold text-[#1A1A1A] font-serif">
              <span className="text-sm tracking-tight">HOW ARE YOU.</span>
              <span className="text-[10px] text-[#7A7672] font-sans font-normal border-l border-[#E5E2DF] pl-2">
                스토어
              </span>
            </div>
            <div className="flex items-center space-x-3 text-[#7A7672]">
              <Heart className="w-4 h-4 hover:text-[#1A1A1A] cursor-pointer" />
              <Share2 className="w-4 h-4 hover:text-[#1A1A1A] cursor-pointer" />
            </div>
          </div>

          {/* Product Hero Image Carousel (if photos exist) */}
          {images.length > 0 ? (
            <div className="relative aspect-4/3 bg-[#F9F8F6] overflow-hidden border-b border-[#E5E2DF]">
              <img
                src={images[0].data}
                alt={parsed.productName}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-[#1A1A1A]/70 text-white rounded-full text-[10px] font-mono">
                  1 / {images.length}
                </div>
              )}
            </div>
          ) : null}

          {/* Editorial Detail Page Body */}
          <div className="p-6 sm:p-12 space-y-10 bg-white text-[#2D2D2D]">
            {/* Header / Title & Hook */}
            <div className="text-center space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672] block">
                HAWAYU HOME & LIVING
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif text-[#1A1A1A] tracking-tight">
                {parsed.productName || "[하와유] 신제품 상세페이지"}
              </h1>
              {parsed.headline && (
                <p className="text-base sm:text-lg italic text-[#5A5A40] font-serif leading-relaxed">
                  {parsed.headline}
                </p>
              )}
            </div>

            {/* Customer Situation (Editorial Quote Box) */}
            {parsed.customerSituation && (
              <div className="p-6 sm:p-8 bg-[#F9F8F6] border-l-4 border-[#5A5A40] rounded-r-md">
                <p className="text-sm leading-relaxed text-[#4A4A4A] whitespace-pre-line">
                  {parsed.customerSituation}
                </p>
              </div>
            )}

            {/* In-content Image (2nd photo if available) */}
            {images.length > 1 && (
              <div className="rounded-lg overflow-hidden border border-[#E5E2DF]">
                <img
                  src={images[1].data}
                  alt="상세 이미지 2"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Features (Editorial Section) */}
            {parsed.features.length > 0 && (
              <div className="space-y-8 pt-2">
                <div className="space-y-6">
                  {parsed.features.map((feat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h3 className="text-base font-bold border-b border-[#2D2D2D] pb-1 inline-block text-[#1A1A1A]">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-[#4A4A4A] leading-relaxed pt-1">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In-content Image (3rd photo if available) */}
            {images.length > 2 && (
              <div className="rounded-lg overflow-hidden border border-[#E5E2DF]">
                <img
                  src={images[2].data}
                  alt="상세 이미지 3"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Usage Scene */}
            {parsed.usageScene && (
              <div className="space-y-2 pt-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#7A7672]">
                  USAGE SCENE
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
                  {parsed.usageScene}
                </p>
              </div>
            )}

            {/* Closing Statement */}
            {parsed.closingStatement && (
              <div className="pt-8 border-t border-[#E5E2DF] text-center">
                <p className="text-sm sm:text-base font-medium text-[#1A1A1A]">
                  {parsed.closingStatement}
                </p>
              </div>
            )}

            {/* Sections 7, 8, 9: Standard Store Notices */}
            <div className="bg-[#F5F5F0] p-6 text-[11px] text-[#7A7672] space-y-4 leading-normal rounded-md border border-[#E5E2DF]">
              <div>
                <p className="font-bold mb-1 text-[#2D2D2D]">[배송안내]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">
                  {parsed.shippingInfo.replace(/^\[배송안내\]\n?/, "")}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E2DF]">
                <p className="font-bold mb-1 text-[#2D2D2D]">[제품 유의사항]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">
                  {parsed.productNotice.replace(/^\[제품 유의사항\]\n?/, "")}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E2DF]">
                <p className="font-bold mb-1 text-[#2D2D2D]">[주의사항]</p>
                <p className="whitespace-pre-line text-[#4A4A4A]">
                  {parsed.caution.replace(/^\[주의사항\]\n?/, "")}
                </p>
              </div>
            </div>

            {/* Additional info notice if any */}
            {parsed.additionalInfoNeeded && parsed.additionalInfoNeeded.length > 0 && (
              <div className="p-4 bg-[#FDFCFB] border border-[#C4C0BB] rounded-md text-xs text-[#5A5A40]">
                <div className="font-bold mb-1">[추가 확인이 필요한 정보]</div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {parsed.additionalInfoNeeded.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SmartStore Simulated Footer Action Bar */}
          <div className="border-t border-[#E5E2DF] p-3.5 bg-white flex items-center justify-between sticky bottom-0 z-10">
            <div className="flex items-center space-x-3 text-[#7A7672] px-2">
              <Heart className="w-5 h-5 cursor-pointer hover:text-[#1A1A1A]" />
            </div>
            <div className="flex space-x-2 flex-1 max-w-xs">
              <button
                type="button"
                className="flex-1 py-2 px-3 bg-white text-[#2D2D2D] rounded-full text-xs font-semibold border border-[#2D2D2D] hover:bg-[#F9F8F6] transition-colors text-center"
              >
                장바구니
              </button>
              <button
                type="button"
                className="flex-1 py-2 px-3 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white rounded-full text-xs font-semibold text-center transition-colors"
              >
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
