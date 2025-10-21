import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary py-6">
      <div className="container mx-auto px-4 text-center text-secondary-foreground">
        <p className="flex items-center justify-center gap-2">
          Feito com <Heart className="h-4 w-4 text-primary" /> por Ana &amp; João
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          &copy; {currentYear} Unidos para Sempre. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
