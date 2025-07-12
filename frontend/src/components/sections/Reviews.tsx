'use client';
import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const reviews = [
  {
    name: 'خالد العتيبي',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'خدمة رائعة! حسّنت سيرتي الذاتية وحصلت على مقابلة خلال أسبوع.',
  },
  {
    name: 'سارة منصور',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'الذكاء الاصطناعي دقيق وسهل الاستخدام. أنصح به للجميع!',
  },
  {
    name: 'محمد الزهراني',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    text: 'وفرت علي الكثير من الوقت في كتابة السيرة الذاتية.',
  },
  {
    name: 'ريم الحربي',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'واجهة جميلة وسهلة، والنتائج ممتازة.',
  },
  {
    name: 'عبدالله الشمري',
    img: 'https://randomuser.me/api/portraits/men/12.jpg',
    text: 'أنصح به لأي شخص يبحث عن وظيفة بسرعة.',
  },
  {
    name: 'أمل الدوسري',
    img: 'https://randomuser.me/api/portraits/women/23.jpg',
    text: 'الدعم الفني سريع ومتعاون جداً.',
  },
  {
    name: 'سامي المطيري',
    img: 'https://randomuser.me/api/portraits/men/77.jpg',
    text: 'أحببت ميزة إعادة الصياغة الذكية كثيراً.',
  },
  {
    name: 'نورة العبدالله',
    img: 'https://randomuser.me/api/portraits/women/31.jpg',
    text: 'تجربة استخدام سلسة ونتائج دقيقة.',
  },
  {
    name: 'فيصل العنزي',
    img: 'https://randomuser.me/api/portraits/men/53.jpg',
    text: 'أفضل أداة للسيرة الذاتية جربتها حتى الآن.',
  },
  {
    name: 'جواهر السبيعي',
    img: 'https://randomuser.me/api/portraits/women/81.jpg',
    text: 'أنصح بها كل من يريد تطوير سيرته الذاتية.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

const Reviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Enable horizontal scroll with mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <div className="relative z-10 border-t border-zinc-800 my-16 mx-6 md:mx-12" />
      <section id="user-reviews" className="relative z-10 px-6 md:px-12 py-20" dir="rtl">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-semibold tracking-tight mb-8">
          <i data-lucide="users" className="w-8 h-8 text-indigo-400" aria-hidden="true" tabIndex={-1}></i>
          آراء المستخدمين
        </h2>
        <div
          id="reviews-scroll"
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
          tabIndex={0}
          aria-label="تصفح آراء المستخدمين"
          ref={scrollRef}
        >
          {reviews.map((review, i) => {
            // Framer Motion in-view for each card
            const cardRef = useRef<HTMLDivElement>(null);
            const inView = useInView(cardRef, { margin: '-20% 0px -20% 0px', once: true });
            const controls = useAnimation();
            useEffect(() => {
              if (inView) controls.start('visible');
            }, [inView, controls]);
            return (
              <motion.div
                key={review.name}
                ref={cardRef}
                className="min-w-[320px] max-w-xs bg-white/10 backdrop-blur-2xl border border-white/20 ring-1 ring-white/30 rounded-3xl shadow-2xl p-6 flex flex-col items-center snap-start focus-within:ring-2 focus-within:ring-indigo-400"
                tabIndex={0}
                aria-label="مراجعة مستخدم"
                initial="hidden"
                animate={controls}
                variants={cardVariants}
                custom={i}
                role="article"
              >
                <img
                  src={review.img}
                  alt="صورة المستخدم"
                  className="w-16 h-16 rounded-full mb-3"
                  loading="lazy"
                  draggable={false}
                />
                <div className="font-bold mb-1">{review.name}</div>
                <div className="text-zinc-400 text-sm text-center">{review.text}</div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Reviews;
