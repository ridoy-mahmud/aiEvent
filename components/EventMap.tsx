"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

interface EventMapProps {
  location: string;
}

export default function EventMap({ location }: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapError) return;

    // Create a Google Maps search URL
    const encodedLocation = encodeURIComponent(location);
    const mapUrl = `https://www.google.com/maps?q=${encodedLocation}`;

    // For embedded map, we'll use an iframe with Google Maps
    // Note: This requires a Google Maps API key for full functionality
    // For now, we'll show a clickable preview
    setMapLoaded(true);
  }, [location, mapError]);

  // Open Google Maps in new tab
  const handleMapClick = () => {
    const encodedLocation = encodeURIComponent(location);
    window.open(
      `https://www.google.com/maps?q=${encodedLocation}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Generate a static map image URL (no API key needed for basic usage)
  // Using a placeholder service - in production, use Google Maps Static API with key
  const getMapImageUrl = () => {
    const encodedLocation = encodeURIComponent(location);
    // Using OpenStreetMap as a free alternative
    return `https://www.openstreetmap.org/search?query=${encodedLocation}`;
  };

  return (
    <div className="space-y-4">
      {/* Map Preview */}
      <div
        ref={mapRef}
        className="relative w-full h-[300px] rounded-lg overflow-hidden bg-dark-200 border border-white/10"
      >
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-3 animate-pulse" />
              <p className="text-light-200">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Map iframe - Google Maps embed */}
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`}
                allowFullScreen
                className="w-full h-full"
                onError={() => setMapError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-200/80 backdrop-blur-sm">
                <div className="text-center p-4">
                  <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                  <p className="text-light-200 mb-2">Map preview requires Google Maps API key</p>
                  <button
                    onClick={handleMapClick}
                    className="text-primary hover:text-primary/80 text-sm flex items-center gap-1 mx-auto"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-200/80 backdrop-blur-sm">
                <div className="text-center p-4">
                  <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                  <p className="text-light-200 mb-2">Unable to load map</p>
                  <button
                    onClick={handleMapClick}
                    className="text-primary hover:text-primary/80 text-sm flex items-center gap-1 mx-auto"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Location Info */}
      <div className="flex items-start gap-3 p-4 glass-soft rounded-lg">
        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-light-100 font-medium mb-1">Event Location</p>
          <p className="text-light-200 text-sm">{location}</p>
          <button
            onClick={handleMapClick}
            className="mt-2 inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
          >
            View on Google Maps
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

