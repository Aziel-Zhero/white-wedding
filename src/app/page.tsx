import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import DetailsSection from '@/components/sections/details';
import LocationSection from '@/components/sections/location';
import GiftsSection from '@/components/sections/gifts';
import SurpriseDialog from '@/components/sections/surprise-dialog';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SurpriseDialog />
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DetailsSection />
        <LocationSection />
        <GiftsSection />
      </main>
      <Footer />
    </div>
  );
}
