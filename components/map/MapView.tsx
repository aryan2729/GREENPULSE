'use client';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from 'react-leaflet';
import { useEffect, useState, useCallback } from 'react';
import L from 'leaflet';
import { Park } from '@/data/parks';
import { useStore } from '@/store/useStore';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(59,130,246,0.18),0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function mkMarker(park: Park, selected: boolean) {
  const c = park.crowd === 'low' ? '#16a34a' : park.crowd === 'medium' ? '#d97706' : '#dc2626';
  const sz = selected ? 52 : 40;
  const glow = selected
    ? `box-shadow:0 0 0 6px ${c}28,0 4px 20px rgba(0,0,0,0.4);border:3px solid white;`
    : `box-shadow:0 3px 12px rgba(0,0,0,0.3);border:2.5px solid white;`;
  return L.divIcon({
    html: `<div style="width:${sz}px;height:${sz}px;background:${c};border-radius:50% 50% 50% 4px;transform:rotate(-45deg);${glow}display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:${selected ? 22 : 17}px;display:block;line-height:1;">${park.image}</span>
    </div>`,
    className: '',
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz],
    popupAnchor: [0, -(sz + 4)],
  });
}

// Flies to park when selectedPark changes
function FlyTo({ park }: { park: Park | null }) {
  const map = useMap();
  useEffect(() => {
    if (park) {
      map.flyTo([park.lat, park.lng], 15, { duration: 1.0, easeLinearity: 0.2 });
    }
  }, [map, park?.id]);
  return null;
}

function LocateMe({ onFound }: { onFound: (ll: [number, number]) => void }) {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: false });
    const h = (e: L.LocationEvent) => onFound([e.latlng.lat, e.latlng.lng]);
    map.on('locationfound', h);
    return () => { map.off('locationfound', h); };
  }, [map, onFound]);
  return null;
}

// Invalidates map size after panel open/close (fixes grey tiles)
function InvalidateOnChange({ dep }: { dep: boolean }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map, dep]);
  return null;
}

export default function MapView({ parks }: { parks: Park[] }) {
  const { selectedPark, setSelectedPark, addPoints, markVisited, darkMode } = useStore();
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const onFound = useCallback((ll: [number, number]) => setUserLoc(ll), []);

  const pick = (p: Park) => { setSelectedPark(p); markVisited(p.id); addPoints(10); };
  const crowdColor = (c: string) => c === 'low' ? '#16a34a' : c === 'medium' ? '#d97706' : '#dc2626';

  // Dark map tiles
  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <MapContainer
      center={[28.5800, 77.2100]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer url={tileUrl} attribution='© OpenStreetMap contributors' />
      <ZoomControl position="bottomright" />
      <FlyTo park={selectedPark} />
      <LocateMe onFound={onFound} />
      <InvalidateOnChange dep={!!selectedPark} />

      {/* User location */}
      {userLoc && (
        <>
          <Circle center={userLoc} radius={250} color="#3b82f6" fillColor="#3b82f6" fillOpacity={0.12} weight={1.5} />
          <Marker position={userLoc} icon={userIcon}>
            <Popup>
              <div style={{ fontFamily: 'Outfit,sans-serif', padding: '4px', minWidth: 130 }}>
                <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: 13 }}>📍 Your Location</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Current GPS position</div>
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {/* Parks */}
      {parks.map(p => (
        <div key={p.id}>
          <Circle
            center={[p.lat, p.lng]} radius={400}
            color={crowdColor(p.crowd)} fillColor={crowdColor(p.crowd)}
            fillOpacity={0.09} weight={1.5}
          />
          <Marker
            position={[p.lat, p.lng]}
            icon={mkMarker(p, selectedPark?.id === p.id)}
            eventHandlers={{ click: () => pick(p) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Outfit,sans-serif', padding: '8px 4px', minWidth: 220 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{p.image}</div>
                <div style={{ fontWeight: 900, fontSize: 16, color: '#111', marginBottom: 2 }}>{p.name}</div>
                <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 10 }}>
                  📍 {p.area} &nbsp;·&nbsp; ⭐ {p.rating} &nbsp;·&nbsp; ⏰ {p.openTime}–{p.closeTime}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                  {[
                    { l: 'Crowd', v: `${p.crowdPct}%`, c: crowdColor(p.crowd), bg: p.crowd === 'low' ? '#f0fdf4' : p.crowd === 'medium' ? '#fffbeb' : '#fef2f2' },
                    { l: 'AQI', v: `${p.aqi}`, c: p.aqi < 50 ? '#16a34a' : p.aqi < 100 ? '#d97706' : '#dc2626', bg: p.aqi < 50 ? '#f0fdf4' : p.aqi < 100 ? '#fffbeb' : '#fef2f2' },
                    { l: 'Safety', v: `${p.safetyScore}`, c: '#7c3aed', bg: '#f5f3ff' },
                  ].map(m => (
                    <div key={m.l} style={{ background: m.bg, borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: 15, color: m.c }}>{m.v}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {p.womenSafe     && <span style={{ fontSize: 10, background: '#f5f3ff', color: '#7c3aed', borderRadius: 99, padding: '3px 8px', fontWeight: 700 }}>👩 Women Safe</span>}
                  {p.childFriendly && <span style={{ fontSize: 10, background: '#fffbeb', color: '#d97706', borderRadius: 99, padding: '3px 8px', fontWeight: 700 }}>👶 Kids</span>}
                  {p.accessible    && <span style={{ fontSize: 10, background: '#eff6ff', color: '#2563eb', borderRadius: 99, padding: '3px 8px', fontWeight: 700 }}>♿ Access</span>}
                  {p.darkZones     && <span style={{ fontSize: 10, background: '#fef2f2', color: '#dc2626', borderRadius: 99, padding: '3px 8px', fontWeight: 700 }}>⚠️ Dark Zone</span>}
                </div>
                <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6, marginBottom: 10 }}>{p.description.slice(0, 100)}…</p>
                <button
                  onClick={() => pick(p)}
                  style={{ width: '100%', background: 'linear-gradient(135deg,#16a34a,#059669)', color: 'white', border: 'none', borderRadius: 12, padding: '11px 0', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}
                >
                  View Full Details →
                </button>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
