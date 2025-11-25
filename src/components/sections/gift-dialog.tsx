
"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, PartyPopper, ClipboardCopy, Gift, Upload } from "lucide-react";
import type { Gift as GiftType } from "@/lib/gifts-data";
import { Separator } from "../ui/separator";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { coupleId } from "@/lib/couple-data";
import { ScrollArea } from "../ui/scroll-area";


interface GiftDialogProps {
  gift: GiftType;
  onConfirm: (giftId: string, amount: number) => void;
  children: React.ReactNode;
}

const giftFormSchema = z.object({
  name: z.string({ required_error: "Por favor, selecione seu nome." }),
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
const pixKey = "00020126440014br.gov.bcb.pix0122aziel_1994@hotmail.com5204000053039865802BR5924AZIELASAFFEOLIVEIRAPAULA6009Sao Paulo610901227-20062230519daqr22254342532843163048626";
const qrCodeImage = "/qrcode.jpeg";
// -----------------

export default function GiftDialog({ gift, onConfirm, children }: GiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();
  const guestsRef = useMemoFirebase(() => collection(firestore, 'couples', coupleId, 'guests'), [firestore]);
  const { data: guests, isLoading: isLoadingGuests } = useCollection(guestsRef);

  const [fileName, setFileName] = useState<string | null>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);


  const guestList = guests ? [...guests.map(g => g.name), 'Anônimo'] : ['Anônimo'];

  const remainingAmount = gift.totalPrice - gift.contributedAmount;

  const form = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues: {
      amount: undefined,
      name: undefined,
    },
  });

  const { ref: proofRef, ...proofRest } = form.register("proof");


  useEffect(() => {
    if (open) {
      const defaultAmount = remainingAmount > 0 ? remainingAmount : undefined;
      form.setValue('amount', defaultAmount);
    }
  }, [open, remainingAmount, form]);


  function onSubmit(data: GiftFormValues) {
    onConfirm(gift.id, data.amount);
    setIsConfirmed(true);

    toast({
        title: "Contribuição enviada!",
        description: `Obrigado, ${data.name}, por presentear com R$ ${data.amount.toFixed(2)} para "${gift.name}"!`,
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
            setFileName(null);
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95%] max-w-4xl rounded-lg p-0">
        {isConfirmed ? (
           <div className="text-center p-8 md:p-12">
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
          <ScrollArea className="max-h-[90vh]">
            <div className="grid md:grid-cols-2">
                <div className="relative flex flex-col p-6 bg-secondary/50 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                    <DialogHeader className="text-left mb-4">
                      <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                        <Gift className="h-6 w-6" /> Presentear
                      </DialogTitle>
                      <DialogDescription>
                        Falta <strong>R$ {remainingAmount.toFixed(2)}</strong> para completar.
                      </DialogDescription>
                    </DialogHeader>

                    {gift.image && (
                        <div className="relative w-full aspect-square max-w-sm rounded-lg overflow-hidden border-4 border-primary/20 mx-auto shadow-md">
                            <Image
                                src={gift.image.imageUrl}
                                alt={gift.name}
                                fill
                                className="object-cover"
                                data-ai-hint={gift.image.imageHint}
                            />
                        </div>
                    )}
                    <div className="mt-4 text-center">
                        <p className="font-headline text-xl">{gift.name}</p>
                        <p className="text-sm text-muted-foreground">{gift.description}</p>
                    </div>
                </div>

                <div className="p-6 flex flex-col">
                    <DialogHeader className="text-left">
                        <DialogTitle className="font-headline text-2xl">
                           Como Contribuir
                        </DialogTitle>
                        <DialogDescription>
                            Você pode usar PIX QR Code, chave aleatória, ou preencher os dados abaixo para nos avisar da sua contribuição.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <Separator className="my-4" />

                    <div className="py-4 space-y-4 text-center">
                        <div className="relative w-40 h-40 mx-auto border-4 border-primary rounded-lg overflow-hidden">
                            <Image src={qrCodeImage} alt="QR Code PIX" width={300} height={300} objectFit="cover" />
                        </div>
                        <p className="text-sm text-muted-foreground">Escaneie o QR Code acima ou copie a chave.</p>
                        <div className="flex items-center justify-center p-3 bg-secondary rounded-md">
                            <code className="text-xs text-secondary-foreground break-all">{pixKey}</code>
                            <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 flex-shrink-0" onClick={copyPixKey}>
                                <ClipboardCopy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-auto">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Seu nome (para o agradecimento)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingGuests}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={isLoadingGuests ? "Carregando..." : "Selecione seu nome da lista"} />
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
                        <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Valor da Contribuição (R$)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder={`Faltam R$ ${remainingAmount.toFixed(2)}`} {...field} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
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
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => proofInputRef.current?.click()}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Escolher arquivo
                                            </Button>
                                            {fileName && <span className="text-sm text-muted-foreground truncate">{fileName}</span>}
                                        </div>
                                    </FormControl>
                                     <Input
                                        type="file"
                                        className="hidden"
                                        {...proofRest}
                                        ref={(e) => {
                                            proofRef(e);
                                            // @ts-ignore
                                            proofInputRef.current = e;
                                        }}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            setFileName(file ? file.name : null);
                                            field.onChange(file ? event.target.files : null);
                                        }}
                                    />
                                    <FormDescription>
                                        Anexe o comprovante do PIX (print ou PDF).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="!mt-6">
                        <Button type="submit" size="lg" className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmar Contribuição
                        </Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
