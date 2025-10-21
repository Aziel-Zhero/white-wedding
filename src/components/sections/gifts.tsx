import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const gifts = [
  {
    name: "Cotas para a Lua de Mel",
    description: "Ajude-nos a ter uma viagem inesquecível!",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gifts-honeymoon'),
  },
  {
    name: "Jogo de Panelas",
    description: "Para prepararmos jantares deliciosos.",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gifts-cookware'),
  },
  {
    name: "Eletrodomésticos",
    description: "Itens para equipar nossa futura casa.",
    link: "#",
    image: PlaceHolderImages.find(p => p.id === 'gifts-appliances'),
  },
];

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
            Sua presença é o nosso maior presente, mas se desejar nos presentear,
            aqui estão algumas sugestões.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gifts.map((gift) => (
            <Card key={gift.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {gift.image && (
                <div className="aspect-video relative">
                    <Image
                      src={gift.image.imageUrl}
                      alt={gift.description}
                      fill
                      className="object-cover"
                      data-ai-hint={gift.image.imageHint}
                    />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold font-headline">{gift.name}</h3>
                <p className="mt-2 text-muted-foreground">{gift.description}</p>
                <Button asChild className="mt-4 w-full">
                  <Link href={gift.link}>Ver Opções</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
         <div id="rsvp" className="text-center mt-20">
            <h3 className="font-headline text-3xl font-bold">Confirme sua Presença</h3>
            <p className="mt-2 text-muted-foreground">Por favor, confirme sua presença até 28 de Setembro de 2024.</p>
            <Button size="lg" className="mt-6 animate-pulse">
                <Link href="#">RSVP</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
