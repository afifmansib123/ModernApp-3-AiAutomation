
// user types
export interface User {
  cognitoInfo: {
    signInDetails?: any;
    username: string;
    userId: string;
  };
  userInfo: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
  };
  userRole: "user" | "admin";
}

// drawing specs and cost type
export interface DrawingSpecs {
  material: string;
  materialQuantity: number;
  materialUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  manufacturingProcess: string[];
  complexity: number; // 1-10
  specialRequirements: string[];
  confidence: number; // 0-100
}
// cost break down
export interface CostBreakdown {
  material: {
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  };
  labor: {
    hours: number;
    hourlyRate: number;
    totalCost: number;
  };
  overhead: {
    percentage: number;
    totalCost: number;
  };
  baseCost: number;
}

// market adjustment factor
export interface MarketAdjustment {
  factor: number; // e.g., 1.05 for 5% increase
  reason: string;
  dataSource: string;
}

// drawing and quotation request types

export interface DrawingFile {
  id: string;
  fileName: string;
  fileType: "pdf" | "image" | "cad";
  filePath: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "analyzed" | "failed";
  extractedSpecs?: DrawingSpecs;
  processingTime?: number; // in milliseconds
}

export interface QuotationRequest {
  id: string;
  drawingId: string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdBy: string;
}

// quotation result types

export interface QuotationResult {
  _id: string;  // MongoDB _id
  drawingId: string;
  extractedSpecs: DrawingSpecs;
  breakdown: CostBreakdown;
  marketAdjustment: MarketAdjustment;
  baseCost: number;
  finalPrice: number;
  currency: string;
  confidenceScore: number;
  status: "generated" | "reviewed" | "approved" | "rejected" | "finalized";
  createdAt: string;
  updatedAt: string;
  analysis?: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  __v?: number;
}

export interface QuotationHistory {
  id: string; // Quote._id
  drawingId: string;
  fileName: string;
  uploadedAt: string;
  quotationResult: QuotationResult | null;
  status: "pending" | "processing" | "completed" | "failed";
}

// PHASE 2 TYPES (Historical & Review)

export interface HistoricalQuote {
  id: string;
  clientId: string; // e.g., 'inada_manufacturing'
  drawingSpecs: DrawingSpecs;
  quotedPrice: number;
  actualPrice?: number;
  profitMargin?: number;
  timestamp: string;
  notes?: string;
  isAccurate: boolean;
}

export interface ReviewFeedback {
  id: string;
  quoteId: string;
  aiGeneratedPrice: number;
  userCorrectedPrice: number;
  difference: number;
  percentageDifference: number;
  feedback?: string;
  isAccurate: boolean;
  reviewedAt: string;
  reviewedBy: string;
  clientId?: string;
}

// API response types

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  details?: Record<string, any>;
}

// file upload types

export interface FileUploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "completed" | "failed";
  error?: string;
}

export interface S3UploadResponse {
  url: string;
  key: string;
  bucket: string;
  location: string;
}

// form and ui types

export interface UploadFormData {
  drawing: File;
  description?: string;
}

export interface QuoteFilters {
  status?: QuotationResult["status"];
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  minConfidence?: number;
}

export interface QuotationStats {
  totalQuotes: number;
  completedQuotes: number;
  failedQuotes: number;
  averageConfidence: number;
  averageProcessingTime: number; // in ms
  totalValue: number; // sum of all finalPrice
}

// API REQUEST/RESPONSE SPECIFIC TYPES

// POST /api/quotes/upload response
export interface UploadQuoteResponse extends ApiResponse<{
  drawingId: string;
  quoteId: string;
  baseCost: number;
  marketAdjustment: MarketAdjustment;
  finalPrice: number;
  confidenceScore: number;
  breakdown: CostBreakdown;
  extractedSpecs: DrawingSpecs;
  analysis: string;
}> {}

// GET /api/quotes/:quoteId response
export interface GetQuoteResponse extends ApiResponse<QuotationResult> {}

// PUT /api/quotes/:quoteId/status response
export interface UpdateQuoteStatusResponse extends ApiResponse<{
  message: string;
  status: QuotationResult["status"];
}> {}

// POST /api/quotes/batch response
export interface BatchQuotesResponse extends ApiResponse<QuotationResult[]> {
  message?: string;
}

// utility types

export type QuoteStatus = "generated" | "reviewed" | "approved" | "rejected" | "finalized";
export type DrawingStatus = "uploaded" | "processing" | "analyzed" | "failed";
export type FileType = "pdf" | "image" | "cad";
export type UserRole = "user" | "admin";

// Complexity display helper
export const COMPLEXITY_LABELS: Record<number, string> = {
  1: "Very Simple",
  2: "Simple",
  3: "Easy",
  4: "Moderate-Easy",
  5: "Moderate",
  6: "Moderate-Complex",
  7: "Complex",
  8: "Very Complex",
  9: "Extremely Complex",
  10: "Extremely Complex (Expert)",
};

// Confidence color helper
export const CONFIDENCE_LEVELS = {
  high: { min: 80, label: "High Confidence", color: "green" },
  medium: { min: 60, label: "Medium Confidence", color: "yellow" },
  low: { min: 0, label: "Low Confidence", color: "red" },
} as const;