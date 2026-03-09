import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let HelpIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: 'hue-rotate-90'
});

function CommunityMap({ requests }) {
    const defaultCenter = [33.5731, -7.5898];

    return (
        <div className="h-96 w-full rounded-md overflow-hidden border border-gray-300 shadow-md">
            <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {requests.map((req) => (
                    req.location && req.location.coordinates ? (
                        <Marker
                            key={req.id || req._id}
                            position={[req.location.coordinates[1], req.location.coordinates[0]]}
                            icon={HelpIcon}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg">{req.title}</h3>
                                    <p className="text-sm text-gray-600 font-medium uppercase">{req.category}</p>
                                    {req.category === 'donation' && (
                                        <div className="text-xs text-primary mt-1">
                                            Target: ${req.target_amount}
                                        </div>
                                    )}
                                    <Link to={`/community-help/${req._id}`} className="text-primary hover:underline mt-2 inline-block">
                                        View Details
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}

export default CommunityMap;
