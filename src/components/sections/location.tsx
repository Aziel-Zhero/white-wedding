import WeddingMap from "@/components/map";
import { MapPin } from "lucide-react";

export default function LocationSection() {
  return (
    <section id="local" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <MapPin className="h-12 w-12 mx-auto text-primary" />
          <h2 className="font-headline text-4xl lg:text-5xl font-bold mt-4">
            Localização
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A cerimônia e a recepção acontecerão no mesmo local para sua comodidade.
          </p>
          <div className="mt-6 text-lg">
            <p className="font-semibold">Chácara Sonho Verde</p>
            <p className="text-muted-foreground">Estrada Municipal Jorge Emilio Vieira, S/N - Cruz Pequena</p>
          </div>
        </div>
        
        <WeddingMap />

      </div>
    </section>
  );
}
