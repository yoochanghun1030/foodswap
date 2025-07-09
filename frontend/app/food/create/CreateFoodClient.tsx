// frontend/app/food/create/CreateFoodClient.tsx

'use client';

import { useState } from 'react';
import axios from '@/utils/axios';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

function LocationMarker({
                            setPosition,
                        }: {
    setPosition: (pos: [number, number]) => void;
}) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function CreateFoodClient() {
    const [title, setTitle] = useState('');
    const [nutrition, setNutrition] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState<string>('pcs');
    const [position, setPosition] = useState<[number, number]>([
        53.3498,
        -6.2603,
    ]);
    const [availableFrom, setAvailableFrom] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [availableUntil, setAvailableUntil] = useState<string>(
        new Date(Date.now() + 3_600_000).toISOString().slice(0, 16)
    );
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>('');

    const fetchNutrition = async () => {
        if (!title.trim()) {
            return alert('Please enter a product name or barcode.');
        }
        try {
            const res = await fetch(
                `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
                    title
                )}.json`
            );
            const data = await res.json();
            if (data.status === 1) {
                setNutrition(JSON.stringify(data.product.nutriments, null, 2));
                setCategory(data.product.categories_tags?.[0] ?? '');
                setImageUrl(data.product.image_url ?? '');
            } else {
                alert('❌ Product not found in OpenFoodFacts');
            }
        } catch {
            alert('🚨 Failed to fetch data');
        }
    };

    const handleSubmit = async () => {
        if (!title || !quantity || !unit) {
            return alert('⚠️ Title, quantity and unit are required.');
        }
        try {
            const formData = new FormData();
            const food = {
                title,
                category,
                nutritionFacts: nutrition,
                imageUrl,
                quantity,
                unit,
                latitude: position[0],
                longitude: position[1],
                availableFrom,
                availableUntil,
            };
            formData.append(
                'food',
                new Blob([JSON.stringify(food)], { type: 'application/json' })
            );
            if (file) {
                formData.append('imageFile', file);
            }
            await axios.post('/food', formData);
            alert('✅ Registration successful!');

            // 폼 초기화
            setTitle('');
            setCategory('');
            setNutrition('');
            setImageUrl('');
            setQuantity(1);
            setUnit('pcs');
            setFile(null);
            setFilePreview('');
        } catch {
            alert('❌ Registration failed.');
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
            <h1>🍱 Food Registration</h1>

            <div>
                <label>Food name or barcode:</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button onClick={fetchNutrition}>Fetch from OpenFoodFacts</button>
                <button
                    onClick={() =>
                        window.open('https://world.openfoodfacts.org', '_blank')
                    }
                    style={{ marginLeft: 10 }}
                >
                    Go to OpenFoodFacts
                </button>
            </div>

            <div>
                <label>Category:</label>
                <input value={category} readOnly />
            </div>

            <div>
                <label>Nutritional Info (JSON):</label>
                <textarea value={nutrition} readOnly rows={6} style={{ width: '100%' }} />
            </div>

            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>

            <div>
                <label>Available From:</label>
                <input
                    type="datetime-local"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                />
            </div>
            <div>
                <label>Available Until:</label>
                <input
                    type="datetime-local"
                    value={availableUntil}
                    onChange={(e) => setAvailableUntil(e.target.value)}
                />
            </div>

            <div>
                <label>Unit:</label>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>

            {!filePreview && imageUrl && (
                <img src={imageUrl} alt="food preview" width={200} />
            )}

            <div style={{ marginTop: 16 }}>
                <label>Upload your own photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setFile(f);
                        setFilePreview(f ? URL.createObjectURL(f) : '');
                    }}
                />
                {filePreview && (
                    <img
                        src={filePreview}
                        alt="preview"
                        style={{ display: 'block', marginTop: 8, maxWidth: 200 }}
                    />
                )}
            </div>

            <h3>📍 Location</h3>
            <MapContainer
                center={position as LatLngExpression}
                zoom={13}
                style={{ height: '300px' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position as LatLngExpression} />
                <LocationMarker setPosition={setPosition} />
            </MapContainer>

            <button onClick={handleSubmit} style={{ marginTop: 20 }}>
                ✅ Register Food
            </button>
        </div>
    );
}
