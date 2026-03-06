import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function IssuesMap({ issues }) {
    const defaultCenter = [33.5731, -7.5898];

    return (
        <div className="h-96 w-full rounded-md overflow-hidden border border-gray-300 shadow-md">
            <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {issues.map((issue, index) => (
                    issue.location && issue.location.coordinates ? (
                        <Marker
                            key={issue._id || index}
                            position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
                        >
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg">{issue.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{issue.category}</p>
                                    <Link to={`/urban-issues/${issue._id}`} className="text-primary hover:underline">
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

export default IssuesMap;
