'use client';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="relative z-10 px-6 md:px-12 pb-12 text-sm text-zinc-400" dir="rtl">
      <div className="flex flex-col md:flex-row-reverse justify-between gap-6 max-w-6xl mx-auto">
        <div>
          <p className="flex items-center gap-2 font-medium text-zinc-100 mb-2">
            <i data-lucide="mail" className="w-5 h-5 text-indigo-400" aria-hidden="true" tabIndex={-1}></i>
            ibrahimAi
          </p>
          <p>&copy; <span>{year}</span> — جميع الحقوق محفوظة.</p>
        </div>
        <div className="flex justify-center items-center gap-6">
          <a href="#" className="hover:text-indigo-400 transition-colors" tabIndex={0} aria-label="الخصوصية">الخصوصية</a>
          <a href="#" className="hover:text-indigo-400 transition-colors" tabIndex={0} aria-label="الشروط">الشروط</a>
          <a href="mailto:hello@resumeai.dev" className="hover:text-indigo-400 transition-colors flex items-center" tabIndex={0} aria-label="راسلنا">
            <i data-lucide="mail" className="w-4 h-4 text-indigo-400 mr-1" aria-hidden="true" tabIndex={-1}></i>
            راسلنا
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
