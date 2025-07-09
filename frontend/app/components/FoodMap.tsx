// frontend/app/components/FoodMap.tsx

'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FoodMapProps {
    position: [number, number];
    readOnly?: boolean;
}

export default function FoodMap({
                                    position,
                                    readOnly = false,
                                }: FoodMapProps) {
    useEffect(() => {

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
            iconUrl:       '/leaflet/images/marker-icon.png',
            shadowUrl:     '/leaflet/images/marker-shadow.png',
        });
    }, []);

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <MapContainer
                center={position}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={!readOnly}
                dragging={!readOnly}
                doubleClickZoom={!readOnly}
                touchZoom={!readOnly}
                zoomControl={!readOnly}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                    <Popup>🍽️ trading location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
