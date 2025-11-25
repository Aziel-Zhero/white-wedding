import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import RsvpDialog from "./rsvp-dialog";
import { CalendarPlus } from "lucide-react";

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-couple');
  
  // Event details for Google Calendar
  const event = {
    title: "Casamento de Eduarda & Aziel",
    startDate: "20260516T183000Z", // 15:30 in São Paulo (UTC-3)
    endDate: "20260517T013000Z",   // 22:30 in São Paulo (UTC-3)
    details: "Estamos nos casando! Junte-se a nós para celebrar nosso amor. Mais detalhes em nosso site.",
    location: "Chácara Sonho Verde, Estrada Municipal Jorge Emilio Vieira, S/N - Cruz Pequena, Caçapava - SP"
  };

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;


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
        <h2 className="font-headline text-xl md:text-3xl tracking-widest uppercase">
          Vamos nos casar!
        </h2>
        <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold my-4">
          Eduarda & Aziel
        </h1>
        <p className="text-lg md:text-2xl font-light">
          16 de Maio de 2026
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg">
            <Link href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="mr-2" />
              Save the Date
            </Link>
          </Button>
          <RsvpDialog>
            <Button size="lg" variant="secondary">
              Confirmar Presença
            </Button>
          </RsvpDialog>
        </div>
      </div>
    </section>
  );
}
