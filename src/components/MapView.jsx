import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import PropTypes from "prop-types";

function SetViewOnLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  return null;
}
SetViewOnLocation.propTypes = { position: PropTypes.object.isRequired };

function MapView({ position }) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <SetViewOnLocation position={position} />
      <Marker position={position}></Marker>
    </MapContainer>
  );
}
MapView.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MapView;
