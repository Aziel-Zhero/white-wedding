"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, CheckCircle } from "lucide-react";
import { AllGifts, type Gift as GiftType } from "@/lib/gifts-data";
import GiftDialog from "./gift-dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GiftsPageSection() {
  const [gifts, setGifts] = useState<GiftType[]>(AllGifts);

  const handleConfirmGift = (giftId: string, amount: number) => {
    setGifts(currentGifts => 
      currentGifts.map(gift => {
        if (gift.id === giftId) {
          const newContributedAmount = gift.contributedAmount + amount;
          return { 
            ...gift, 
            contributedAmount: Math.min(newContributedAmount, gift.totalPrice) 
          };
        }
        return gift;
      })
    );
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

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
          {gifts.map((gift) => {
            const progress = (gift.contributedAmount / gift.totalPrice) * 100;
            const remaining = gift.totalPrice - gift.contributedAmount;
            const isGifted = remaining <= 0;
            const isPartiallyGifted = gift.contributedAmount > 0 && !isGifted;

            return (
              <Card 
                key={gift.id} 
                className={cn(
                  "overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col",
                  isGifted && "opacity-60"
                )}
              >
                <div className="aspect-square relative">
                    {gift.image && (
                        <Image
                        src={gift.image.imageUrl}
                        alt={gift.name}
                        fill
                        className="object-cover"
                        data-ai-hint={gift.image.imageHint}
                        />
                    )}
                    {isGifted && (
                        <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center">
                            <div className="text-center text-secondary-foreground p-4 rounded-lg">
                               <CheckCircle className="h-12 w-12 mx-auto text-primary" />
                               <p className="font-bold text-xl mt-2 font-headline">Presenteado!</p>
                            </div>
                        </div>
                    )}
                    {isPartiallyGifted && (
                        <div className="absolute top-0 left-0 right-0 bg-primary/90 text-primary-foreground text-center py-1 font-bold text-sm animate-pulse">
                            Help, My Friend!
                        </div>
                    )}
                </div>
                <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-headline">{gift.name}</h3>
                  <p className="mt-2 text-muted-foreground text-sm flex-grow">{gift.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(gift.contributedAmount)} / {formatCurrency(gift.totalPrice)}
                      </span>
                       {isPartiallyGifted && (
                        <span className="text-xs font-bold text-primary animate-pulse">
                          Faltam {formatCurrency(remaining)}
                        </span>
                       )}
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <GiftDialog gift={gift} onConfirm={handleConfirmGift}>
                    <Button className="mt-4 w-full" disabled={isGifted}>
                      {isGifted ? "Obrigado!" : (isPartiallyGifted ? "Interar na vaquinha!" : "Presentear")}
                    </Button>
                  </GiftDialog>

                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
