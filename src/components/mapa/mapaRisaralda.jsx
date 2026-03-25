import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./mapaOverlay.module.css";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

const createCustomIcon = () => {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        color: "#20A217",
        fontSize: "30px",
        filter: "drop-shadow(0px 0px 2px white)",
      }}
    >
      <FaMapMarkerAlt />
    </div>,
  );

  return new L.DivIcon({
    html: iconMarkup,
    className: "custom-leaflet-marker",
    iconSize: [30, 42],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const GreenIcon = createCustomIcon();

const RISARALDA_CENTER = [4.815, -75.69];
const RISARALDA_BOUNDS = [
  [2.0, -78.0],
  [8.0, -74.0],
];

const truncateText = (text, maxLength) => {
  if (!text) return "Sin descripción.";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function MapController({ targetPlace, setTargetPlace }) {
  const map = useMap();

  React.useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    if (targetPlace && targetPlace.latitud && targetPlace.longitud) {
      map.flyTo(
        [Number(targetPlace.latitud), Number(targetPlace.longitud)],
        14,
        { duration: 1.5 },
      );
      const timer = setTimeout(() => setTargetPlace(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [targetPlace, map, setTargetPlace]);

  return null;
}

function MapaRisaralda({ sitiosRisaralda, targetPlace, setTargetPlace }) {
  if (!sitiosRisaralda || sitiosRisaralda.length === 0) {
    return <div className={styles.loading}>Esperando datos de lugares...</div>;
  }

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={RISARALDA_CENTER}
        zoom={9}
        scrollWheelZoom={true}
        maxBounds={RISARALDA_BOUNDS}
        minZoom={8}
        maxZoom={18}
        className={styles.mapContainer}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController
          targetPlace={targetPlace}
          setTargetPlace={setTargetPlace}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sitiosRisaralda.map((sitio) => {
          const lat = Number(sitio.latitud);
          const lng = Number(sitio.longitud);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={sitio.id} position={[lat, lng]} icon={GreenIcon}>
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
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapaRisaralda;
