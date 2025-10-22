import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Church, Glasses } from "lucide-react";

export default function DetailsSection() {
  return (
    <section id="cerimonia" className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl lg:text-5xl font-bold">
            Detalhes do Evento
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            As informações mais importantes sobre o nosso grande dia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          <Card className="text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit">
                <Church className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl mt-4">Cerimônia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-bold text-lg text-foreground">Sábado, 28 de Outubro de 2024</p>
              <p>às 16:00 horas</p>
              <Separator className="my-4" />
              <p className="font-semibold">Paróquia Nossa Senhora do Brasil</p>
              <p>Praça Nossa Sra. do Brasil, 01 - Jardim América, São Paulo - SP</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit">
                <Glasses className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl mt-4">Recepção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p className="font-bold text-lg text-foreground">Sábado, 28 de Outubro de 2024</p>
              <p>após a cerimônia</p>
              <Separator className="my-4" />
              <p className="font-semibold">Espaço Villa-Lobos</p>
              <p>Av. Gonçalo Madeira, 209 - Jaguaré, São Paulo - SP</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
