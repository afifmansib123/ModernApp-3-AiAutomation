import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  QuotationResult,
  ApiResponse,
  PaginatedResponse,
  DrawingSpecs,
  CostBreakdown,
  MarketAdjustment,
} from "@/types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
    prepareHeaders: async (headers) => {
      try {
        const { fetchAuthSession } = await import("aws-amplify/auth");
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken.toString()}`);
        }
      } catch (error) {
        console.error("Failed to get auth session:", error);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Quote"],
  endpoints: (build) => ({
    // upload single drawing - returns quote immediately
    uploadDrawing: build.mutation<
      ApiResponse<{
        drawingId: string;
        quoteId: string;
        baseCost: number;
        marketAdjustment: MarketAdjustment;
        finalPrice: number;
        confidenceScore: number;
        breakdown: CostBreakdown;
        extractedSpecs: DrawingSpecs;
        analysis: string;
      }>,
      FormData
    >({
      query: (formData) => ({
        url: "/quotes/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote"],
    }),

    // upload multiple drawings - returns array of quotes
    uploadMultipleDrawings: build.mutation<
      ApiResponse<QuotationResult[]>,
      FormData
    >({
      query: (formData) => ({
        url: "/quotes/batch",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote"],
    }),

    // get single quote by id
    getQuote: build.query<ApiResponse<QuotationResult>, string>({
      query: (quoteId) => `/quotes/${quoteId}`,
      providesTags: (result, error, quoteId) => [
        { type: "Quote", id: quoteId },
      ],
    }),

    // update quote status
    updateQuoteStatus: build.mutation<
      ApiResponse<{ message: string }>,
      { quoteId: string; status: "reviewed" | "approved" | "rejected" | "finalized" }
    >({
      query: ({ quoteId, status }) => ({
        url: `/quotes/${quoteId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { quoteId }) => [
        { type: "Quote", id: quoteId },
      ],
    }),

    // get all quotes with pagination
    getQuotes: build.query<
      PaginatedResponse<QuotationResult>,
      {
        page?: number;
        limit?: number;
        status?: string;
      }
    >({
      query: (params = {}) => ({
        url: "/quotes",
        params,
      }),
      providesTags: ["Quote"],
    }),
  }),
});

export const {
  useUploadDrawingMutation,
  useUploadMultipleDrawingsMutation,
  useGetQuoteQuery,
  useUpdateQuoteStatusMutation,
  useGetQuotesQuery,
} = api;