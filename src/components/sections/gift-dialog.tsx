"use client";

import { useState, type ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, PartyPopper, Upload, ClipboardCopy } from "lucide-react";
import type { Gift } from "@/lib/gifts-data";

const giftFormSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Por favor, insira um valor.",
      invalid_type_error: "Por favor, insira um número válido.",
    })
    .positive("O valor deve ser maior que zero."),
  proof: z.any().optional(),
});

type GiftFormValues = z.infer<typeof giftFormSchema>;

// --- Mock Data ---
const pixKey = "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6";
const qrCodeImage = "https://picsum.photos/seed/qrcode/300/300";
// -----------------

export default function GiftDialog({ gift }: { gift: Gift }) {
  const [open, setOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
  });

  function onSubmit(data: GiftFormValues) {
    console.log("Gifting data (placeholder):", {
        giftName: gift.name,
        ...data
    });
    
    setIsConfirmed(true);

    toast({
        title: "Contribuição enviada!",
        description: `Obrigado por presentear com R$ ${data.amount.toFixed(2)} para "${gift.name}"!`,
        duration: 5000,
    });
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset state when closing
        setTimeout(() => {
            setIsConfirmed(false);
            form.reset();
        }, 300);
    }
  }

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
        title: "Chave PIX copiada!",
        description: "Você pode colar no seu aplicativo de banco.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full">Presentear</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isConfirmed ? (
           <div className="text-center p-8">
             <PartyPopper className="h-16 w-16 mx-auto text-primary" />
             <DialogHeader>
                <DialogTitle className="text-2xl font-headline mt-4">Muito Obrigado!</DialogTitle>
                <DialogDescription className="mt-2 text-base">
                    Seu presente nos enche de alegria. Mal podemos esperar para celebrar com você!
                </DialogDescription>
             </DialogHeader>
             <Button onClick={() => handleOpenChange(false)} className="mt-6">
                Fechar
             </Button>
           </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">
                Presentear: {gift.name}
              </DialogTitle>
              <DialogDescription>
                Contribua com qualquer valor para este presente.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 text-center">
                <div className="relative w-48 h-48 mx-auto border-4 border-primary rounded-lg overflow-hidden">
                    <Image src={qrCodeImage} alt="QR Code PIX" layout="fill" objectFit="cover" />
                </div>
                <p className="text-sm text-muted-foreground">Escaneie o QR Code acima ou copie a chave.</p>
                <div className="flex items-center justify-center p-3 bg-secondary rounded-md">
                    <code className="text-sm text-secondary-foreground break-all">{pixKey}</code>
                    <Button variant="ghost" size="icon" className="ml-2 h-8 w-8" onClick={copyPixKey}>
                        <ClipboardCopy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Contribuição (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 50,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="proof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprovante (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="file" {...form.register('proof')} />
                      </FormControl>
                      <FormDescription>
                        Anexe o comprovante do PIX (print ou PDF).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" size="lg" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar Contribuição
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
