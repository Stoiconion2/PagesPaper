export interface UploadedImage {
  id: string;
  data: string; // base64 data URL
  mimeType: string;
  name: string;
  size: number;
}

export interface ProductInput {
  productName: string;
  features: string;
  additionalNotes: string;
  images: UploadedImage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

export interface SavedDraft {
  id: string;
  createdAt: number;
  updatedAt: number;
  productName: string;
  features: string;
  additionalNotes: string;
  images: Array<{
    id: string;
    data: string;
    mimeType: string;
    name: string;
  }>;
  draftText: string;
  chatHistory: ChatMessage[];
}

export interface ParsedSections {
  productName: string;
  headline: string;
  customerSituation: string;
  features: Array<{ title: string; desc: string }>;
  usageScene: string;
  closingStatement: string;
  shippingInfo: string;
  productNotice: string;
  caution: string;
  additionalInfoNeeded?: string[];
}
