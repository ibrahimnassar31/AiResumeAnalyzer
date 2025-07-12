'use client';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
    ),
    title: 'تحليل ذكي للسيرة الذاتية',
    desc: 'يستخدم الذكاء الاصطناعي لتحليل سيرتك الذاتية واكتشاف نقاط القوة والضعف واقتراح التحسينات.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0 0v4m0-4h4m-4 0H5" /></svg>
    ),
    title: 'توصيات مخصصة للوظيفة',
    desc: 'احصل على نصائح وتوصيات مخصصة بناءً على وصف الوظيفة المستهدف.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 7l10 6 10-6" /></svg>
    ),
    title: 'توافق مع أنظمة ATS',
    desc: 'تحليل مدى توافق سيرتك الذاتية مع أنظمة تتبع المتقدمين (ATS) لزيادة فرصك في القبول.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
    ),
    title: 'تقييم فوري وسريع',
    desc: 'احصل على تقييم شامل لسيرتك الذاتية في ثوانٍ معدودة دون انتظار.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a5 5 0 00-2 4v5a2 2 0 002 2h10a2 2 0 002-2v-5a5 5 0 00-2-4z" /></svg>
    ),
    title: 'حماية وخصوصية البيانات',
    desc: 'جميع بياناتك وملفاتك مشفرة وآمنة ولا يتم مشاركتها مع أي طرف ثالث.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
    ),
    title: 'واجهة سهلة وسريعة',
    desc: 'واجهة استخدام عصرية وسهلة تتيح لك رفع وتحليل سيرتك الذاتية بسرعة وسلاسة.'
  }
];

const Features = () => (
  <section className="relative py-20 px-4 md:px-0 bg-transparent">
    <div className="max-w-5xl mx-auto text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-100">مميزات الخدمة</h2>
      <p className="text-zinc-400 max-w-2xl mx-auto">اكتشف كيف تساعدك منصتنا في تحسين سيرتك الذاتية وزيادة فرصك في الحصول على الوظيفة المثالية.</p>
    </div>
    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {FEATURES.map((feature, idx) => (
        <motion.div
          key={feature.title}
          className="flex flex-col items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-8 h-full text-center transition-transform hover:scale-105"
          whileHover="hover"
        >
          <motion.div
            className="mb-4"
            variants={{
              initial: { x: 0 },
              hover: { x: 12 },
            }}
            initial="initial"
            whileHover="hover"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-xl font-bold text-zinc-100 mb-2">{feature.title}</h3>
          <p className="text-zinc-400 text-sm">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Features;
