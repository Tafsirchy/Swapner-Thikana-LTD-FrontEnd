'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix Leaflet default icon issues in Next.js
const fixLeafletIcon = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

// Check if window is defined (client-side) before fixing icon
if (typeof window !== 'undefined') {
    fixLeafletIcon();
}

// Custom Draggable Icon
const draggableIcon = typeof window !== 'undefined' ? new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
}) : null;

// Component to handle map clicks and updates
const LocationMarker = ({ position, onPositionChange }) => {
    const markerRef = useRef(null);

    useMapEvents({
        click(e) {
            onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const latLng = marker.getLatLng();
                    onPositionChange({ lat: latLng.lat, lng: latLng.lng });
                }
            },
        }),
        [onPositionChange]
    );

    return position ? (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={draggableIcon}
        >
            <Popup>Drag to refine location</Popup>
        </Marker>
    ) : null;
};

// Component to change map view when props change
const MapUpdater = ({ center }) => {
    const map = useMapEvents({});
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const InteractiveMapPicker = ({ latitude, longitude, onLocationChange }) => {
    // Default to Dhaka if no coords
    const defaultCenter = [23.8103, 90.4125];
    
    // Parse input coords safely
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng);
    
    const center = hasValidCoords ? [lat, lng] : defaultCenter;

    const handlePositionChange = (newPos) => {
        // Round to 6 decimal places for precision without excessive length
        const newLat = parseFloat(newPos.lat.toFixed(6));
        const newLng = parseFloat(newPos.lng.toFixed(6));
        onLocationChange(newLat, newLng);
    };

    return (
        <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-zinc-400">
                    Pinpoint Location (Map Picker)
                </label>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-white/5 px-2 py-1 rounded">
                    <MapPin size={12} className="text-brand-gold" />
                    <span>Drag marker to adjust</span>
                </div>
            </div>

            <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-white/10 z-[1] bg-zinc-800">
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                        position={hasValidCoords ? center : null} 
                        onPositionChange={handlePositionChange} 
                    />
                    <MapUpdater center={center} />
                </MapContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/20 rounded px-3 py-2 border border-white/5">
                    <span className="block text-[8px] text-zinc-500 uppercase font-black mb-0.5">Latitude</span>
                    <span className="text-xs text-zinc-300 font-mono">{hasValidCoords ? lat : 'Not set'}</span>
                </div>
                <div className="bg-black/20 rounded px-3 py-2 border border-white/5">
                    <span className="block text-[8px] text-zinc-500 uppercase font-black mb-0.5">Longitude</span>
                    <span className="text-xs text-zinc-300 font-mono">{hasValidCoords ? lng : 'Not set'}</span>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMapPicker;
