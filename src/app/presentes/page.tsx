import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GiftsPageSection from '@/components/sections/gifts-page';
import GiftsInfoDialog from '@/components/sections/gifts-info-dialog';

export default function GiftsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <GiftsInfoDialog />
      <Header />
      <main className="flex-grow">
        <GiftsPageSection />
      </main>
      <Footer />
    </div>
  );
}
