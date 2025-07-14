"use client";

import React from "react";

const AnalysisDetailLoading = () => (
  <main className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <span
        className="inline-block w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
        aria-label="جاري التحميل"
      />
      <p className="text-lg text-zinc-300 font-medium">جاري تحميل تقرير التحليل...</p>
    </div>
  </main>
);

export default AnalysisDetailLoading;
