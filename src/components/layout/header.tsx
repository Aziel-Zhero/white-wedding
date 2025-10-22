"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Heart,
  Home,
  Gem,
  MapPin,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import RsvpDialog from "../sections/rsvp-dialog";

const navLinks = [
  { href: "/#inicio", label: "Início", icon: <Home size={18} /> },
  { href: "/#cerimonia", label: "Cerimônia", icon: <Gem size={18} /> },
  { href: "/#local", label: "Local", icon: <MapPin size={18} /> },
  { href: "/presentes", label: "Presentes", icon: <Gift size={18} /> },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/#inicio" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">
            Eduarda & Aziel
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <RsvpDialog>
            <Button>Confirmar Presença</Button>
          </RsvpDialog>
        </nav>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <Link
                  href="/#inicio"
                  className="flex items-center gap-2 mb-4"
                  onClick={() => setSheetOpen(false)}
                >
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-headline text-xl font-bold">
                    Eduarda & Aziel
                  </span>
                </Link>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-lg font-medium"
                    onClick={() => setSheetOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
                <RsvpDialog>
                   <Button size="lg" className="mt-4 w-full" onClick={() => setSheetOpen(false)}>Confirmar Presença</Button>
                </RsvpDialog>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
