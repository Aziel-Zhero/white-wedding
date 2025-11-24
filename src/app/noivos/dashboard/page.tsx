"use client";

import {
  Heart,
  Users,
  Gift,
  LogOut,
  DollarSign,
  ListChecks,
  ListPlus,
} from "lucide-react";
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

// Mock Data
const confirmedGuests = [
  { id: 1, name: "Thaina e Jeferson", status: "Confirmado" },
  { id: 2, name: "Gustavo", status: "Confirmado" },
];
const pendingGuests = [
  { id: 1, name: "Dona Bia e Sr Antonio", status: "Pendente" },
  { id: 2, name: "Cleiton e Camile", status: "Pendente" },
];

const receivedGifts = [
  {
    id: 1,
    name: "Jantar Romântico em Paris",
    amount: 500,
    from: "Thaina e Jeferson",
  },
  { id: 2, name: "Jogo de Panelas Premium", amount: 250, from: "Gustavo" },
  { id: 3, name: "Kit de Ferramentas", amount: 100, from: "Anônimo" },
];

const totalGiftValue = receivedGifts.reduce((acc, gift) => acc + gift.amount, 0);

export default function DashboardPage() {
  return (
    <Tabs defaultValue="presenca" className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-background px-4 py-4 sm:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-semibold font-headline">Painel dos Noivos</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sair e voltar ao site</span>
              <span className="inline sm:hidden">Sair</span>
            </Link>
          </Button>
        </div>
        <TabsList className="grid w-full grid-cols-1 h-auto sm:grid-cols-3 sm:max-w-xl">
          <TabsTrigger value="presenca" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Lista de Presença</span>
          </TabsTrigger>
          <TabsTrigger value="presentes" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Presentes Recebidos</span>
          </TabsTrigger>
          <TabsTrigger value="gerenciar-presentes" className="flex items-center gap-2">
            <ListPlus className="h-4 w-4" />
            <span>Gerenciar Presentes</span>
          </TabsTrigger>
        </TabsList>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <TabsContent value="presenca" className="mt-0">
            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2">
              <ListChecks /> Lista de Presença
            </h2>
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
                              <Badge>{guest.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <Card>
                  <CardContent className="p-0">
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="presentes" className="mt-0">
             <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2">
                <Gift /> Presentes Recebidos
            </h2>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gerenciar-presentes" className="mt-0">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <ListPlus /> Gerenciar Presentes
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
                  <ScrollArea className="h-[60vh] sm:h-auto">
                    <form className="space-y-4 px-4 py-2">
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
                      <DialogFooter className="!mt-6">
                        <Button type="submit">Salvar Presente</Button>
                      </DialogFooter>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Arrecadado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {AllGifts.map((gift) => (
                      <TableRow key={gift.id}>
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
                          {gift.contributedAmount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            ...
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
      </main>
    </Tabs>
  );
}
