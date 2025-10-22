"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

export default function WeddingMap() {
  const position = { lat: -23.18183, lng: -46.1944 }; // Chácara Sonho Verde, Igaratá - SP
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <p>Google Maps API Key não encontrada. Configure-a em seu arquivo .env.local.</p>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full rounded-lg overflow-hidden shadow-lg border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="e8c2810a5ebee765"
        >
          <AdvancedMarker position={position}>
            <MapPin className="h-10 w-10 text-primary" fill="hsl(var(--primary-foreground))" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
