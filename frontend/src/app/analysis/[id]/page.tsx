"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const AnalysisPage = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`http://localhost:5000/api/v1/resumes/${id}/analyze`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || 'حدث خطأ أثناء جلب التحليل');
        }
        const data = await res.json();
        setAnalysis(data.analysis || data);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء جلب التحليل');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center text-indigo-500 font-bold">جاري تحميل التحليل...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500 font-bold">{error}</div>;
  }

  if (!analysis) {
    return <div className="container mx-auto p-4 text-center">لم يتم العثور على نتيجة التحليل.</div>;
  }

  // Helper for fallback
  const renderList = (arr: any[], emptyMsg = 'لا يوجد') =>
    Array.isArray(arr) && arr.length > 0 ? (
      <ul className="list-disc pr-6 space-y-1 text-sm text-zinc-100">
        {arr.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <span className="text-zinc-400 text-sm">{emptyMsg}</span>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 ring-1 ring-white/30 rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">نتيجة تحليل السيرة الذاتية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-bold text-zinc-200">الدرجة العامة:</span>
            <span className="text-2xl font-extrabold text-indigo-400">{analysis.score ?? <span className='text-zinc-400 text-base'>لا يوجد</span>}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-bold text-zinc-200">درجة ATS:</span>
            <span className="text-2xl font-extrabold text-green-400">{analysis.atsScore ?? <span className='text-zinc-400 text-base'>لا يوجد</span>}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-bold text-zinc-200">اللغة:</span>
            <span className="text-indigo-300">{analysis.language ?? <span className='text-zinc-400'>لا يوجد</span>}</span>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-bold text-zinc-200">تطابق مع وصف الوظيفة:</span>
            <span className={analysis.matchedJobDescription ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
              {typeof analysis.matchedJobDescription === 'boolean'
                ? analysis.matchedJobDescription ? 'نعم' : 'لا'
                : <span className='text-zinc-400 font-normal'>لا يوجد</span>}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">الكلمات المفتاحية</h3>
          {renderList(analysis.keywords)}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">المهارات</h3>
          {renderList(analysis.skills)}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">الاقتراحات</h3>
          {renderList(analysis.suggestions)}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">تحسينات المحتوى</h3>
          {renderList(analysis.contentImprovements)}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-indigo-300 mb-2">نصائح ATS</h3>
          {renderList(analysis.atsTips)}
        </div>
        {/* Raw JSON for debugging (optional) */}
        <details className="mt-8">
          <summary className="cursor-pointer text-zinc-400 text-xs">عرض البيانات الكاملة (للمطورين)</summary>
          <div className="bg-zinc-900 p-4 rounded-md mt-2 overflow-x-auto">
            <pre className="text-zinc-100 text-xs whitespace-pre-wrap">{JSON.stringify(analysis, null, 2)}</pre>
          </div>
        </details>
      </div>
    </div>
  );
};

export default AnalysisPage;