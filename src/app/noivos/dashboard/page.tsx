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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AllGifts } from "@/lib/gifts-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


// Mock Data
const allGuests = [
  { id: 1, name: "Thaina e Jeferson", email: "thaina.jeferson@example.com", status: "Confirmado" },
  { id: 2, name: "Gustavo", email: "gustavo@example.com", status: "Confirmado" },
  { id: 3, name: "Dona Bia e Sr Antonio", email: "bia.antonio@example.com", status: "Pendente" },
  { id: 4, name: "Cleiton e Camile", email: "cleiton.camile@example.com", status: "Pendente" },
];

const confirmedGuests = allGuests.filter(g => g.status === 'Confirmado');
const pendingGuests = allGuests.filter(g => g.status === 'Pendente');


const receivedGifts = [
  {
    id: 1,
    giftId: "gift-paris-dinner",
    name: "Jantar Romântico em Paris",
    amount: 50,
    from: "Thaina e Jeferson",
  },
  {
    id: 4,
    giftId: "gift-paris-dinner",
    name: "Jantar Romântico em Paris",
    amount: 100,
    from: "Anônimo",
  },
  { id: 2, giftId: "gifts-cookware", name: "Jogo de Panelas Premium", amount: 250, from: "Gustavo" },
  { id: 3, giftId: "gift-tool-kit", name: "Kit de Ferramentas", amount: 100, from: "Anônimo" },
];

const giftsWithContributors = AllGifts.map(gift => {
  const contributors = receivedGifts.filter(g => g.giftId === gift.id);
  return {
    ...gift,
    contributors,
  };
});


const totalGiftValue = receivedGifts.reduce((acc, gift) => acc + gift.amount, 0);

export default function DashboardPage() {
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">Adicionar Convidado</Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-md rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Convidado</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do novo convidado. Ele aparecerá na lista de presença como pendente.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4 px-1 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="guest-name">Nome do Convidado</Label>
                      <Input id="guest-name" placeholder="Ex: João da Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-email">Email (Opcional)</Label>
                      <Input id="guest-email" type="email" placeholder="Ex: joao@email.com" />
                    </div>
                    <DialogFooter className="!mt-6">
                      <Button type="submit">Salvar Convidado</Button>
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
                        {allGuests.map((guest) => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">
                              {guest.name}
                            </TableCell>
                             <TableCell className="hidden sm:table-cell text-muted-foreground">
                              {guest.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant={guest.status === 'Confirmado' ? 'default' : 'secondary'} className={guest.status === 'Confirmado' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}>{guest.status}</Badge>
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
                        {confirmedGuests.map((guest) => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">
                              {guest.name}
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
                          {pendingGuests.map((guest) => (
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
                    <div className="text-2xl font-bold">
                      {totalGiftValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
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
                            {receivedGifts.map((gift) => (
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">Adicionar Novo Presente</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-md rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Presente</DialogTitle>
                        <DialogDescription>
                          Preencha os detalhes do novo presente que você deseja
                          adicionar à lista.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] sm:h-auto -mx-6 px-6">
                        <form className="space-y-4 px-1 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="gift-name">Nome do Produto</Label>
                            <Input id="gift-name" placeholder="Ex: Jogo de Panelas" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gift-description">Descrição</Label>
                            <Textarea
                              id="gift-description"
                              placeholder="Descreva o presente..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gift-price">Preço (R$)</Label>
                            <Input
                              id="gift-price"
                              type="number"
                              placeholder="Ex: 250.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gift-image">URL da Imagem</Label>
                            <Input
                              id="gift-image"
                              placeholder="https://exemplo.com/imagem.jpg"
                            />
                          </div>
                           <DialogFooter className="!mt-6 pt-4 border-t">
                            <Button type="submit" className="w-full">Salvar Presente</Button>
                          </DialogFooter>
                        </form>
                      </ScrollArea>
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
                            {giftsWithContributors.map((gift) => (
                              <TableRow key={gift.id}>
                                <TableCell className="hidden sm:table-cell">
                                  {gift.image && (
                                    <Image
                                      src={gift.image.imageUrl}
                                      alt={gift.name}
                                      width={64}
                                      height={64}
                                      className="rounded-md object-cover aspect-square"
                                    />
                                  )}
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
                                            {gift.contributors.map(c => (
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
