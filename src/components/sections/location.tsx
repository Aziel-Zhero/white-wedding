import { Map, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function LocationSection() {
  const address = "Chácara Recanto Sonho Meu, Estrada Municipal Romeu de Campos, Pindamonhangaba - SP";
  const googleMapsUrl = `https://maps.app.goo.gl/w8Kg7Vd51T4KcbWg6`;

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
            <p className="font-semibold">Chácara Recanto Sonho Meu</p>
            <p className="text-muted-foreground">Estrada Municipal Romeu de Campos, Pindamonhangaba - SP</p>
          </div>
          <Button asChild className="mt-6">
            <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Map className="mr-2 h-4 w-4" />
              Ver no mapa
            </Link>
          </Button>
        </div>
        
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.564177579626!2d-45.42236118898159!3d-23.11306387899757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc6033bd2f8015%3A0x6b349b1686235b8e!2sCh%C3%A1cara%20Recanto%20Sonho%20Meu!5e0!3m2!1spt-BR!2sbr!4v1762119015197!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
