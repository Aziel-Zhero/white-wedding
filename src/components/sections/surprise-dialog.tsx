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

export default function SurpriseDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the dialog has been shown before
    const hasBeenShown = sessionStorage.getItem("surpriseShown");

    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("surpriseShown", "true");
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[90%] max-w-sm rounded-lg text-center">
        <AlertDialogHeader className="items-center">
            <PartyPopper className="h-14 w-14 text-primary animate-bounce" />
          <AlertDialogTitle className="font-headline text-3xl mt-4">Surpresa!</AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-2 px-4">
            A sua surpresa é... <br/>
            <strong>Ops!</strong> A maior surpresa será ter você celebrando com a gente!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={handleClose}>
            Haha, entendi!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
