

"use client";

import { useState, type ReactNode, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { coupleId } from "@/lib/couple-data";

const rsvpFormSchema = z.object({
  name: z.string({
    required_error: "Por favor, selecione seu nome.",
  }),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

type Guest = {
  id: string;
  name: string;
}

type Rsvp = {
  id: string;
  guestName: string;
}


export default function RsvpDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const guestsRef = useMemoFirebase(() => firestore ? collection(firestore, 'couples', coupleId, 'guests') : null, [firestore]);
  const rsvpsRef = useMemoFirebase(() => firestore ? collection(firestore, 'couples', coupleId, 'rsvps') : null, [firestore]);

  const { data: guests, isLoading: isLoadingGuests } = useCollection<Guest>(guestsRef);
  const { data: rsvps, isLoading: isLoadingRsvps } = useCollection<Rsvp>(rsvpsRef);

  const availableGuests = useMemo(() => {
    if (!guests || !rsvps) {
      return guests || [];
    }
    const confirmedGuestNames = new Set(rsvps.map(r => r.guestName));
    return guests.filter(g => !confirmedGuestNames.has(g.name));
  }, [guests, rsvps]);
  
  const guestList = availableGuests ? availableGuests.map(g => g.name) : [];
  const isLoading = isLoadingGuests || isLoadingRsvps;


  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
  });

  async function onSubmit(data: RsvpFormValues) {
    if (!firestore) return;
    const rsvpsCollectionRef = collection(firestore, "couples", coupleId, "rsvps");
    
    // Prevent duplicate RSVPs
    const q = query(rsvpsCollectionRef, where("guestName", "==", data.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        toast({
            variant: "destructive",
            title: "Presença já confirmada",
            description: "Você já confirmou sua presença anteriormente.",
        });
        return;
    }

    addDoc(rsvpsCollectionRef, {
      guestName: data.name,
      confirmedAt: new Date(),
    });

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
      <DialogContent className="w-[90%] max-w-md rounded-lg p-0">
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
          <ScrollArea className="max-h-[80vh] sm:max-h-auto">
            <div className="p-6">
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu nome</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione seu nome da lista"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-72">
                               {guestList.length > 0 ? (
                                guestList.map((guest) => (
                                  <SelectItem key={guest} value={guest}>
                                    {guest}
                                  </SelectItem>
                                ))
                              ) : (
                                 <SelectItem value="no-guests" disabled>
                                  {isLoading ? "Carregando lista..." : "Nenhum convidado pendente"}
                                </SelectItem>
                              )}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" size="lg" disabled={isLoading}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
