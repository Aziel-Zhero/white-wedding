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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, PartyPopper } from "lucide-react";

const rsvpFormSchema = z.object({
  name: z.string({
    required_error: "Por favor, selecione seu nome.",
  }),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

const guestList = [
  "Thaina e Jeferson",
  "Gustavo",
  "Dona Bia e Sr Antonio",
  "Cleiton e Camile",
];

export default function RsvpDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
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
      <DialogContent className="w-[90%] max-w-md rounded-lg">
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
                      <FormLabel>Seu nome</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu nome da lista" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {guestList.map((guest) => (
                            <SelectItem key={guest} value={guest}>
                              {guest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
