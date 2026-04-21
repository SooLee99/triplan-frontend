import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useApp } from "../context";
import { MAP_LOCATION_ITEMS } from "../data/mapLocations";
import { type Place } from "../store";
import {
  ChevronLeft,
  Search,
  MapPin,
  Navigation,
} from "lucide-react";

function formatDistance(lat: number, lng: number) {
  const centerLat = 35.6812;
  const centerLng = 139.7671;
  const latDiff = lat - centerLat;
  const lngDiff = lng - centerLng;
  const roughKm = Math.sqrt(
    (latDiff * 111) ** 2 + (lngDiff * 88) ** 2,
  );
  return `${roughKm.toFixed(1)}km`;
}

function getMapBounds() {
  const lats = MAP_LOCATION_ITEMS.map((item) => item.lat);
  const lngs = MAP_LOCATION_ITEMS.map((item) => item.lng);

  return {
    minLat: Math.min(...lats) - 0.02,
    maxLat: Math.max(...lats) + 0.02,
    minLng: Math.min(...lngs) - 0.02,
    maxLng: Math.max(...lngs) + 0.02,
  };
}

export function MapSearchScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {
    updateDayArrival,
    updateDayDeparture,
    replacePlace,
    addPlace,
    setCurrentDay,
  } = useApp();

  const typeParam = params.get("type");
  const type =
    typeParam === "arrival"
      ? "arrival"
      : typeParam === "place"
        ? "place"
        : "departure";

  const day = Number(params.get("day") ?? 0);
  const safeDay = Number.isNaN(day) ? 0 : day;
  const placeId = params.get("placeId");
  const returnTo = params.get("returnTo") || "/departure";
  const selectedId = params.get("selectedId");

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return (
      MAP_LOCATION_ITEMS.find(
        (item) => item.id === selectedId,
      ) ?? null
    );
  }, [selectedId]);

  const bounds = useMemo(() => getMapBounds(), []);

  const getMarkerPosition = (lat: number, lng: number) => {
    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lngRange = bounds.maxLng - bounds.minLng || 1;

    const topPercent = ((bounds.maxLat - lat) / latRange) * 100;
    const leftPercent =
      ((lng - bounds.minLng) / lngRange) * 100;

    return {
      top: `${Math.min(92, Math.max(8, topPercent))}%`,
      left: `${Math.min(92, Math.max(8, leftPercent))}%`,
    };
  };

  const openSearchPage = () => {
    const searchParams = new URLSearchParams();

    searchParams.set("type", type);
    searchParams.set("day", String(safeDay));
    searchParams.set("returnTo", returnTo);

    if (placeId) {
      searchParams.set("placeId", placeId);
    }

    if (selectedId) {
      searchParams.set("selectedId", selectedId);
    }

    navigate(`/place-search?${searchParams.toString()}`);
  };

  const handleBack = () => {
    navigate(returnTo);
  };

  const handleConfirm = () => {
    if (!selectedItem) return;

    const { id, name, lat, lng, category, address } =
      selectedItem;
    const point = { name, lat, lng };

    if (type === "place" && placeId) {
      const newPlace: Place = {
        id: `map-${id}`,
        name,
        lat,
        lng,
        category,
        address,
        image:
          "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        duration: 60,
        isIndoor:
          category === "쇼핑" ||
          category === "역" ||
          category === "공항",
        rating: 4.3,
      };

      replacePlace(placeId, newPlace);
    } else if (type === "arrival") {
      updateDayArrival(safeDay, point);
    } else {
      updateDayDeparture(safeDay, point);
    }

    navigate(returnTo, { replace: returnTo === "/editor" });
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#2563eb_1px,transparent_1px),linear-gradient(to_bottom,#2563eb_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="absolute left-4 right-4 top-12 z-30 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="h-10 w-10 rounded-full bg-white/95 shadow-sm flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <button
          type="button"
          onClick={openSearchPage}
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm flex items-center gap-2 text-left"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span
            className={
              selectedItem ? "text-gray-800" : "text-gray-400"
            }
            style={{ fontSize: "0.86rem" }}
          >
            {selectedItem
              ? selectedItem.name
              : "장소명 또는 주소로 검색"}
          </span>
        </button>
      </div>

      {MAP_LOCATION_ITEMS.map((item) => {
        const position = getMarkerPosition(item.lat, item.lng);
        const isSelected = selectedItem?.id === item.id;

        return (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={position}
          >
            <div className="relative flex flex-col items-center">
              {isSelected && (
                <div className="mb-2 rounded-full bg-white px-3 py-1 shadow-md border border-blue-100">
                  <span
                    className="text-blue-700"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              )}

              <div
                className={`rounded-full shadow-md border flex items-center justify-center transition-all ${
                  isSelected
                    ? "w-11 h-11 bg-blue-600 border-blue-600"
                    : "w-9 h-9 bg-white border-white"
                }`}
              >
                <MapPin
                  className={
                    isSelected
                      ? "w-5 h-5 text-white"
                      : "w-4 h-4 text-blue-600"
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      {selectedItem ? (
        <div className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-gray-100 bg-white p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-gray-900"
                style={{ fontSize: "0.95rem", fontWeight: 700 }}
              >
                {selectedItem.name}
              </p>
              <p
                className="text-gray-500 mt-1"
                style={{ fontSize: "0.76rem", lineHeight: 1.5 }}
              >
                {selectedItem.address}
              </p>
              <div
                className="flex items-center gap-1 text-gray-400 mt-2"
                style={{ fontSize: "0.7rem" }}
              >
                <Navigation className="w-3 h-3" />
                도쿄역 기준 약{" "}
                {formatDistance(
                  selectedItem.lat,
                  selectedItem.lng,
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full mt-4 rounded-2xl bg-blue-600 py-3.5 text-white"
            style={{ fontSize: "0.95rem", fontWeight: 700 }}
          >
            선택하기
          </button>
        </div>
      ) : (
        <div className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-gray-100 bg-white/92 backdrop-blur p-4 shadow-lg">
          <p
            className="text-gray-800"
            style={{ fontSize: "0.9rem", fontWeight: 700 }}
          >
            장소를 검색해 선택해 주세요
          </p>
          <p
            className="text-gray-500 mt-1"
            style={{ fontSize: "0.76rem", lineHeight: 1.5 }}
          >
            상단 검색창을 누르면 장소 검색 페이지로 이동합니다.
          </p>
        </div>
      )}
    </div>
  );
}