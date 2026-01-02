import {  validateDrawingFile } from "@/lib/validation";
import type { UploadQuoteResponse } from "@/types";

// upload drawing - for RTK Query (preferred)
export const prepareDrawingFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append("drawing", file);
  return formData;
};

// validate and upload (for manual uploads)
export const uploadDrawingManual = async (
  file: File
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    // validate file
    const validation = validateDrawingFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // create form data
    const formData = prepareDrawingFormData(file);

    // upload
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "upload failed",
      };
    }

    const result: UploadQuoteResponse = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "unknown error",
    };
  }
};

// get file size in mb
export const getFileSizeInMB = (bytes: number): number => {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
};

// format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 bytes";
  const k = 1024;
  const sizes = ["bytes", "kb", "mb", "gb"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// check if file format supported
export const isSupportedFormat = (mimeType: string): boolean => {
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  return supportedTypes.includes(mimeType);
};

// get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

// get file icon type
export const getFileIconType = (mimeType: string): "image" | "pdf" | "unknown" => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  return "unknown";
};