
"use client";

import {
  Heart,
  Users,
  Gift,
  LogOut,
  DollarSign,
  UserPlus,
  ListPlus,
  MoreHorizontal,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from "@/firebase";
import { coupleId } from "@/lib/couple-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Gift as GiftType } from "@/lib/gifts-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


type GuestType = {
  id: string;
  name: string;
  email?: string;
};

export default function DashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user } = useUser();

  // --- Form State for New/Edit Gift ---
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [isSavingGift, setIsSavingGift] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftType | null>(null);
  const [giftName, setGiftName] = useState("");
  const [giftDescription, setGiftDescription] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftImageUrl, setGiftImageUrl] = useState("");


  // --- Form State for New/Edit Guest ---
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
  const [isSavingGuest, setIsSavingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestType | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");


  // --- Firebase Data ---
  const guestsRef = useMemoFirebase(() => firestore ? collection(firestore, "couples", coupleId, "guests") : null, [firestore]);
  const giftsRef = useMemoFirebase(() => firestore ? collection(firestore, "couples", coupleId, "gifts") : null, [firestore]);
  const rsvpsRef = useMemoFirebase(() => firestore ? collection(firestore, "couples", coupleId, "rsvps") : null, [firestore]);

  const { data: allGuests, isLoading: isLoadingGuests } = useCollection<GuestType>(guestsRef);
  const { data: gifts, isLoading: isLoadingGifts } = useCollection<GiftType>(giftsRef);
  const { data: rsvps, isLoading: isLoadingRsvps } = useCollection(rsvpsRef);
  
  // Ensure couple document exists
  useEffect(() => {
    if (user && firestore) {
      const coupleDocRef = doc(firestore, 'couples', coupleId);
      const ensureCoupleDoc = async () => {
        const docSnap = await getDoc(coupleDocRef);
        if (!docSnap.exists()) {
          try {
            await setDoc(coupleDocRef, { ownerId: user.uid }, { merge: true });
          } catch (error) {
             const permissionError = new FirestorePermissionError({
                path: coupleDocRef.path,
                operation: 'create',
                requestResourceData: { ownerId: user.uid },
            });
            errorEmitter.emit('permission-error', permissionError);
          }
        }
      };
      ensureCoupleDoc();
    }
  }, [user, firestore]);

  // --- Computed Data ---
  const confirmedGuests = useMemo(() => rsvps?.map(r => ({...r, status: 'Confirmado'})) ?? [], [rsvps]);
  
  const pendingGuests = useMemo(() => {
    if (!allGuests || !rsvps) return [];
    const confirmedNames = new Set(rsvps.map(r => r.guestName));
    return allGuests.filter(g => !confirmedNames.has(g.name)).map(g => ({...g, status: 'Pendente'}));
  }, [allGuests, rsvps]);

  const giftsWithContributors = useMemo(() => {
    if (!gifts) return [];
    return gifts.map(gift => ({
        ...gift,
        contributors: [], 
        image: PlaceHolderImages.find(p => p.id === gift.id) || (gift.imageUrl ? { id: gift.id, imageUrl: gift.imageUrl, description: gift.name, imageHint: '' } : undefined)
    }));
  }, [gifts]);
  
  const totalGiftValue = useMemo(() => {
    return gifts?.reduce((acc, gift) => acc + (gift.contributedAmount || 0), 0) ?? 0;
  }, [gifts]);
  
  const receivedGifts = useMemo(() => {
    return gifts
      ?.filter(g => g.contributedAmount > 0)
      .map(g => ({
        id: g.id,
        name: g.name,
        amount: g.contributedAmount,
        from: 'Contribuições'
      })) ?? [];
  }, [gifts]);


  // --- Guest Management ---
  const openAddGuestDialog = () => {
    setEditingGuest(null);
    setGuestName("");
    setGuestEmail("");
    setIsGuestDialogOpen(true);
  };

  const openEditGuestDialog = (guest: GuestType) => {
    setEditingGuest(guest);
    setGuestName(guest.name);
    setGuestEmail(guest.email || "");
    setIsGuestDialogOpen(true);
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !guestsRef) return;
    if (!guestName) {
        toast({ variant: "destructive", title: "Campo obrigatório", description: "Por favor, preencha o nome do convidado." });
        return;
    }
    setIsSavingGuest(true);

    if (editingGuest) { // Update existing guest
        const guestDocRef = doc(firestore, "couples", coupleId, "guests", editingGuest.id);
        const updatedData = { name: guestName, email: guestEmail };
        updateDoc(guestDocRef, updatedData)
            .then(() => {
                toast({ title: "Convidado Atualizado!", description: `"${guestName}" foi atualizado com sucesso.` });
                setIsGuestDialogOpen(false);
            })
            .catch(() => {
                const permissionError = new FirestorePermissionError({ path: guestDocRef.path, operation: 'update', requestResourceData: updatedData });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsSavingGuest(false));
    } else { // Add new guest
        const newGuestData = { name: guestName, email: guestEmail, coupleId: coupleId };
        addDoc(guestsRef, newGuestData)
            .then(() => {
                toast({ title: "Convidado Adicionado!", description: `"${guestName}" foi adicionado à sua lista.` });
                setIsGuestDialogOpen(false);
            })
            .catch(() => {
                const permissionError = new FirestorePermissionError({ path: guestsRef.path, operation: 'create', requestResourceData: newGuestData });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsSavingGuest(false));
    }
};

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!firestore) return;
    const guestDocRef = doc(firestore, "couples", coupleId, "guests", guestId);
    deleteDoc(guestDocRef)
      .then(() => {
        toast({
          title: "Convidado Removido",
          description: `"${guestName}" foi removido da sua lista.`,
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: guestDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  // --- Gift Management ---
  const openAddGiftDialog = () => {
    setEditingGift(null);
    setGiftName("");
    setGiftDescription("");
    setGiftPrice("");
    setGiftImageUrl("");
    setIsGiftDialogOpen(true);
  };

  const openEditGiftDialog = (gift: GiftType) => {
    setEditingGift(gift);
    setGiftName(gift.name);
    setGiftDescription(gift.description || "");
    setGiftPrice(gift.totalPrice.toString());
    setGiftImageUrl(gift.imageUrl || "");
    setIsGiftDialogOpen(true);
  };

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !giftsRef) return;
    if (!giftName || !giftPrice) {
        toast({ variant: "destructive", title: "Campos obrigatórios", description: "Por favor, preencha o nome e o preço do presente." });
        return;
    }
    setIsSavingGift(true);

    const giftData = {
        name: giftName,
        description: giftDescription,
        totalPrice: parseFloat(giftPrice),
        imageUrl: giftImageUrl,
        ownerId: user.uid, // Required for create rule
    };

    if (editingGift) { // Update existing gift
        const giftDocRef = doc(firestore, "couples", coupleId, "gifts", editingGift.id);
        // contributedAmount is not editable here, so we don't include it.
        const updateData = { ...giftData, contributedAmount: editingGift.contributedAmount };
        
        updateDoc(giftDocRef, updateData)
            .then(() => {
                toast({ title: "Presente Atualizado!", description: `"${giftName}" foi atualizado com sucesso.` });
                setIsGiftDialogOpen(false);
            })
            .catch(() => {
                const permissionError = new FirestorePermissionError({ path: giftDocRef.path, operation: 'update', requestResourceData: updateData });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsSavingGift(false));
    } else { // Add new gift
        const newGiftData = { ...giftData, contributedAmount: 0 };
        addDoc(giftsRef, newGiftData)
            .then(() => {
                toast({ title: "Presente Adicionado!", description: `"${giftName}" foi adicionado à sua lista.` });
                setIsGiftDialogOpen(false);
            })
            .catch(() => {
                const permissionError = new FirestorePermissionError({ path: giftsRef.path, operation: 'create', requestResourceData: newGiftData });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => setIsSavingGift(false));
    }
  };

  const handleDeleteGift = async (giftId: string, giftName: string) => {
    if (!firestore) return;
    const giftDocRef = doc(firestore, "couples", coupleId, "gifts", giftId);
    deleteDoc(giftDocRef)
      .then(() => {
        toast({
          title: "Presente Removido",
          description: `"${giftName}" foi removido da sua lista.`,
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: giftDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const renderSkeleton = (rows = 5) => (
    Array.from({ length: rows }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <TooltipProvider>
      <Tabs defaultValue="convidados" className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background px-4 py-4 sm:px-6">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-semibold font-headline">Painel dos Noivos</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Link>
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 h-auto sm:max-w-2xl">
              <TabsTrigger value="convidados" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Convidados</span>
              </TabsTrigger>
              <TabsTrigger value="presenca" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Lista de Presença</span>
              </TabsTrigger>
              <TabsTrigger value="presentes" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Presentes</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <TabsContent value="convidados" className="mt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <UserPlus /> Gerenciar Convidados
              </h2>
              <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddGuestDialog}>Adicionar Convidado</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{editingGuest ? 'Editar Convidado' : 'Adicionar Novo Convidado'}</DialogTitle>
                    <DialogDescription>
                      {editingGuest ? 'Altere os detalhes do seu convidado.' : 'Insira os detalhes do seu convidado para adicioná-lo à lista.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleGuestSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="guest-name" className="text-right">
                          Nome
                        </Label>
                        <Input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="guest-email" className="text-right">
                          Email
                        </Label>
                        <Input id="guest-email" type="email" placeholder="Opcional" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancelar</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSavingGuest}>
                         {isSavingGuest ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                         {isSavingGuest ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingGuests ? renderSkeleton() : (allGuests ?? []).map((guest) => {
                          const isConfirmed = confirmedGuests.some(c => c.guestName === guest.name);
                          const status = isConfirmed ? 'Confirmado' : 'Pendente';
                          return (
                            <TableRow key={guest.id}>
                              <TableCell className="font-medium">
                                {guest.name}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground">
                                {guest.email}
                              </TableCell>
                              <TableCell>
                                <Badge variant={status === 'Confirmado' ? 'default' : 'secondary'} className={status === 'Confirmado' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}>{status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openEditGuestDialog(guest)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Remover
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Essa ação não pode ser desfeita. Isso removerá permanentemente o convidado <strong>{guest.name}</strong> da sua lista.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive hover:bg-destructive/90"
                                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                          >
                                            Sim, remover
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presenca" className="mt-0">
            <Tabs defaultValue="confirmed">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="confirmed">
                  Confirmados ({confirmedGuests.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pendentes ({pendingGuests.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="confirmed" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingRsvps ? renderSkeleton(confirmedGuests.length || 3) : confirmedGuests.map((guest) => (
                            <TableRow key={guest.id}>
                              <TableCell className="font-medium">
                                {guest.guestName}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className="bg-green-600 hover:bg-green-700 text-white">Confirmado</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(isLoadingGuests || isLoadingRsvps) ? renderSkeleton(pendingGuests.length || 5) : pendingGuests.map((guest) => (
                            <TableRow key={guest.id}>
                              <TableCell className="font-medium">
                                {guest.name}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant="secondary">{guest.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="presentes" className="mt-0">
            <Tabs defaultValue="recebidos">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="recebidos">Presentes Recebidos</TabsTrigger>
                <TabsTrigger value="gerenciar">Gerenciar Lista</TabsTrigger>
              </TabsList>

              <TabsContent value="recebidos" className="mt-4">
                 <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Arrecadado
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {isLoadingGifts ? <Skeleton className="h-8 w-32 mt-1" /> : (
                      <div className="text-2xl font-bold">
                        {totalGiftValue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Contribuições</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Presente</TableHead>
                            <TableHead>De</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingGifts ? renderSkeleton(3) : receivedGifts.map((gift) => (
                            <TableRow key={gift.id}>
                              <TableCell className="font-medium">
                                {gift.name}
                              </TableCell>
                              <TableCell>{gift.from}</TableCell>
                              <TableCell className="text-right">
                                {gift.amount.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gerenciar" className="mt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                    <ListPlus /> Itens da sua Lista
                  </h2>
                   <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddGiftDialog}>Adicionar Presente</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle>{editingGift ? 'Editar Presente' : 'Adicionar Novo Presente'}</DialogTitle>
                        <DialogDescription>
                          {editingGift ? 'Altere os detalhes do item da sua lista.' : 'Preencha os detalhes do novo item para a sua lista de presentes.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGiftSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gift-name" className="text-right">
                              Nome
                            </Label>
                            <Input id="gift-name" value={giftName} onChange={(e) => setGiftName(e.target.value)} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gift-description" className="text-right">
                              Descrição
                            </Label>
                            <Textarea id="gift-description" value={giftDescription} onChange={(e) => setGiftDescription(e.target.value)} className="col-span-3" />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gift-price" className="text-right">
                              Preço (R$)
                            </Label>
                            <Input id="gift-price" type="number" step="0.01" value={giftPrice} onChange={(e) => setGiftPrice(e.target.value)} className="col-span-3" required />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gift-image" className="text-right">
                              URL da Imagem
                            </Label>
                            <Input id="gift-image" placeholder="Opcional" value={giftImageUrl} onChange={(e) => setGiftImageUrl(e.target.value)} className="col-span-3" />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSavingGift}>
                            {isSavingGift ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSavingGift ? 'Salvando...' : 'Salvar'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                   </Dialog>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px] hidden sm:table-cell">Imagem</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Vaquinha</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingGifts ? renderSkeleton(5) : giftsWithContributors.map((gift) => (
                            <TableRow key={gift.id}>
                              <TableCell className="hidden sm:table-cell">
                                {gift.image ? (
                                  <Image
                                    src={gift.image.imageUrl}
                                    alt={gift.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover aspect-square"
                                  />
                                ) : <Skeleton className="h-16 w-16 rounded-md" /> }
                              </TableCell>
                              <TableCell className="font-medium">
                                {gift.name}
                              </TableCell>
                              <TableCell>
                                {gift.totalPrice.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </TableCell>
                              <TableCell>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="underline decoration-dotted cursor-pointer">
                                      {gift.contributedAmount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </span>
                                  </TooltipTrigger>
                                  {gift.contributors.length > 0 && (
                                    <TooltipContent>
                                      <p className="font-bold mb-1">Contribuições:</p>
                                      <ul className="list-disc pl-4">
                                        {gift.contributors.map((c: any) => (
                                          <li key={c.id} className="text-sm">
                                            {c.from}: {c.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                          </li>
                                        ))}
                                      </ul>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openEditGiftDialog(gift)}>
                                       <Edit className="mr-2 h-4 w-4" />
                                       Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Remover
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Essa ação não pode ser desfeita. Isso removerá permanentemente o presente <strong>{gift.name}</strong> da sua lista.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive hover:bg-destructive/90"
                                            onClick={() => handleDeleteGift(gift.id, gift.name)}
                                          >
                                            Sim, remover
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

        </main>
      </Tabs>
    </TooltipProvider>
  );

}

    