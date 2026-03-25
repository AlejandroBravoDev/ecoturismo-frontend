import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./mapaOverlay.module.css";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";

const RISARALDA_CENTER = [4.815, -75.69];
const RISARALDA_BOUNDS = [
  [2.0, -78.0],
  [8.0, -74.0],
];

const GreenIcon = new L.DivIcon({
  html: `
    <svg width="30" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
            fill="#20A217" 
            stroke="#ffffff" 
            stroke-width="1.5"/>
      <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
    </svg>`,
  className: styles.customLeafletIcon,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

const truncateText = (text, maxLength) => {
  if (!text) return "Sin descripción.";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function MapController({ targetPlace, setTargetPlace }) {
  const map = useMap();

  React.useEffect(() => {
    if (targetPlace) {
      map.flyTo([targetPlace.latitud, targetPlace.longitud], 14, {
        duration: 1.5,
      });

      const timer = setTimeout(() => setTargetPlace(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [targetPlace, map, setTargetPlace]);

  return null;
}

function MapaRisaralda({ sitiosRisaralda, targetPlace, setTargetPlace }) {
  const position = RISARALDA_CENTER;
  const zoomLevel = 9;

  if (!sitiosRisaralda || sitiosRisaralda.length === 0) {
    return <div className={styles.loading}>Esperando datos de lugares...</div>;
  }

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        maxBounds={RISARALDA_BOUNDS}
        minZoom={8}
        maxZoom={18}
        className={styles.mapContainer}
      >
        <MapController
          targetPlace={targetPlace}
          setTargetPlace={setTargetPlace}
        />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sitiosRisaralda.map((sitio) => (
          <Marker
            key={sitio.id}
            position={[sitio.latitud, sitio.longitud]}
            icon={GreenIcon}
          >
            <Popup>
              <div className={styles.popupCard}>
                {sitio.imagen ? (
                  <img
                    src={sitio.imagen}
                    alt={sitio.nombre}
                    className={styles.cardImagen}
                  />
                ) : (
                  <div className={styles.placeholderDiv}>
                    Imagen no disponible
                  </div>
                )}

                <h4 className={styles.cardTitulo}>{sitio.nombre}</h4>

                <p className={styles.cardDescripcion}>
                  {truncateText(sitio.info, 120)}
                </p>

                <div className={styles.cardCiudad}>
                  <FaMapMarkerAlt className={styles.iconoUbicacion} />
                  <span>{truncateText(sitio.ubicacionTexto, 25)}</span>
                </div>

                <a href={`/lugares/${sitio.id}`} className={styles.cardBoton}>
                  Ver detalles
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaRisaralda;