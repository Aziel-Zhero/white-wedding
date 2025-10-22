"use client";

import { useState, type ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, PartyPopper } from "lucide-react";

const rsvpFormSchema = z.object({
  name: z.string().min(2, {
    message: "Por favor, insira seu nome completo.",
  }),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

export default function RsvpDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: RsvpFormValues) {
    console.log("RSVP data:", data);
    // Aqui você integraria com o backend para salvar a confirmação
    
    setIsConfirmed(true);

    toast({
        title: "Presença confirmada!",
        description: `${data.name}, sua presença foi registrada. Obrigado!`,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isConfirmed ? (
           <div className="text-center p-8">
             <PartyPopper className="h-16 w-16 mx-auto text-primary" />
             <DialogHeader>
                <DialogTitle className="text-2xl font-headline mt-4">Tudo Certo!</DialogTitle>
                <DialogDescription className="mt-2 text-base">
                    Sua presença foi confirmada com sucesso. Mal podemos esperar para celebrar com você!
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
                Confirmar Presença
              </DialogTitle>
              <DialogDescription>
                Ficaremos felizes com a sua presença! Por favor, confirme até 16
                de Abril de 2026.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" size="lg">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar
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
