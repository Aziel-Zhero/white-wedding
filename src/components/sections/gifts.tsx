import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import RsvpDialog from "./rsvp-dialog";

export default function GiftsSection() {
  return (
    <section id="presentes" className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Gift className="h-12 w-12 mx-auto text-primary" />
          <h2 className="font-headline text-4xl lg:text-5xl font-bold mt-4">
            Lista de Presentes
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sua presença é o nosso maior presente, mas se desejar nos presentear, preparamos uma lista com carinho.
          </p>
           <Button asChild size="lg" className="mt-8">
              <Link href="/presentes">Ver Lista de Presentes</Link>
            </Button>
        </div>
         <div id="rsvp" className="text-center mt-20">
            <h3 className="font-headline text-3xl font-bold">Confirme sua Presença</h3>
            <p className="mt-2 text-muted-foreground">Por favor, confirme sua presença até 16 de Abril de 2026.</p>
            <RsvpDialog>
              <Button size="lg" className="mt-6 animate-pulse">
                  RSVP
              </Button>
            </RsvpDialog>
        </div>
      </div>
    </section>
  );
}
