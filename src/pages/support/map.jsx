// import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import NavbarSupport from "@/components/_partials/NavbarSupport";
import { useTranslation } from "react-i18next";

// Coordenadas del centro del mapa (14.738556302323046, -91.1502184913152)
const center = [14.738556302323046, -91.1502184913152];

function Map() {
  const [t] = useTranslation("global");

  return (
    <>
      <NavbarSupport />
      <div className="max-w-4xl mx-auto p-6  rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out mt-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          {t('mapa.title')}
        </h2>
        <p className="mb-5">
          {t('mapa.description')}
          <br />
          <br />
          {t('mapa.description1')}
        </p>
        <div className="relative">
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{
              height: "500px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0"
            }}
            className="hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <LayersControl position="topright">
              {/* Mapa Callejero (similar a Google Maps) */}
              <LayersControl.BaseLayer checked name="Mapa Callejero">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>

              {/* Mapa Satélite */}
              <LayersControl.BaseLayer name="Satélite">
                <TileLayer
                  url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FudG9zcGVkcm9iYWx0YXphciIsImEiOiJjbTBvdmFxbncwOHgyMnJwcG84MWVzYTl1In0.Eu0O964cDgxMhEUdiO1_yw"
                  attribution='Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                />
              </LayersControl.BaseLayer>

              {/* Mapa Oscuro */}
              <LayersControl.BaseLayer name="Mapa Oscuro">
                <TileLayer
                  url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FudG9zcGVkcm9iYWx0YXphciIsImEiOiJjbTBvdmFxbncwOHgyMnJwcG84MWVzYTl1In0.Eu0O964cDgxMhEUdiO1_yw"
                  attribution='Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                />
              </LayersControl.BaseLayer>

              <Marker position={center}>
                <Popup>
                  <span className="font-medium text-blue-900 dark:text-blue-900">{t('mapa.locate')}</span>
                </Popup>
              </Marker>
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default Map;
