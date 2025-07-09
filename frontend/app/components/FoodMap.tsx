"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface FoodMapProps {
    position: [number, number];
    readOnly?: boolean;
}

export default function FoodMap({ position, readOnly = false }: FoodMapProps) {
    useEffect(() => {

        const proto = L.Icon.Default.prototype as unknown as {
            _getIconUrl?: unknown;
        };
        delete proto._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
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
