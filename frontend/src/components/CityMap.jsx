import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext.jsx'
import { StatusBadge } from './ui.jsx'

const BIRZEIT_CENTER = [31.9733, 35.1964]

const STATUS_COLORS = {
  CERTIFIED: '#059669',
  CONDITIONAL: '#D97706',
  NOT_CERTIFIED: '#DC2626',
}

function createIcon(color, label = '') {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:28px;height:28px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:700;color:white;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

const housingIcon = (status) => createIcon(STATUS_COLORS[status] || STATUS_COLORS.NOT_CERTIFIED, 'H')
const businessIcon = (certified) => createIcon(certified ? STATUS_COLORS.CERTIFIED : '#94A3B8', 'B')
const routeColors = {
  CERTIFIED: '#059669',
  CONDITIONAL: '#D97706',
  NOT_CERTIFIED: '#DC2626',
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 15 })
    }
  }, [map, points])
  return null
}

export function CityMap({
  housing = [],
  businesses = [],
  routes = [],
  filters = { housing: true, businesses: true, routes: true, problems: false },
  height = '400px',
  onMarkerClick,
  selectedId,
  className = '',
  showLegend = true,
  demoLabel = true,
}) {
  const { t, theme, city } = useApp()
  const center = city?.mapCenter?.length === 2 ? city.mapCenter : BIRZEIT_CENTER

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const allPoints = useMemo(() => {
    const pts = []
    if (filters.housing) housing.forEach((h) => h.lat && pts.push([h.lat, h.lng]))
    if (filters.businesses) businesses.forEach((b) => b.lat && pts.push([b.lat, b.lng]))
    if (filters.routes) routes.forEach((r) => r.path?.forEach((p) => pts.push(p)))
    return pts
  }, [housing, businesses, routes, filters])

  const problemHousing = filters.problems
    ? housing.filter((h) => h.status !== 'CERTIFIED')
    : []

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}>
      {demoLabel && (
        <div className="absolute top-3 start-3 z-[1000] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-[10px] font-semibold text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-600">
          {t({ ar: 'بيانات تجريبية — نموذج أولي', en: 'Demo data — prototype' })}
        </div>
      )}

      <MapContainer
        center={center}
        zoom={14}
        style={{ height, width: '100%' }}
        scrollWheelZoom
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        <MapResizer />
        {allPoints.length > 1 && <FitBounds points={allPoints} />}

        {filters.housing && housing.map((h) => h.lat && (
          <Marker
            key={h.id}
            position={[h.lat, h.lng]}
            icon={housingIcon(h.status)}
            eventHandlers={{
              click: () => onMarkerClick?.({ type: 'housing', data: h }),
            }}
          >
            <Popup>
              <MapPopupContent
                name={t(h.name)}
                status={h.status}
                score={h.score}
                extra={t(h.provider)}
                onView={() => onMarkerClick?.({ type: 'housing', data: h })}
                t={t}
              />
            </Popup>
          </Marker>
        ))}

        {filters.businesses && businesses.map((b) => b.lat && (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={businessIcon(b.certified)}
          >
            <Popup>
              <MapPopupContent
                name={t(b.name)}
                status={b.certified ? 'CERTIFIED' : 'NOT_CERTIFIED'}
                extra={t(b.category)}
                t={t}
              />
            </Popup>
          </Marker>
        ))}

        {filters.routes && routes.map((r) => r.path && (
          <Polyline
            key={r.id}
            positions={r.path}
            pathOptions={{
              color: routeColors[r.status] || routeColors.CONDITIONAL,
              weight: 4,
              opacity: 0.85,
              dashArray: r.status === 'CONDITIONAL' ? '8 6' : undefined,
            }}
          />
        ))}

        {filters.problems && problemHousing.map((h) => h.lat && (
          <Marker
            key={`prob-${h.id}`}
            position={[h.lat, h.lng]}
            icon={createIcon('#DC2626', '!')}
          >
            <Popup>
              <MapPopupContent
                name={t(h.name)}
                status={h.status}
                score={h.score}
                extra={t({ ar: 'يحتاج تدخل', en: 'Needs intervention' })}
                t={t}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showLegend && (
        <div className="absolute bottom-3 end-3 z-[1000] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-600 p-3 text-xs space-y-1.5 shadow-card">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t({ ar: 'دليل الخريطة', en: 'Map Legend' })}
          </div>
          {[
            { color: STATUS_COLORS.CERTIFIED, label: { ar: 'معتمد', en: 'Certified' } },
            { color: STATUS_COLORS.CONDITIONAL, label: { ar: 'بحاجة لتحسين', en: 'Needs Improvement' } },
            { color: STATUS_COLORS.NOT_CERTIFIED, label: { ar: 'أولوية عالية', en: 'High Priority' } },
          ].map((item) => (
            <div key={item.color} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
              {t(item.label)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MapPopupContent({ name, status, score, extra, onView, t }) {
  return (
    <div className="min-w-[180px] p-1">
      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{name}</div>
      {extra && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{extra}</div>}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <StatusBadge status={status} size="sm" />
        {score != null && (
          <span className="font-mono-data text-xs text-slate-700 dark:text-slate-300">{score}/100</span>
        )}
      </div>
      {onView && (
        <button
          onClick={onView}
          className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          {t({ ar: 'عرض التفاصيل', en: 'View details' })}
        </button>
      )}
    </div>
  )
}

export { BIRZEIT_CENTER, STATUS_COLORS, routeColors }
