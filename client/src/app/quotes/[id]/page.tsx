"use client";

import React from "react";
import { useGetQuoteQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate, getQuoteStatusColor, getQuoteStatusLabel, getConfidenceColor, getConfidenceLabel } from "@/utils/helper";
import type { QuotationResult } from "@/types";

export default function QuotationPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const { data: response, isLoading, error } = useGetQuoteQuery(quoteId, {
    skip: !quoteId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">loading quotation...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">loading quotation...</p>
        </div>
      </div>
    );
  }

  const quote = response?.data as QuotationResult;

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card max-w-md w-full mx-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-900">error loading quote</h2>
              <p className="text-sm text-red-800 mt-2">
                the quotation could not be loaded. please try again.
              </p>
              <button
                onClick={() => router.back()}
                className="btn-primary mt-4 w-full"
              >
                go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  quotation details
                </h1>
                <p className="text-slate-600 mt-1">id: {quote._id.substring(0, 12)}...</p>
              </div>
            </div>
            <button className="btn-primary">
              <Download className="w-4 h-4 inline mr-2" />
              export pdf
            </button>
          </div>
        </div>
      </header>

      {/* main content */}
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* cost breakdown */}
            <div className="card">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                cost breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">material cost</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(quote.breakdown.material.totalCost, quote.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">labor cost</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(quote.breakdown.labor.totalCost, quote.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">overhead ({quote.breakdown.overhead.percentage}%)</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(quote.breakdown.overhead.totalCost, quote.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">base cost</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(quote.baseCost, quote.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">market adjustment</span>
                  <span className="font-semibold text-slate-900">
                    {quote.marketAdjustment.factor.toFixed(2)}x ({quote.marketAdjustment.reason})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 bg-blue-50 px-4 py-3 rounded-lg">
                  <span className="font-semibold text-slate-900">
                    final price
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(quote.finalPrice, quote.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* extracted specs */}
            {quote.extractedSpecs && (
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  extracted specifications
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">material</p>
                      <p className="font-semibold text-slate-900">{quote.extractedSpecs.material}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">quantity</p>
                      <p className="font-semibold text-slate-900">{quote.extractedSpecs.materialQuantity} {quote.extractedSpecs.materialUnit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">dimensions</p>
                      <p className="font-semibold text-slate-900">
                        {quote.extractedSpecs.dimensions.length}x{quote.extractedSpecs.dimensions.width}x{quote.extractedSpecs.dimensions.height} {quote.extractedSpecs.dimensions.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">complexity</p>
                      <p className="font-semibold text-slate-900">{quote.extractedSpecs.complexity}/10</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">manufacturing processes</p>
                    <div className="flex flex-wrap gap-2">
                      {quote.extractedSpecs.manufacturingProcess.map((process, i) => (
                        <span key={i} className="badge bg-blue-100 text-blue-800">
                          {process}
                        </span>
                      ))}
                    </div>
                  </div>
                  {quote.extractedSpecs.specialRequirements.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">special requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {quote.extractedSpecs.specialRequirements.map((req, i) => (
                          <span key={i} className="badge bg-yellow-100 text-yellow-800">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* analysis */}
            {quote.analysis && (
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  cost analysis
                </h2>
                <div className="text-slate-700 space-y-2">
                  <p>{quote.analysis}</p>
                </div>
              </div>
            )}
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            {/* summary */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">summary</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-600">quote id</p>
                  <p className="text-slate-900 font-mono text-xs break-all">
                    {quote._id}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">status</p>
                  <span className={`badge ${getQuoteStatusColor(quote.status)}`}>
                    {getQuoteStatusLabel(quote.status)}
                  </span>
                </div>
                <div>
                  <p className="text-slate-600">confidence score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-full bg-gray-200 rounded h-2`}>
                      <div
                        className={`h-full rounded transition-all ${
                          quote.confidenceScore >= 80
                            ? "bg-green-500"
                            : quote.confidenceScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${quote.confidenceScore}%` }}
                      />
                    </div>
                    <span className="font-semibold">{quote.confidenceScore.toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-600">created</p>
                  <p className="text-slate-900">
                    {formatDate(quote.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">updated</p>
                  <p className="text-slate-900">
                    {formatDate(quote.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* market data */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">market adjustment</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600">factor</p>
                  <p className="font-semibold text-slate-900">{quote.marketAdjustment.factor.toFixed(2)}x</p>
                </div>
                <div>
                  <p className="text-slate-600">reason</p>
                  <p className="text-slate-900">{quote.marketAdjustment.reason}</p>
                </div>
                <div>
                  <p className="text-slate-600">data source</p>
                  <p className="text-slate-900">{quote.marketAdjustment.dataSource}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}