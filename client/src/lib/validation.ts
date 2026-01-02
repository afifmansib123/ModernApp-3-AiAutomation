import { z } from "zod";

// file upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 50 * 1024 * 1024,
      "file size must be less than 50mb"
    )
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
        ].includes(file.type),
      "only jpeg, png, gif, webp, and pdf files allowed"
    ),
  description: z.string().optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// batch file upload validation
export const batchFileUploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "at least one file required")
    .max(10, "maximum 10 files allowed")
    .refine(
      (files) =>
        files.every(
          (file) =>
            [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
              "image/webp",
              "application/pdf",
            ].includes(file.type)
        ),
      "all files must be jpeg, png, gif, webp, or pdf"
    )
    .refine(
      (files) => files.every((file) => file.size <= 50 * 1024 * 1024),
      "all files must be less than 50mb"
    ),
});

export type BatchFileUploadInput = z.infer<typeof batchFileUploadSchema>;

// quote status update validation
export const quoteStatusUpdateSchema = z.object({
  status: z.enum(["reviewed", "approved", "rejected", "finalized"]),
});

export type QuoteStatusUpdateInput = z.infer<typeof quoteStatusUpdateSchema>;

// drawing filter validation
export const drawingFilterSchema = z.object({
  status: z.enum(["uploaded", "processing", "analyzed", "failed"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type DrawingFilterInput = z.infer<typeof drawingFilterSchema>;

// quotation result filter validation
export const quotationFilterSchema = z.object({
  status: z
    .enum(["generated", "reviewed", "approved", "rejected", "finalized"])
    .optional(),
  minConfidence: z.number().min(0).max(100).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type QuotationFilterInput = z.infer<typeof quotationFilterSchema>;

// user profile validation
export const userProfileSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").max(100),
  email: z.string().email("invalid email address"),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// login validation
export const loginSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// helper: validate drawing file
export function validateDrawingFile(file: File): { valid: boolean; error?: string } {
  try {
    fileUploadSchema.parse({ file });
    return { valid: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => e.message).join(", ");
      return { valid: false, error: messages };
    }
    return { valid: false, error: "validation error" };
  }
}

// helper: validate batch files
export function validateBatchFiles(files: FileList): { valid: boolean; error?: string } {
  try {
    batchFileUploadSchema.parse({ files: Array.from(files) });
    return { valid: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e) => e.message).join(", ");
      return { valid: false, error: messages };
    }
    return { valid: false, error: "validation error" };
  }
}