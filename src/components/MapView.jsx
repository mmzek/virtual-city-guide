import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import PropTypes from "prop-types";
import "./Attractions.jsx";


function SetViewOnLocation({ position }) {
  const map = useMap();
  var pinkIcon = L.icon({
    iconUrl: '/location.svg',
    iconSize:     [38, 90],
    iconAnchor: [20,60], 
  })
  L.marker(position, {icon: pinkIcon}).addTo(map);
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  return null;
}
SetViewOnLocation.propTypes = { position: PropTypes.object.isRequired };

function MapView({ position, markers, onMarkerClick }) {
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
      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position}
          title={marker.title}
          riseOnHover={true}
          eventHandlers={{
            click: () => {
              onMarkerClick(marker);
            },
          }}
        >
          <Tooltip direction="top" offset={[-15, -15]}>
            {marker.title}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
MapView.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  markers: PropTypes.array.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
};

export default MapView;
