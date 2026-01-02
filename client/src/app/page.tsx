"use client";

import React, { useEffect } from "react";
import { useGetQuotesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { Upload, FileText, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getQuoteStatusColor, getQuoteStatusLabel } from "@/utils/helper";
import type { QuotationResult } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { data: response, isLoading } = useGetQuotesQuery({ limit: 5 });
  const quotations = response?.data || [];
  const pagination = response?.pagination;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              manufacturing quotation ai
            </h1>
            <p className="text-slate-600 mt-1">
              automated quotation generation system
            </p>
          </div>
        </div>
      </header>

      {/* main content */}
      <main className="container-custom py-12">
        {/* quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/upload">
            <div className="card cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">upload drawing</h3>
                  <p className="text-sm text-slate-600">start new quotation</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {pagination?.total || 0}
                </h3>
                <p className="text-sm text-slate-600">total quotes</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {quotations.filter((q) => q.status === "generated").length}
                </h3>
                <p className="text-sm text-slate-600">processing</p>
              </div>
            </div>
          </div>

          <Link href="/quotes">
            <div className="card cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">view all</h3>
                  <p className="text-sm text-slate-600">all quotations</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* recent quotes */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            recent quotes
          </h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600">loading quotes...</p>
            </div>
          ) : quotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      quote id
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      final price
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quote: QuotationResult) => (
                    <tr
                      key={quote.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/quotes/${quote.id}`)}
                    >
                      <td className="py-3 px-4 text-slate-900 font-mono text-sm">
                        {quote.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getQuoteStatusColor(quote.status)}`}>
                          {getQuoteStatusLabel(quote.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">
                        {formatCurrency(quote.finalPrice, quote.currency)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {quote.confidenceScore.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">no quotes yet</p>
              <Link href="/upload">
                <button className="btn-primary mt-4">create first quote</button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}