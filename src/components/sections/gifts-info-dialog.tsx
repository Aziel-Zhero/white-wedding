"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info, MessageSquareHeart, CreditCard, Users } from "lucide-react";
import { Button } from "../ui/button";

export default function GiftsInfoDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // We only want to run this effect on the client
    if (typeof window !== 'undefined') {
      const hasBeenShown = sessionStorage.getItem("giftsInfoShown");

      if (!hasBeenShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("giftsInfoShown", "true");
        }, 1000); // Small delay to not be too intrusive

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };
  
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="w-[95%] max-w-lg rounded-lg">
        <AlertDialogHeader>
            <div className="flex justify-center mb-4">
                <Info className="h-14 w-14 text-primary" />
            </div>
          <AlertDialogTitle className="font-headline text-2xl text-center">Como Funciona o Presente?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-base text-muted-foreground mt-4 space-y-4 text-left">
                <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-foreground">Vaquinha Virtual</h4>
                        <p>Você pode nos presentear com o item completo ou contribuir com qualquer valor para nos ajudar a comprá-lo. Caso contribua com uma parte, o restante ficará disponível para que outras pessoas também possam nos ajudar. Ficaremos felizes de toda maneira!</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 text-primary flex-shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m16 8-4 4-4-4"></path><path d="m12 16 4-4"></path></svg>
                    <div>
                        <h4 className="font-semibold text-foreground">Pagamento via PIX</h4>
                        <p>As contribuições são feitas via PIX diretamente para nós. É a melhor forma, pois é rápido, seguro e não tem taxas para ninguém!</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-foreground">Prefere Cartão de Crédito?</h4>
                        <p>Caso prefira usar o cartão de crédito, por favor, nos envie uma mensagem para que possamos te orientar da melhor forma.</p>
                    </div>
                </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
            <AlertDialogAction onClick={handleClose} className="w-full">
                Entendido!
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
