// format currency
export const formatCurrency = (
  value: number,
  currency: string = "JPY",
  locale: string = "ja-JP"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

// format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return (value * 100).toFixed(decimals) + "%";
};

// format date
export const formatDate = (
  date: string | Date,
  locale: string = "ja-JP"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// format date (short)
export const formatDateShort = (
  date: string | Date,
  locale: string = "ja-JP"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

// relative time (e.g. "2 hours ago")
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
};

// truncate text
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// drawing status color
export const getDrawingStatusColor = (
  status: "uploaded" | "processing" | "analyzed" | "failed"
): string => {
  const colors: Record<string, string> = {
    uploaded: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    analyzed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// drawing status label
export const getDrawingStatusLabel = (
  status: "uploaded" | "processing" | "analyzed" | "failed"
): string => {
  const labels: Record<string, string> = {
    uploaded: "Uploaded",
    processing: "Processing",
    analyzed: "Analyzed",
    failed: "Failed",
  };
  return labels[status] || "Unknown";
};

// quote status color
export const getQuoteStatusColor = (
  status: "generated" | "reviewed" | "approved" | "rejected" | "finalized"
): string => {
  const colors: Record<string, string> = {
    generated: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    finalized: "bg-purple-100 text-purple-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// quote status label
export const getQuoteStatusLabel = (
  status: "generated" | "reviewed" | "approved" | "rejected" | "finalized"
): string => {
  const labels: Record<string, string> = {
    generated: "Generated",
    reviewed: "Reviewed",
    approved: "Approved",
    rejected: "Rejected",
    finalized: "Finalized",
  };
  return labels[status] || "Unknown";
};

// calculate profit margin percentage
export const calculateProfitMargin = (
  sellingPrice: number,
  costPrice: number
): number => {
  if (costPrice === 0) return 0;
  return ((sellingPrice - costPrice) / costPrice) * 100;
};

// confidence score color
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return "bg-green-100 text-green-800";
  if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

// confidence score label
export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 80) return "High";
  if (confidence >= 60) return "Medium";
  return "Low";
};

// generate unique id
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// deep clone object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// merge objects
export const mergeObjects = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  return { ...target, ...source };
};

// check if object empty
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

// convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
  });
};

// download file
export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("failed to copy:", error);
    return false;
  }
};

// validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// validate phone number (basic)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};