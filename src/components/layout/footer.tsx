import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary py-6">
      <div className="container mx-auto px-4 text-center text-secondary-foreground">
        <p className="flex items-center justify-center gap-2">
          Feito com <Heart className="h-4 w-4 text-primary" /> por Eduarda &amp; Aziel
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          &copy; {currentYear} Unidos para Sempre. Todos os direitos reservados.
        </p>
        <div className="mt-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
            Área dos Noivos
          </Link>
        </div>
      </div>
    </footer>
  );
}
