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
import { PartyPopper } from "lucide-react";
import { Button } from "../ui/button";

export default function SurpriseDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("surpriseShown");

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("surpriseShown", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Reset for next time if they close it before revealing
    setTimeout(() => setIsRevealed(false), 300);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="w-[90%] max-w-sm rounded-lg text-center">
        <AlertDialogHeader className="items-center">
            <PartyPopper className="h-14 w-14 text-primary animate-bounce" />
          <AlertDialogTitle className="font-headline text-3xl mt-4">Surpresa!</AlertDialogTitle>
          {isRevealed ? (
             <AlertDialogDescription className="text-base mt-2 px-4">
                A sua surpresa é... <br/>
                <strong>Ops!</strong> A maior surpresa será ter você celebrando com a gente!
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription className="text-base mt-2 px-4">
                Temos uma surpresa especial para você...
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
            {!isRevealed ? (
                <Button onClick={() => setIsRevealed(true)}>
                    Descobrir
                </Button>
            ) : (
                <AlertDialogAction onClick={handleClose}>
                    Haha, entendi!
                </AlertDialogAction>
            )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
