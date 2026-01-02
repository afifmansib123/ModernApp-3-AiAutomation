"use client";

import React, { useState, useRef } from "react";
import { useUploadDrawingMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle, CheckCircle2, FileUp } from "lucide-react";
import { validateDrawingFile } from "@/lib/validation";
import { formatFileSize } from "@/services/drawing.service";

export default function UploadPage() {
  const [uploadDrawing, { isLoading }] = useUploadDrawingMutation();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      setFile(droppedFiles[0]);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      setFile(files[0]);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("please select a file");
      return;
    }

    // validate file
    const validation = validateDrawingFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "invalid file");
      setUploadStatus("error");
      return;
    }

    try {
      setUploadStatus("uploading");
      const formData = new FormData();
      formData.append("drawing", file);

      const result = await uploadDrawing(formData).unwrap();

      setUploadStatus("success");
      setErrorMessage("");

      // redirect to quotation page
      setTimeout(() => {
        router.push(`/quotes/${result.data.quoteId}`);
      }, 2000);
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(
        error?.data?.message || error.message || "upload failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            upload engineering drawing
          </h1>
          <p className="text-slate-600 mt-2">
            upload your drawing to generate an automated quotation
          </p>
        </div>
      </header>

      {/* main content */}
      <main className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            {/* upload area */}
            <div className="mb-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-300 hover:border-blue-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.gif,.webp"
                />

                {!file ? (
                  <>
                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      drop your drawing here
                    </h3>
                    <p className="text-slate-600 mb-4">
                      or click to browse from your computer
                    </p>
                    <p className="text-sm text-slate-500">
                      supported: jpeg, png, gif, webp, pdf (max 50mb)
                    </p>
                  </>
                ) : (
                  <>
                    <FileUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {file.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {formatFileSize(file.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-4"
                    >
                      change file
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* status messages */}
            {uploadStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">upload error</h4>
                  <p className="text-sm text-red-800 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    upload successful
                  </h4>
                  <p className="text-sm text-green-800 mt-1">
                    redirecting to quotation...
                  </p>
                </div>
              </div>
            )}

            {/* upload button */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className={`flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? "opacity-75" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    uploading...
                  </>
                ) : (
                  "generate quotation"
                )}
              </button>
            </div>

            {/* info */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">
                how it works:
              </h4>
              <ol className="text-sm text-slate-700 space-y-2">
                <li>1. upload your engineering drawing</li>
                <li>2. ai analyzes dimensions and materials</li>
                <li>3. system calculates cost estimate</li>
                <li>4. market prices analyzed for competitive pricing</li>
                <li>5. receive complete quotation with recommendations</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}