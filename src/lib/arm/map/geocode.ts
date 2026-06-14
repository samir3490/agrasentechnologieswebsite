const MAPBOX_GEOCODE = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export function isMapboxConfigured() {
  return Boolean(getMapboxToken());
}

export function getMapboxToken() {
  return process.env.MAPBOX_ACCESS_TOKEN?.trim() || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();
}

export function getPublicMapboxToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() || process.env.MAPBOX_ACCESS_TOKEN?.trim();
}

export async function geocodePlace(city?: string, state?: string, country?: string) {
  const token = getMapboxToken();
  if (!token) return null;

  const query = [city, state, country].filter(Boolean).join(", ");
  if (!query.trim()) return null;

  const url = `${MAPBOX_GEOCODE}/${encodeURIComponent(query)}.json?access_token=${token}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    features?: { center?: [number, number]; place_name?: string }[];
  };

  const feature = data.features?.[0];
  if (!feature?.center) return null;

  return {
    lng: feature.center[0],
    lat: feature.center[1],
    placeName: feature.place_name,
  };
}

export async function enrichContactLocation(location?: {
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
}) {
  if (!location) return undefined;
  if (location.lat != null && location.lng != null) return location;
  if (!location.city && !location.state) return location;

  const geo = await geocodePlace(location.city, location.state, location.country);
  if (!geo) return location;

  return {
    ...location,
    lat: geo.lat,
    lng: geo.lng,
  };
}
