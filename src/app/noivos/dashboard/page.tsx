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
  Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Gift as GiftType } from "@/lib/gifts-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";


export default function DashboardPage() {
  const firestore = useFirestore();

  // --- Firebase Data ---
  const guestsRef = useMemoFirebase(() => collection(firestore, "couples", coupleId, "guests"), [firestore]);
  const giftsRef = useMemoFirebase(() => collection(firestore, "couples", coupleId, "gifts"), [firestore]);
  const rsvpsRef = useMemoFirebase(() => collection(firestore, "couples", coupleId, "rsvps"), [firestore]);

  const { data: allGuests, isLoading: isLoadingGuests } = useCollection(guestsRef);
  const { data: gifts, isLoading: isLoadingGifts } = useCollection<GiftType>(giftsRef);
  const { data: rsvps, isLoading: isLoadingRsvps } = useCollection(rsvpsRef);


  // --- Computed Data ---
  const confirmedGuests = useMemo(() => rsvps?.map(r => ({...r, status: 'Confirmado'})) ?? [], [rsvps]);
  
  const pendingGuests = useMemo(() => {
    if (!allGuests || !rsvps) return [];
    const confirmedNames = new Set(rsvps.map(r => r.guestName));
    return allGuests.filter(g => !confirmedNames.has(g.name)).map(g => ({...g, status: 'Pendente'}));
  }, [allGuests, rsvps]);

  const giftsWithContributors = useMemo(() => {
    if (!gifts) return [];
    // This logic can be expanded if we store contributors in a subcollection
    return gifts.map(gift => ({
        ...gift,
        contributors: [], // Placeholder for now
        image: PlaceHolderImages.find(p => p.id === gift.id) || (gift.imageUrl ? { id: gift.id, imageUrl: gift.imageUrl, description: gift.name, imageHint: '' } : undefined)
    }));
  }, [gifts]);
  
  const totalGiftValue = useMemo(() => {
    return gifts?.reduce((acc, gift) => acc + (gift.contributedAmount || 0), 0) ?? 0;
  }, [gifts]);
  
  // A placeholder for received gifts, as we are not yet storing individual contributions.
  const receivedGifts = useMemo(() => {
    return gifts
      ?.filter(g => g.contributedAmount > 0)
      .map(g => ({
        id: g.id,
        name: g.name,
        amount: g.contributedAmount,
        from: 'Contribuições' // This would need a subcollection to be accurate
      })) ?? [];
  }, [gifts]);


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
              {/* Add Guest Dialog Here */}
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
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
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
                   {/* Add Gift Dialog Here */}
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
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
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
