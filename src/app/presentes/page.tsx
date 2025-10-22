import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GiftsPageSection from '@/components/sections/gifts-page';

export default function GiftsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <GiftsPageSection />
      </main>
      <Footer />
    </div>
  );
}
