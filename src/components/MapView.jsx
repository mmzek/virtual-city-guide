import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView() {
  return (
    <MapContainer
      center={[52.2297, 21.0122]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

export default MapView;
