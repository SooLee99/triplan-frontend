import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context";
import { SAMPLE_PLACES, haversine } from "../store";
import {
  ChevronLeft,
  Check,
  Clock,
  Star,
  MapPin,
  Sparkles,
  Search,
  Navigation,
  ChevronRight,
  Map as MapIcon,
  List,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const DAY_COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#0d9488",
];
const DAY_BG_CLASSES = [
  "bg-blue-600",
  "bg-green-600",
  "bg-amber-600",
  "bg-red-600",
  "bg-purple-600",
  "bg-cyan-600",
  "bg-teal-600",
];
const DAY_BORDER_CLASSES = [
  "border-blue-600",
  "border-green-600",
  "border-amber-600",
  "border-red-600",
  "border-purple-600",
  "border-cyan-600",
  "border-teal-600",
];
const DAY_SURFACE_CLASSES = [
  "bg-blue-50",
  "bg-green-50",
  "bg-amber-50",
  "bg-red-50",
  "bg-purple-50",
  "bg-cyan-50",
  "bg-teal-50",
];

export function PlacesScreen() {
  const navigate = useNavigate();
  const {
    selectedPlacesByDay,
    togglePlaceForDay,
    planMode,
    buildAllSchedules,
    daySchedules,
    dayCount,
  } = useApp();

  const [loading, setLoading] = useState(planMode !== "manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "map">(
    "list",
  );

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const normalizedSelectedPlacesByDay = useMemo(() => {
    return Array.from(
      { length: dayCount },
      (_, i) => selectedPlacesByDay?.[i] ?? [],
    );
  }, [selectedPlacesByDay, dayCount]);

  const activeSelectedPlaces =
    normalizedSelectedPlacesByDay[activeDay] ?? [];
  const totalSelectedCount =
    normalizedSelectedPlacesByDay.reduce(
      (sum, places) => sum + places.length,
      0,
    );

  const currentDep = daySchedules[activeDay]?.departure;
  const currentStartHour =
    daySchedules[activeDay]?.startHour ?? 9;

  const sortedPlaces = useMemo(() => {
    if (!currentDep) return SAMPLE_PLACES;
    return [...SAMPLE_PLACES].sort((a, b) => {
      const distA = haversine(
        currentDep.lat,
        currentDep.lng,
        a.lat,
        a.lng,
      );
      const distB = haversine(
        currentDep.lat,
        currentDep.lng,
        b.lat,
        b.lng,
      );
      return distA - distB;
    });
  }, [currentDep, activeDay]);

  const filtered = searchQuery
    ? sortedPlaces.filter(
        (p) =>
          p.name.includes(searchQuery) ||
          p.category.includes(searchQuery),
      )
    : sortedPlaces;

  const handleNext = () => {
    buildAllSchedules(normalizedSelectedPlacesByDay);
    navigate("/editor");
  };

  const handleTogglePlace = (place: any) => {
    togglePlaceForDay(activeDay, place);
  };

  const isSelectedInActiveDay = (placeId: string) => {
    return activeSelectedPlaces.some((p) => p.id === placeId);
  };

  const getDistLabel = (lat: number, lng: number) => {
    if (!currentDep) return "";
    const km = haversine(
      currentDep.lat,
      currentDep.lng,
      lat,
      lng,
    );
    return km < 1
      ? `${Math.round(km * 1000)}m`
      : `${km.toFixed(1)}km`;
  };

  const allCoords = filtered.map((p) => ({
    lat: p.lat,
    lng: p.lng,
  }));
  if (currentDep)
    allCoords.push({
      lat: currentDep.lat,
      lng: currentDep.lng,
    });

  const minLat = Math.min(...allCoords.map((c) => c.lat));
  const maxLat = Math.max(...allCoords.map((c) => c.lat));
  const minLng = Math.min(...allCoords.map((c) => c.lng));
  const maxLng = Math.max(...allCoords.map((c) => c.lng));

  const mapWidth = 400;
  const mapHeight = 250;
  const padding = 30;

  const latToY = (lat: number) => {
    if (maxLat === minLat) return mapHeight / 2;
    return (
      padding +
      ((maxLat - lat) / (maxLat - minLat)) *
        (mapHeight - padding * 2)
    );
  };

  const lngToX = (lng: number) => {
    if (maxLng === minLng) return mapWidth / 2;
    return (
      padding +
      ((lng - minLng) / (maxLng - minLng)) *
        (mapWidth - padding * 2)
    );
  };

  const activeDayColor =
    DAY_COLORS[activeDay % DAY_COLORS.length];
  const activeDayBgClass =
    DAY_BG_CLASSES[activeDay % DAY_BG_CLASSES.length];
  const activeDayBorderClass =
    DAY_BORDER_CLASSES[activeDay % DAY_BORDER_CLASSES.length];
  const activeDaySurfaceClass =
    DAY_SURFACE_CLASSES[activeDay % DAY_SURFACE_CLASSES.length];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <p
              className="text-gray-400"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              STEP 5
            </p>
            <h2
              style={{ fontSize: "1.25rem", fontWeight: 700 }}
            >
              {planMode === "ai"
                ? "AI 추천 장소"
                : planMode === "manual"
                  ? "장소 검색"
                  : "AI 추천 + 직접 추가"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              setViewMode(viewMode === "map" ? "list" : "map")
            }
            className="bg-gray-100 p-2 rounded-full"
          >
            {viewMode === "map" ? (
              <List className="w-5 h-5 text-gray-700" />
            ) : (
              <MapIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              backgroundColor: `${activeDayColor}20`,
              color: activeDayColor,
            }}
          >
            Day {activeDay + 1} {activeSelectedPlaces.length}개
            / 전체 {totalSelectedCount}개
          </div>
        </div>
      </div>

      {daySchedules.length > 1 && (
        <div className="px-6 mt-2 mb-1">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {daySchedules.map((_, i) => {
              const daySelectedCount =
                normalizedSelectedPlacesByDay[i]?.length ?? 0;

              return (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-left transition-all ${
                    activeDay === i
                      ? "text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    backgroundColor:
                      activeDay === i
                        ? DAY_COLORS[i % DAY_COLORS.length]
                        : undefined,
                  }}
                >
                  Day {i + 1} · {daySelectedCount}개
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentDep && currentDep.name && (
        <div className="mx-6 mt-2 mb-1 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl">
          <Navigation className="w-3.5 h-3.5 text-green-600" />
          <span
            className="text-green-700"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            Day {activeDay + 1} 출발지:{" "}
            <strong>{currentDep.name}</strong> 기준 가까운 순
          </span>
        </div>
      )}

      <div
        className="relative w-full shrink-0"
        style={{
          height: viewMode === "map" ? "40vh" : "200px",
        }}
      >
        <div className="absolute inset-0 bg-blue-50 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(#93c5fd 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.5,
            }}
          />

          <svg
            className="w-full h-full"
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            preserveAspectRatio="xMidYMid slice"
          >
            {activeSelectedPlaces.map((place, idx) => {
              if (idx === 0 && currentDep) {
                return (
                  <line
                    key="line-dep"
                    x1={lngToX(currentDep.lng)}
                    y1={latToY(currentDep.lat)}
                    x2={lngToX(place.lng)}
                    y2={latToY(place.lat)}
                    stroke={activeDayColor}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.6"
                  />
                );
              }

              if (idx > 0) {
                const prev = activeSelectedPlaces[idx - 1];
                return (
                  <line
                    key={`line-${idx}`}
                    x1={lngToX(prev.lng)}
                    y1={latToY(prev.lat)}
                    x2={lngToX(place.lng)}
                    y2={latToY(place.lat)}
                    stroke={activeDayColor}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.6"
                  />
                );
              }

              return null;
            })}

            {filtered.map((place) => {
              if (isSelectedInActiveDay(place.id)) return null;

              return (
                <g key={`unselected-${place.id}`}>
                  <circle
                    cx={lngToX(place.lng)}
                    cy={latToY(place.lat)}
                    r="6"
                    fill="#cbd5e1"
                    stroke="white"
                    strokeWidth="2"
                  />
                  {viewMode === "map" && (
                    <text
                      x={lngToX(place.lng)}
                      y={latToY(place.lat) + 14}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {place.name.slice(0, 5)}
                    </text>
                  )}
                </g>
              );
            })}

            {activeSelectedPlaces.map((place, idx) => (
              <g key={`selected-${place.id}`}>
                <circle
                  cx={lngToX(place.lng)}
                  cy={latToY(place.lat)}
                  r="8"
                  fill={activeDayColor}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={lngToX(place.lng)}
                  y={latToY(place.lat) + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>
                <text
                  x={lngToX(place.lng)}
                  y={latToY(place.lat) + 16}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {place.name.slice(0, 5)}
                </text>
              </g>
            ))}

            {currentDep && (
              <g>
                <rect
                  x={lngToX(currentDep.lng) - 8}
                  y={latToY(currentDep.lat) - 8}
                  width="16"
                  height="16"
                  rx="4"
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={lngToX(currentDep.lng)}
                  y={latToY(currentDep.lat) + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                >
                  출
                </text>
                <text
                  x={lngToX(currentDep.lng)}
                  y={latToY(currentDep.lat) - 12}
                  textAnchor="middle"
                  fill="#166534"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {currentDep.name.slice(0, 4)}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow-sm border border-gray-100 flex items-center gap-1 cursor-pointer"
          onClick={() =>
            setViewMode(viewMode === "map" ? "list" : "map")
          }
        >
          <span
            style={{ fontSize: "0.75rem", fontWeight: 600 }}
            className="text-gray-600"
          >
            {viewMode === "map" ? "지도 축소" : "지도 확대"}
          </span>
        </div>
      </div>

      <div className="px-6 py-3">
        <div className="bg-gray-100 rounded-xl flex items-center gap-2 px-4 py-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Day ${activeDay + 1} 장소 검색...`}
            className="bg-transparent outline-none flex-1 text-gray-900 placeholder:text-gray-400"
            style={{ fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <p
            className="text-gray-500"
            style={{ fontSize: "0.9rem", fontWeight: 500 }}
          >
            AI가 출발지 기반 최적 장소를 찾고 있어요...
          </p>
        </div>
      ) : (
        <div className="flex-1 px-6 overflow-y-auto pb-4 space-y-3">
          {planMode !== "manual" && (
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span
                className="text-blue-500"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                출발지에서 가까운 순으로 정렬 · Day{" "}
                {activeDay + 1}만 선택
              </span>
            </div>
          )}

          {filtered.map((place, idx) => {
            const selected = isSelectedInActiveDay(place.id);
            const dist = getDistLabel(place.lat, place.lng);

            return (
              <button
                key={`${activeDay}-${place.id}`}
                onClick={() => handleTogglePlace(place)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                  selected
                    ? `${activeDayBorderClass} ${activeDaySurfaceClass}`
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <ImageWithFallback
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />

                  {selected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${activeDayBgClass}`}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className="absolute top-1 left-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center"
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                      className="truncate"
                    >
                      {place.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-gray-400 flex items-center gap-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <MapPin className="w-3 h-3" />
                      {place.category}
                    </span>
                    <span
                      className="text-gray-400 flex items-center gap-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Clock className="w-3 h-3" />
                      {place.duration}분
                    </span>
                    <span
                      className="text-amber-500 flex items-center gap-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <Star className="w-3 h-3 fill-amber-500" />
                      {place.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-gray-400 truncate"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {place.address}
                    </span>
                    {dist && (
                      <span
                        className="flex-shrink-0 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 600,
                        }}
                      >
                        {dist}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          disabled={totalSelectedCount < 2}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 ${
            totalSelectedCount >= 2
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          일정 생성하기 (전체 {totalSelectedCount}개 장소)
          {totalSelectedCount >= 2 && (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}