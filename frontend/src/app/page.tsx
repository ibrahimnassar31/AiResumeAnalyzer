
import Hero from '@/components/sections/Hero';
import UploadSection from '@/components/sections/UploadSection';
import Features from '@/components/sections/Features';
import SampleReport from '@/components/sections/SampleReport';
import Pricing from '@/components/sections/Pricing';
import Reviews from '@/components/sections/Reviews';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <main>
          <Hero />
          <UploadSection />
          <Features />
          <SampleReport />
          <Pricing />
          <Reviews />
        </main>
      </ProtectedRoute>
    </>
  );
}
