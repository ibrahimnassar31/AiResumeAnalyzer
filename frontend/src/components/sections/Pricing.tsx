'use client'
import { useEffect, useRef } from 'react';

const plans = [
  {
    name: 'المبتدئ',
    price: '0$',
    features: [
      'تحليل واحد للسيرة الذاتية',
      'فحص كلمات مفتاحية أساسي',
      'تقرير عبر البريد الإلكتروني',
    ],
    cta: 'ابدأ الآن',
    ctaLabel: 'ابدأ الآن',
    border: 'border-indigo-500',
    bg: 'bg-zinc-900/40',
    highlight: false,
    delay: 'delay-100',
    aria: 'ابدأ الآن',
  },
  {
    name: 'المحترف',
    price: '29$',
    features: [
      'تحليلات غير محدودة',
      'اقتراحات إعادة صياغة بالذكاء الاصطناعي',
      'تحديثات تقييم فورية',
    ],
    cta: 'طور الآن',
    ctaLabel: 'طور الآن',
    border: 'border-zinc-800',
    bg: 'bg-zinc-900/40',
    highlight: false,
    delay: 'delay-300',
    aria: 'طور الآن',
  },
  {
    name: 'الشركات',
    price: 'مخصص',
    features: [
      'لوحات تحكم للفريق',
      'وصول API',
      'مدير نجاح مخصص',
    ],
    cta: 'تواصل مع المبيعات',
    ctaLabel: 'تواصل مع المبيعات',
    border: 'border-zinc-800',
    bg: 'bg-zinc-900/40',
    highlight: false,
    delay: 'delay-300',
    aria: 'تواصل مع المبيعات',
  },
];

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealEls = sectionRef.current?.querySelectorAll('.reveal');
    if (!revealEls) return;
    const timeout = setTimeout(() => {
      revealEls.forEach((el) => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-8');
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="pricing" className="relative z-10 px-6 md:px-12" dir="rtl">
      <h2
        className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-semibold tracking-tight text-center mb-12 opacity-0 translate-y-8 transition-all duration-700 reveal"
        tabIndex={0}
        aria-label="الأسعار"
      >
        <i
          data-lucide="badge-dollar-sign"
          className="w-8 h-8 text-indigo-400"
          aria-hidden="true"
          tabIndex={-1}
        ></i>
        الأسعار
      </h2>
      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
        ref={sectionRef}
      >
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`border ${plan.border} ${plan.bg} rounded-xl p-8 transition-colors opacity-0 translate-y-8 transition-all duration-700 ${plan.delay} reveal focus-within:ring-2 focus-within:ring-indigo-400`}
            tabIndex={0}
            aria-label={`خطة ${plan.name}`}
            role="region"
          >
            <h3 className="font-medium mb-4 text-xl text-zinc-100">{plan.name}</h3>
            <p className="text-3xl font-semibold tracking-tight mb-4 text-zinc-50">{plan.price}</p>
            <ul className="space-y-2 text-sm text-zinc-400 mb-6 text-right">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <a
              href="#"
              className="block text-center px-6 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-colors text-sm font-medium text-white shadow-md"
              tabIndex={0}
              aria-label={plan.aria}
            >
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
