import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-couple');

  return (
    <section
      id="inicio"
      className="relative flex h-[calc(100vh-4rem)] min-h-[500px] items-center justify-center text-center text-white"
    >
      {heroImage && (
         <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center p-4 animate-fade-in-up">
        <h2 className="font-headline text-2xl md:text-3xl tracking-widest uppercase">
          Vamos nos casar!
        </h2>
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold my-4">
          Eduarda & Aziel
        </h1>
        <p className="text-xl md:text-2xl font-light">
          28 de Outubro de 2024
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="#rsvp">Confirmar Presença</Link>
        </Button>
      </div>
    </section>
  );
}
