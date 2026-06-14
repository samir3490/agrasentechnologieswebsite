"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import type { Contact } from "@/lib/arm/types";
import "mapbox-gl/dist/mapbox-gl.css";

type MapContact = Contact & { location?: { lat?: number; lng?: number; city?: string; state?: string; country?: string } };

export default function NetworkMapPage() {
  const { currentAccount, getIdToken } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const [contacts, setContacts] = useState<MapContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const res = await fetch(armApi(`/accounts/${currentAccount.id}/contacts`), {
        headers: { Authorization: `Bearer ${await getIdToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
      setLoading(false);
    })();
  }, [currentAccount, getIdToken]);

  const mapped = useMemo(
    () => contacts.filter((c) => c.location?.lat != null && c.location?.lng != null),
    [contacts]
  );
  const unmapped = useMemo(
    () => contacts.filter((c) => !c.location?.lat && (c.location?.city || c.location?.country)),
    [contacts]
  );

  useEffect(() => {
    if (!token || !mapContainer.current || mapped.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        mapboxgl.accessToken = token;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/light-v11",
          center: [mapped[0]!.location!.lng!, mapped[0]!.location!.lat!],
          zoom: 4,
        });

        mapRef.current = map;

        const bounds = new mapboxgl.LngLatBounds();

        for (const c of mapped) {
          const { lat, lng } = c.location!;
          bounds.extend([lng!, lat!]);
          const el = document.createElement("div");
          el.className = "h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-white shadow";
          new mapboxgl.Marker(el)
            .setLngLat([lng!, lat!])
            .setPopup(
              new mapboxgl.Popup({ offset: 12 }).setHTML(
                `<strong>${c.firstName} ${c.lastName ?? ""}</strong><br/>${[c.location?.city, c.location?.country].filter(Boolean).join(", ")}`
              )
            )
            .addTo(map);
        }

        if (mapped.length > 1) map.fitBounds(bounds, { padding: 48, maxZoom: 10 });

        if (cancelled) map.remove();
      } catch (e) {
        setMapError(e instanceof Error ? e.message : "Map failed to load");
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token, mapped]);

  const byCity = groupByCity(contacts);
  const byType = groupByType(contacts);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Network map</h1>
        <p className="text-slate-500">See where your contacts are and how your network is spread</p>
      </div>

      {!token ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-amber-800 bg-amber-50/80 border border-amber-100">
          Map requires <code className="text-xs">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> on Vercel. Contacts
          with city/state are still listed below. Add a Mapbox token and redeploy to enable the interactive map.
        </div>
      ) : mapped.length === 0 && !loading ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-slate-600">
          No geocoded contacts yet. Add <strong>city</strong> (and state/country) to contacts — locations are
          geocoded automatically when Mapbox is configured.
        </div>
      ) : (
        <div
          ref={mapContainer}
          className="glass-card h-[420px] w-full overflow-hidden rounded-2xl"
          aria-label="Contact map"
        />
      )}

      {mapError && <p className="text-sm text-red-600">{mapError}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <NetworkSummary title="By city" items={byCity} />
        <NetworkSummary title="By relationship type" items={byType} />
      </div>

      {unmapped.length > 0 && (
        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold">Awaiting geocode ({unmapped.length})</h2>
          <p className="mt-1 text-sm text-slate-500">Has location text but no map pin yet</p>
          <ul className="mt-3 space-y-1 text-sm">
            {unmapped.slice(0, 15).map((c) => (
              <li key={c.id}>
                <Link href={`${armPath("/contacts")}/${c.id}`} className="text-indigo-600 hover:underline">
                  {c.firstName} {c.lastName}
                </Link>
                {" — "}
                {[c.location?.city, c.location?.state, c.location?.country].filter(Boolean).join(", ")}
              </li>
            ))}
          </ul>
        </section>
      )}

      {loading && <p className="text-sm text-slate-500">Loading contacts...</p>}
    </div>
  );
}

function groupByCity(contacts: MapContact[]) {
  const counts = new Map<string, number>();
  for (const c of contacts) {
    const key =
      [c.location?.city, c.location?.state, c.location?.country].filter(Boolean).join(", ") || "Unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function groupByType(contacts: MapContact[]) {
  const counts = new Map<string, number>();
  for (const c of contacts) {
    for (const t of c.relationshipTypes || []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

function NetworkSummary({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  const max = items[0]?.count ?? 1;
  return (
    <section className="glass-card rounded-2xl p-6">
      <h2 className="font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No data yet</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.slice(0, 12).map((item) => (
            <li key={item.label} className="flex items-center gap-3 text-sm">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }}
                />
              </div>
              <span className="w-28 shrink-0 capitalize text-slate-600">{item.label}</span>
              <span className="w-6 text-right font-medium text-slate-900">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
