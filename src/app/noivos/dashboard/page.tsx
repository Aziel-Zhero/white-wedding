"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Heart, Users, Gift, LogOut, DollarSign, ListChecks, ListPlus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AllGifts } from "@/lib/gifts-data";


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
    { id: 1, name: "Jantar Romântico em Paris", amount: 500, from: "Thaina e Jeferson" },
    { id: 2, name: "Jogo de Panelas Premium", amount: 250, from: "Gustavo" },
    { id: 3, name: "Kit de Ferramentas", amount: 100, from: "Anônimo" },
];

const totalGiftValue = receivedGifts.reduce((acc, gift) => acc + gift.amount, 0);


export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Heart className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-headline font-semibold">Painel dos Noivos</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#presenca" isActive>
                <Users />
                Lista de Presença
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#presentes">
                <Gift />
                Presentes Recebidos
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#gerenciar-presentes">
                <ListPlus />
                Gerenciar Presentes
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                    <LogOut />
                    Sair e voltar ao site
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 space-y-8">
            <section id="presenca">
                <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><ListChecks /> Lista de Presença</h2>
                <Tabs defaultValue="confirmed">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="confirmed">Confirmados ({confirmedGuests.length})</TabsTrigger>
                        <TabsTrigger value="pending">Pendentes ({pendingGuests.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="confirmed">
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
                                        {confirmedGuests.map(guest => (
                                            <TableRow key={guest.id}>
                                                <TableCell className="font-medium">{guest.name}</TableCell>
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
                    <TabsContent value="pending">
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
                                        {pendingGuests.map(guest => (
                                            <TableRow key={guest.id}>
                                                <TableCell className="font-medium">{guest.name}</TableCell>
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
            </section>

            <section id="presentes">
                <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2"><Gift /> Presentes Recebidos</h2>
                 <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalGiftValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                                {receivedGifts.map(gift => (
                                    <TableRow key={gift.id}>
                                        <TableCell className="font-medium">{gift.name}</TableCell>
                                        <TableCell>{gift.from}</TableCell>
                                        <TableCell className="text-right">{gift.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
            
            <section id="gerenciar-presentes">
                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-headline font-bold flex items-center gap-2"><ListPlus /> Gerenciar Presentes</h2>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button>Adicionar Novo Presente</Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Adicionar Novo Presente</DialogTitle>
                                <DialogDescription>
                                    Preencha os detalhes do novo presente que você deseja adicionar à lista.
                                </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gift-name">Nome do Produto</Label>
                                    <Input id="gift-name" placeholder="Ex: Jogo de Panelas" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gift-description">Descrição</Label>
                                    <Textarea id="gift-description" placeholder="Descreva o presente..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gift-price">Preço (R$)</Label>
                                    <Input id="gift-price" type="number" placeholder="Ex: 250.00" />
                                 </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gift-image">URL da Imagem</Label>
                                    <Input id="gift-image" placeholder="https://exemplo.com/imagem.jpg" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Salvar Presente</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                     </Dialog>
                </div>
                 <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome do Produto</TableHead>
                                    <TableHead>Preço</TableHead>
                                    <TableHead>Arrecadado</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {AllGifts.map(gift => (
                                    <TableRow key={gift.id}>
                                        <TableCell className="font-medium">{gift.name}</TableCell>
                                        <TableCell>{gift.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{gift.contributedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
            </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
