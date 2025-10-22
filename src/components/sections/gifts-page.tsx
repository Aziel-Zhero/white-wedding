import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { AllGifts } from "@/lib/gifts-data";
import GiftDialog from "./gift-dialog";

export default function GiftsPageSection() {
  return (
    <section id="presentes-loja" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Gift className="h-12 w-12 mx-auto text-primary" />
          <h2 className="font-headline text-4xl lg:text-5xl font-bold mt-4">
            Lista de Presentes
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sua presença é o nosso maior presente, mas se desejar nos presentear,
            aqui estão algumas sugestões com muito carinho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {AllGifts.map((gift) => (
            <Card key={gift.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {gift.image && (
                <div className="aspect-square relative">
                    <Image
                      src={gift.image.imageUrl}
                      alt={gift.name}
                      fill
                      className="object-cover"
                      data-ai-hint={gift.image.imageHint}
                    />
                </div>
              )}
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-headline">{gift.name}</h3>
                <p className="mt-2 text-muted-foreground flex-grow">{gift.description}</p>
                 <p className="text-2xl font-bold text-primary mt-4">{gift.price}</p>
                <GiftDialog gift={gift} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
