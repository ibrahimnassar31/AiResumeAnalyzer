'use client';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AI_MODELS = [
  '✨ GPT-4o Mini (موصى به - توازن مثالي)',
  'GPT-3.5 Turbo (أسرع - أقل دقة)',
  'GPT-4 (أعلى دقة - أبطأ)',
];

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiModel, setAiModel] = useState(AI_MODELS[0]);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auth state
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      if (file) setError('يرجى رفع ملف PDF أو Word فقط.');
    }
  };

  const handleChooseFile = () => inputRef.current?.click();

  const handleUpload = async () => {
    setError(null);
    setUploadResult(null);
    setAnalysisResult(null);
    // Validate required fields
    if (!user || !token) {
      toast.error('يجب تسجيل الدخول أولاً.', { icon: '🔒', duration: 5000 });
      setError('يجب تسجيل الدخول أولاً.');
      return;
    }
    if (!selectedFile) {
      toast.error('يرجى اختيار ملف السيرة الذاتية.', { icon: '📄', duration: 5000 });
      setError('يرجى اختيار ملف السيرة الذاتية.');
      return;
    }
    if (!email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني.', { icon: '✉️', duration: 5000 });
      setError('يرجى إدخال البريد الإلكتروني.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح.', { icon: '✉️', duration: 5000 });
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (!fullName.trim()) {
      toast.error('يرجى إدخال الاسم الكامل.', { icon: '🧑', duration: 5000 });
      setError('يرجى إدخال الاسم الكامل.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('الحد الأقصى لحجم الملف هو 10 ميجابايت.', { icon: '⚠️', duration: 5000 });
      setError('الحد الأقصى لحجم الملف هو 10 ميجابايت.');
      return;
    }
    setLoading(true);
    try {
      // 1. Upload resume
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('aiModel', aiModel);
      formData.append('email', email);
      formData.append('fullName', fullName);
      if (jobDesc) formData.append('jobDesc', jobDesc);
      const uploadRes = await fetch('http://localhost:5000/api/v1/resumes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        const msg = data.message || data.error || 'فشل رفع السيرة الذاتية';
        // Custom toast for validation errors
        if (msg.includes('fullName') || msg.includes('email')) {
          toast.error('يرجى إدخال الاسم الكامل والبريد الإلكتروني بشكل صحيح.', {
            description: 'تأكد من تعبئة جميع الحقول المطلوبة.',
            icon: '⚠️',
            duration: 5000,
          });
        } else {
          toast.error(msg, { icon: '❌', duration: 5000 });
        }
        setError(msg);
        setLoading(false);
        return;
      }
      const uploadData = await uploadRes.json();
      // Redirect to analysis page
      const resumeId = uploadData.resume?._id || uploadData.resume?.id || uploadData.resume?.resumeId || uploadData.id;
      if (!resumeId) throw new Error('لم يتم العثور على معرف السيرة الذاتية بعد الرفع');
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setJobDesc('');
      setAiModel(AI_MODELS[0]);
      setEmail('');
      setFullName('');
      router.push(`/analysis/${resumeId}`);
    } catch (err: any) {
      const msg = err.message || 'حدث خطأ أثناء رفع السيرة الذاتية';
      if (msg.includes('fullName') || msg.includes('email')) {
        toast.error('يرجى إدخال الاسم الكامل والبريد الإلكتروني بشكل صحيح.', {
          description: 'تأكد من تعبئة جميع الحقول المطلوبة.',
          icon: '⚠️',
          duration: 5000,
        });
      } else {
        toast.error(msg, { icon: '❌', duration: 5000 });
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
    setJobDesc('');
    setAiModel(AI_MODELS[0]);
    setError(null);
    setUploadResult(null);
    setAnalysisResult(null);
    setLoading(false);
  };

  return (
    <section className="relative z-10 py-20 px-8 md:px-0">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-stretch">
        {/* Upload Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/20 ring-1 ring-white/30 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 text-right">
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-2xl font-bold text-zinc-100">
              <i data-lucide="upload" className="w-7 h-7 text-indigo-400" aria-hidden="true"></i>
              رفع السيرة الذاتية
            </span>
            <button type="button" aria-label="تحديث" className="text-zinc-400 hover:text-indigo-400 transition-colors" onClick={handleRefresh} tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleRefresh()}>
              <i data-lucide="refresh-ccw" className="w-5 h-5" aria-hidden="true"></i>
            </button>
          </div>
          <div className="mb-2">
            <label htmlFor="resume-upload" className="block font-bold mb-2 text-zinc-200">اختر ملف السيرة الذاتية</label>
            <div className="flex items-center gap-3">
              <input
                id="resume-upload"
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
                aria-label="رفع السيرة الذاتية"
              />
              <button
                type="button"
                onClick={handleChooseFile}
                className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded-md font-medium text-sm focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/60 transition shadow"
                aria-label="اختيار ملف"
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleChooseFile()}
              >
                <i data-lucide="file" className="w-5 h-5" aria-hidden="true"></i>
                اختيار ملف
              </button>
              <span id="resume-filename" className="text-zinc-300 text-sm">
                {selectedFile ? selectedFile.name : 'لم يتم اختيار أي ملف'}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="full-name" className="block font-bold mb-2 text-zinc-200">الاسم الكامل <span className="text-red-500">*</span></label>
            <input
              id="full-name"
              type="text"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="أدخل اسمك الكامل"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              aria-label="الاسم الكامل"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-bold mb-2 text-zinc-200">البريد الإلكتروني <span className="text-red-500">*</span></label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="البريد الإلكتروني"
              required
            />
          </div>
          <div>
            <label htmlFor="ai-model" className="block font-bold mb-2 text-zinc-200">نموذج الذكاء الاصطناعي</label>
            <select
              id="ai-model"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={aiModel}
              onChange={e => setAiModel(e.target.value)}
              aria-label="اختيار نموذج الذكاء الاصطناعي"
            >
              {AI_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="job-desc" className="block font-bold mb-2 text-zinc-200">وصف الوظيفة (اختياري)</label>
            <textarea
              id="job-desc"
              rows={3}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="الصق وصف الوظيفة هنا..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              aria-label="وصف الوظيفة"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-bold mt-2" role="alert">{error}</div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold mt-2">
              <span className="inline-block w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-label="جاري التحميل" />
              جاري رفع وتحليل السيرة الذاتية...
            </div>
          )}
          <button
            className="mt-2 flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-lg font-bold text-lg transition focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/60 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="رفع وتحليل"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleUpload()}
          >
            <i data-lucide="arrow-up-circle" className="w-6 h-6" aria-hidden="true"></i>
            رفع وتحليل
          </button>
        </div>
        {/* How It Works Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/20 ring-1 ring-white/30 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 text-right">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-zinc-100 mb-4">
            <i data-lucide="info" className="w-7 h-7 text-indigo-400" aria-hidden="true"></i>
            كيف تعمل الخدمة
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-zinc-800/60 rounded-lg p-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-700 text-white font-bold text-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16V4m0 0l-4 4m4-4l4 4M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
                </svg>
              </span>
              <div>
                <div className="font-bold text-indigo-400 mb-1 flex items-center gap-2">
                  رفع السيرة الذاتية
                </div>
                <div className="text-zinc-300 text-sm">ارفع سيرتك الذاتية بصيغة PDF أو DOCX. الحد الأقصى للحجم 10 ميجابايت.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-zinc-800/60 rounded-lg p-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-700 text-white font-bold text-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="14 2 14 8 20 8"/>
                  <line strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="13" x2="8" y2="13"/>
                  <line strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="17" x2="8" y2="17"/>
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="10 9 9 9 8 9"/>
                </svg>
              </span>
              <div>
                <div className="font-bold text-indigo-400 mb-1">إضافة وصف الوظيفة (اختياري)</div>
                <div className="text-zinc-300 text-sm">الصق وصف الوظيفة لتحصل على تحليل وتوصيات مخصصة.</div>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-zinc-800/60 rounded-lg p-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-700 text-white font-bold text-lg shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
              <div>
                <div className="font-bold text-indigo-400 mb-1">تحليل فوري</div>
                <div className="text-zinc-300 text-sm">سيقوم الذكاء الاصطناعي بتحليل سيرتك الذاتية وتقديم ملاحظات حول:</div>
                <ul className="list-disc list-inside text-zinc-400 mt-2 pr-4 text-sm">
                  <li>تحسينات في المحتوى والتنسيق</li>
                  <li>المهارات والمؤهلات الأساسية</li>
                  <li>اقتراحات تحسين ATS</li>
                  <li>مدى توافق السيرة مع وصف الوظيفة (إن وجد)</li>
                  <li>مطابقة الكلمات والمتطلبات (إن وجد وصف الوظيفة)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
