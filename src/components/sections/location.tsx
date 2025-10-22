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
        
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3675.659862228184!2d-45.476859925816456!3d-22.88902003723419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDUzJzIwLjUiUyA0NcKwMjgnMjcuNCJX!5e0!3m2!1spt-BR!2sbr!4v1761130681398!5m2!1spt-BR!2sbr" 
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