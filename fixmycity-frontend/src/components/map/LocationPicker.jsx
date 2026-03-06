import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition, onLocationSelect }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            if (onLocationSelect) onLocationSelect(e.latlng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function LocationPicker({ onLocationSelect, initialLayout }) {
    const [position, setPosition] = useState(initialLayout || null);
    const [mapInstance, setMapInstance] = useState(null);

    const defaultCenter = initialLayout || [33.5731, -7.5898];

    const handleLocateMe = () => {
        if (mapInstance) {
            mapInstance.locate().on("locationfound", function (e) {
                setPosition(e.latlng);
                if (onLocationSelect) onLocationSelect(e.latlng);
                mapInstance.flyTo(e.latlng, mapInstance.getZoom());
            });
        }
    };

    return (
        <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                whenCreated={setMapInstance}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
            </MapContainer>

            <button
                type="button"
                onClick={handleLocateMe}
                className="absolute top-2 right-2 z-400 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 p-2 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none border border-gray-200 dark:border-gray-600"
                title="Use Current Location"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}

export default LocationPicker;
