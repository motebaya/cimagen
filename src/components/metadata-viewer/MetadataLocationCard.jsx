import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { ExternalLink, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function MetadataLocationCard({ gps, onOpenInGoogleMaps }) {
  if (!gps) {
    return null;
  }

  const mapPosition = [gps.latitude, gps.longitude];

  return (
    <div
      className="rounded-xl border overflow-hidden animate-fade-in"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between gap-3 border-b"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={16} style={{ color: "var(--text-secondary)" }} />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            GPS Location
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenInGoogleMaps}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        >
          <ExternalLink size={14} />
          Open in Google Maps
        </button>
      </div>

      <div className="h-72 w-full">
        <MapContainer
          center={mapPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker
            center={mapPosition}
            radius={10}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.75,
            }}
          >
            <Popup>
              {gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)}
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}
