'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// --- UnicornStudio Types ---
interface UnicornStudioScene {
  element: HTMLElement;
  destroy: () => void;
  contains?: (element: HTMLElement | null) => boolean;
}
interface UnicornStudioConfig {
  scale: number;
  dpi: number;
}
interface UnicornStudio {
  isInitialized: boolean;
  init: (config?: UnicornStudioConfig) => Promise<UnicornStudioScene[]>;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudio;
  }
}

// --- Custom Hook ---
const useUnicornStudio = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const version = '1.4.25';
    const scriptUrl = `https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v${version}/dist/unicornStudio.umd.js`;
    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    ) as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as any).UnicornStudio) {
        setIsLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setIsLoaded(true));
      }
      scriptRef.current = existingScript;
      return;
    }
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load UnicornStudio script');
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current && !existingScript) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);
  const unicornStudio = typeof window !== 'undefined'
    ? (window as any).UnicornStudio as UnicornStudio | undefined
    : undefined;
  return { isLoaded, UnicornStudio: unicornStudio };
};

// --- UnicornBackground Component ---
const UnicornBackground = () => {
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const sceneRef = useRef<UnicornStudioScene | null>(null);
  const { isLoaded, UnicornStudio } = useUnicornStudio();
  useEffect(() => {
    if (!isLoaded) return;
    const initializeScene = async () => {
      const container = document.querySelector('[data-us-project="Gr1LmwbKSeJOXhpYEdit"]');
      if (!container) {
        console.warn('No container found');
        return;
      }
      if (sceneRef.current?.destroy) {
        sceneRef.current.destroy();
      }
      try {
        const scenes = await UnicornStudio?.init({ scale: 1, dpi: 1.5 });
        if (scenes) {
          const ourScene = scenes.find(
            (scene) =>
              scene.element === container ||
              scene.element.contains(container)
          );
          if (ourScene) {
            sceneRef.current = ourScene;
            setTimeout(() => {
              setIsBackgroundVisible(true);
            }, 1000);
          }
        }
      } catch (err) {
        console.error('Failed to initialize UnicornStudio scene:', err);
        setTimeout(() => {
          setIsBackgroundVisible(true);
        }, 1000);
      }
    };
    void initializeScene();
    return () => {
      if (sceneRef.current?.destroy) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, [isLoaded]);
  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden -z-10" aria-hidden="true" tabIndex={-1}>
      <motion.div
        data-us-project="Gr1LmwbKSeJOXhpYEdit"
        className="absolute inset-0 w-full h-[calc(100vh+80px)] z-0"
        style={{ pointerEvents: 'none', willChange: 'opacity', transform: 'translateZ(0)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isBackgroundVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

// --- Hero Section ---
const Hero = () => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-6 md:px-12">
      <UnicornBackground />
      <h1 className="flex items-center justify-center gap-2 text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl">
        <i data-lucide="zap" className="w-10 h-10 text-indigo-400 animate-bounce" aria-hidden="true" ></i>
        تحليل ذكي لسيرتك الذاتية
      </h1>
      <p className="mt-6 max-w-xl text-3xl font-semibold md:text-base text-zinc-400">
        يحلل الذكاء الاصطناعي سيرتك الذاتية، يقيمها، ويعززها لتبرز بين المتقدمين لأي وظيفة.
      </p>
    </section>
  );
};

export default Hero;
