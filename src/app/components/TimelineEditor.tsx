import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context";
import {
  TRANSPORT_OPTIONS,
  INDOOR_ALTERNATIVES,
} from "../store";
import {
  ChevronLeft,
  Undo2,
  Plus,
  Clock,
  MapPin,
  Navigation,
  X,
  CloudRain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
  Loader2,
  CheckCircle2,
  Bookmark,
  CircleDot,
  Flag,
  RefreshCw,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DurationSheet } from "./DurationSheet";
import { TransportSheet } from "./TransportSheet";

export function TimelineEditor() {
  const navigate = useNavigate();
  const {
    tripInfo,
    daySchedules,
    currentDay,
    setCurrentDay,
    updateDuration,
    updateTransport,
    updateDepartureTransport,
    updateArrivalTransport,
    removePlace,
    movePlace,
    replacePlace,
    recalcStatus,
    undoSchedule,
    canUndo,
    saveCurrentTrip,
    currentTripId,
    dayCount,
  } = useApp();

  const [durationSheetIdx, setDurationSheetIdx] = useState<
    number | null
  >(null);
  const [transportSheetIdx, setTransportSheetIdx] = useState<
    number | null
  >(null);
  const [depTransportSheet, setDepTransportSheet] =
    useState(false);
  const [arrTransportSheet, setArrTransportSheet] =
    useState(false);
  const [expandedMap, setExpandedMap] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [showRainPanel, setShowRainPanel] = useState(false);

  const day = daySchedules[currentDay];

  if (!day) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 gap-3">
        <p
          className="text-gray-500"
          style={{ fontSize: "0.9rem" }}
        >
          일정이 아직 없습니다
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          style={{ fontSize: "0.85rem", fontWeight: 600 }}
        >
          여행 만들기
        </button>
      </div>
    );
  }

  const items = day.items;
  const outdoorPlaces = items.filter(
    (item) => !item.place.isIndoor,
  );

  const totalDuration =
    items.reduce((sum, item) => {
      let t = item.place.duration;
      if (item.segment) t += item.segment.duration;
      return sum + t;
    }, 0) +
    (day.departureSegment?.duration || 0) +
    (day.arrivalSegment?.duration || 0);

  const totalHours = Math.floor(totalDuration / 60);
  const totalMins = totalDuration % 60;

  const getEndTime = () => {
    if (items.length === 0) return "--:--";
    const last = items[items.length - 1];
    const [h, m] = last.startTime.split(":").map(Number);
    let endMin = h * 60 + m + last.place.duration;
    if (day.arrivalSegment)
      endMin += day.arrivalSegment.duration;
    return `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
  };

  const getStartTime = () => {
    const base = day.startHour * 60;
    return `${String(Math.floor(base / 60)).padStart(2, "0")}:${String(base % 60).padStart(2, "0")}`;
  };

  const handleMoveUp = (idx: number) => {
    if (idx > 0) movePlace(idx, idx - 1);
  };

  const handleMoveDown = (idx: number) => {
    if (idx < items.length - 1) movePlace(idx, idx + 1);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const weekdays = [
        "일",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토",
      ];
      return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-14 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            {canUndo && (
              <button
                onClick={undoSchedule}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <Undo2 className="w-4 h-4 text-gray-600" />
              </button>
            )}

            <button
              onClick={() => {
                saveCurrentTrip();
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 2000);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                currentTripId ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  currentTripId
                    ? "text-blue-600 fill-blue-600"
                    : "text-gray-600"
                }`}
              />
            </button>

            <button
              onClick={() => setShowRainPanel((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                showRainPanel || outdoorPlaces.length > 0
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <CloudRain
                className={`w-4 h-4 ${
                  showRainPanel || outdoorPlaces.length > 0
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2
              style={{ fontSize: "1.15rem", fontWeight: 700 }}
            >
              {tripInfo.destination} 여행
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-gray-400"
                style={{ fontSize: "0.75rem" }}
              >
                {tripInfo.startDate.replace(/-/g, ".")}
              </span>
              <span
                className="text-gray-300"
                style={{ fontSize: "0.75rem" }}
              >
                |
              </span>
              <span
                className="text-gray-400"
                style={{ fontSize: "0.75rem" }}
              >
                {items.length}개 장소
              </span>
              <span
                className="text-gray-300"
                style={{ fontSize: "0.75rem" }}
              >
                |
              </span>
              <span
                className="text-gray-400"
                style={{ fontSize: "0.75rem" }}
              >
                {totalHours}시간 {totalMins}분
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
            <span style={{ fontSize: "0.8rem" }}>☀️</span>
            <span
              className="text-amber-600"
              style={{ fontSize: "0.75rem", fontWeight: 600 }}
            >
              24°C
            </span>
          </div>
        </div>

        {dayCount > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {daySchedules.map((ds, i) => (
              <button
                key={i}
                onClick={() => setCurrentDay(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl transition-all ${
                  currentDay === i
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  Day {i + 1}
                </span>
                <span
                  className="ml-1"
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(ds.date)}
                </span>
                {ds.items.length > 0 && currentDay !== i && (
                  <span
                    className="ml-1 text-gray-400"
                    style={{ fontSize: "0.6rem" }}
                  >
                    ({ds.items.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 bg-gray-50 rounded-xl px-3 py-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span
            className="text-gray-600"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            {getStartTime()} 출발 → {getEndTime()} 종료
          </span>
        </div>
      </div>

      {recalcStatus !== "idle" && (
        <div
          className={`mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2 ${
            recalcStatus === "calculating"
              ? "bg-blue-50"
              : "bg-green-50"
          }`}
        >
          {recalcStatus === "calculating" ? (
            <>
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span
                className="text-blue-600"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                일정 다시 계산 중...
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span
                className="text-green-600"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              >
                최적 일정으로 업데이트됨
              </span>
            </>
          )}
        </div>
      )}

      {showSaved && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2 bg-blue-50">
          <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span
            className="text-blue-600"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            여행이 저장되었습니다
          </span>
        </div>
      )}

      <button
        onClick={() => setExpandedMap(!expandedMap)}
        className="mx-4 mt-3 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl overflow-hidden relative"
      >
        <div
          className={`transition-all ${
            expandedMap ? "h-36" : "h-16"
          } flex items-center justify-center relative`}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 150"
          >
            <circle cx="30" cy="75" r="8" fill="#22c55e" />
            <text
              x="30"
              y="78"
              textAnchor="middle"
              fill="white"
              fontSize="7"
              fontWeight="bold"
            >
              출
            </text>
            <text
              x="30"
              y="95"
              textAnchor="middle"
              fill="#374151"
              fontSize="7"
              fontWeight="500"
            >
              {day.departure.name.slice(0, 4)}
            </text>

            {items.length > 0 && (
              <line
                x1="38"
                y1="75"
                x2={60}
                y2={60 + Math.sin(0) * 25}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4,3"
                opacity="0.5"
              />
            )}

            {items.map((item, i) => {
              const x =
                60 + i * (280 / Math.max(items.length, 1));
              const y = 60 + Math.sin(i * 1.5) * 25;
              const nextItem = items[i + 1];
              const nx = nextItem
                ? 60 +
                  (i + 1) * (280 / Math.max(items.length, 1))
                : 0;
              const ny = nextItem
                ? 60 + Math.sin((i + 1) * 1.5) * 25
                : 0;

              return (
                <g key={`${item.place.id}-${i}`}>
                  {nextItem && (
                    <line
                      x1={x}
                      y1={y}
                      x2={nx}
                      y2={ny}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                      opacity="0.5"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill={i === 0 ? "#2563eb" : "#60a5fa"}
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    {i + 1}
                  </text>
                  <text
                    x={x}
                    y={y + 19}
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="7"
                    fontWeight="500"
                  >
                    {item.place.name.slice(0, 4)}
                  </text>
                </g>
              );
            })}

            {items.length > 0 && (
              <>
                <line
                  x1={
                    60 +
                    (items.length - 1) *
                      (280 / Math.max(items.length, 1))
                  }
                  y1={
                    60 + Math.sin((items.length - 1) * 1.5) * 25
                  }
                  x2="370"
                  y2="75"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                  opacity="0.5"
                />
                <circle cx="370" cy="75" r="8" fill="#ef4444" />
                <text
                  x="370"
                  y="78"
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
                  fontWeight="bold"
                >
                  도
                </text>
                <text
                  x="370"
                  y="95"
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="7"
                  fontWeight="500"
                >
                  {day.arrival.name.slice(0, 4)}
                </text>
              </>
            )}
          </svg>

          {!expandedMap && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
          )}
        </div>

        <div className="absolute bottom-2 right-3 bg-white/80 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
          <span
            className="text-gray-500"
            style={{ fontSize: "0.65rem" }}
          >
            {expandedMap ? "접기" : "펼치기"}
          </span>
          {expandedMap ? (
            <ChevronUp className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          )}
        </div>
      </button>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        <button
          onClick={() => setShowRainPanel((prev) => !prev)}
          className={`w-full rounded-2xl border p-4 flex items-start gap-3 transition-colors ${
            showRainPanel
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-100"
          }`}
        >
          <CloudRain className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" />
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div
                  className="text-blue-700"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                >
                  비 예보 대비
                </div>
                <div
                  className="text-blue-500 mt-0.5"
                  style={{ fontSize: "0.75rem" }}
                >
                  오후 2시~5시 비 예보 · 야외 일정{" "}
                  {outdoorPlaces.length}개
                </div>
              </div>
              {showRainPanel ? (
                <ChevronUp className="w-4 h-4 text-blue-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
        </button>

        {showRainPanel && (
          <div className="mt-3 space-y-3">
            {outdoorPlaces.length === 0 ? (
              <div
                className="bg-white rounded-2xl border border-gray-100 p-5 text-center text-gray-400"
                style={{ fontSize: "0.85rem", fontWeight: 500 }}
              >
                모든 장소가 실내입니다 👍
              </div>
            ) : (
              outdoorPlaces.map((item) => (
                <div
                  key={`rain-${item.place.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.place.image}
                        alt={item.place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                        }}
                        className="truncate"
                      >
                        {item.place.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-gray-400"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {item.place.category}
                        </span>
                        <span
                          className="text-red-400 flex items-center gap-0.5"
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        >
                          <CloudRain className="w-3 h-3" />비
                          영향
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p
                      className="text-gray-400"
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      대체 추천
                    </p>

                    {INDOOR_ALTERNATIVES.slice(0, 2).map(
                      (alt) => (
                        <button
                          key={`${item.place.id}-${alt.id}`}
                          onClick={() =>
                            replacePlace(item.place.id, alt)
                          }
                          className="w-full flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-blue-300 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={alt.image}
                              alt={alt.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 text-left">
                            <div
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              {alt.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="text-gray-400"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {alt.category}
                              </span>
                              <span
                                className="flex items-center gap-0.5 text-gray-400"
                                style={{ fontSize: "0.65rem" }}
                              >
                                <Clock className="w-3 h-3" />
                                {alt.duration}분
                              </span>
                              <span
                                className="flex items-center gap-0.5 text-amber-500"
                                style={{ fontSize: "0.65rem" }}
                              >
                                <Star className="w-3 h-3 fill-amber-500" />
                                {alt.rating}
                              </span>
                            </div>
                          </div>

                          <RefreshCw className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3 mt-4">
          <span
            style={{ fontSize: "0.85rem", fontWeight: 600 }}
          >
            Day {currentDay + 1} 타임라인
          </span>
          <button
            onClick={() => navigate("/places")}
            className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
            style={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            <Plus className="w-3.5 h-3.5" /> 장소 추가
          </button>
        </div>

        <div className="bg-green-50 rounded-2xl p-3 border-2 border-green-200 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <CircleDot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-green-600"
                style={{ fontSize: "0.65rem", fontWeight: 500 }}
              >
                출발지
              </span>
              <p
                style={{ fontSize: "0.9rem", fontWeight: 700 }}
                className="text-gray-800 truncate"
              >
                {day.departure.name}
              </p>
              <span
                className="text-gray-400"
                style={{ fontSize: "0.7rem" }}
              >
                {getStartTime()} 출발
              </span>
            </div>
          </div>
        </div>

        {day.departureSegment && items.length > 0 && (
          <div className="ml-6 my-1 flex items-center gap-2">
            <div className="w-px h-8 bg-green-300 ml-2" />
            <button
              onClick={() => setDepTransportSheet(true)}
              className="flex-1 flex items-center justify-between bg-white border border-dashed border-green-200 rounded-xl px-3 py-2 hover:border-green-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "1rem" }}>
                  {
                    TRANSPORT_OPTIONS.find(
                      (t) =>
                        t.mode === day.departureSegment!.mode,
                    )?.icon
                  }
                </span>
                <span
                  className="text-gray-500"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {
                    TRANSPORT_OPTIONS.find(
                      (t) =>
                        t.mode === day.departureSegment!.mode,
                    )?.label
                  }
                </span>
                <span
                  className="text-gray-400"
                  style={{ fontSize: "0.75rem" }}
                >
                  {day.departureSegment.duration}분
                </span>
              </div>
              <div
                className="flex items-center gap-1 text-green-600"
                style={{ fontSize: "0.7rem", fontWeight: 500 }}
              >
                <Navigation className="w-3 h-3" />
                변경
              </div>
            </button>
          </div>
        )}

        {items.map((item, idx) => (
          <React.Fragment key={`${item.place.id}-${idx}`}>
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 mb-1 relative">
              <div
                className="absolute -left-1 top-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white z-10"
                style={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                {idx + 1}
              </div>

              <div className="flex items-start gap-3 ml-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={item.place.image}
                    alt={item.place.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                      className="truncate"
                    >
                      {item.place.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-gray-500"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-gray-500"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          removePlace(item.place.id)
                        }
                        className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded"
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 500,
                      }}
                    >
                      {item.place.category}
                    </span>

                    {!item.place.isIndoor && (
                      <span
                        className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded flex items-center gap-1"
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        <CloudRain className="w-3 h-3" />비 영향
                      </span>
                    )}

                    <span
                      className="text-blue-600"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.startTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span
                        className="text-gray-500"
                        style={{ fontSize: "0.8rem" }}
                      >
                        체류 {item.place.duration}분
                      </span>
                    </div>
                    <button
                      onClick={() => setDurationSheetIdx(idx)}
                      className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg"
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                      시간 수정
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="mt-2 ml-4 flex items-center gap-1 text-gray-400 hover:text-blue-500"
                style={{ fontSize: "0.7rem" }}
              >
                <ExternalLink className="w-3 h-3" /> 지도 앱에서
                열기
              </button>
            </div>

            {item.segment && idx < items.length - 1 && (
              <div className="ml-6 my-1 flex items-center gap-2">
                <div className="w-px h-8 bg-gray-200 ml-2" />
                <button
                  onClick={() => setTransportSheetIdx(idx)}
                  className="flex-1 flex items-center justify-between bg-white border border-dashed border-gray-200 rounded-xl px-3 py-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1rem" }}>
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) => t.mode === item.segment!.mode,
                        )?.icon
                      }
                    </span>
                    <span
                      className="text-gray-500"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) => t.mode === item.segment!.mode,
                        )?.label
                      }
                    </span>
                    <span
                      className="text-gray-400"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {item.segment.duration}분
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1 text-blue-500"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    <Navigation className="w-3 h-3" />
                    변경
                  </div>
                </button>
              </div>
            )}
          </React.Fragment>
        ))}

        {day.arrivalSegment && items.length > 0 && (
          <div className="ml-6 my-1 flex items-center gap-2">
            <div className="w-px h-8 bg-red-300 ml-2" />
            <button
              onClick={() => setArrTransportSheet(true)}
              className="flex-1 flex items-center justify-between bg-white border border-dashed border-red-200 rounded-xl px-3 py-2 hover:border-red-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "1rem" }}>
                  {
                    TRANSPORT_OPTIONS.find(
                      (t) =>
                        t.mode === day.arrivalSegment!.mode,
                    )?.icon
                  }
                </span>
                <span
                  className="text-gray-500"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {
                    TRANSPORT_OPTIONS.find(
                      (t) =>
                        t.mode === day.arrivalSegment!.mode,
                    )?.label
                  }
                </span>
                <span
                  className="text-gray-400"
                  style={{ fontSize: "0.75rem" }}
                >
                  {day.arrivalSegment.duration}분
                </span>
              </div>
              <div
                className="flex items-center gap-1 text-red-500"
                style={{ fontSize: "0.7rem", fontWeight: 500 }}
              >
                <Navigation className="w-3 h-3" />
                변경
              </div>
            </button>
          </div>
        )}

        <div className="bg-red-50 rounded-2xl p-3 border-2 border-red-200 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-red-500"
                style={{ fontSize: "0.65rem", fontWeight: 500 }}
              >
                도착지
              </span>
              <p
                style={{ fontSize: "0.9rem", fontWeight: 700 }}
                className="text-gray-800 truncate"
              >
                {day.arrival.name}
              </p>
              <span
                className="text-gray-400"
                style={{ fontSize: "0.7rem" }}
              >
                {getEndTime()} 도착 예정
              </span>
            </div>
          </div>
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <MapPin className="w-8 h-8 text-gray-300" />
            <p
              className="text-gray-400"
              style={{ fontSize: "0.85rem" }}
            >
              Day {currentDay + 1}에 장소를 추가하세요
            </p>
            <button
              onClick={() => navigate("/places")}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              장소 추가하기
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-100 p-4 shrink-0">
        <button
          onClick={() => {
            saveCurrentTrip();
            navigate("/share");
          }}
          className="w-full bg-blue-600 text-white rounded-xl py-3.5 flex items-center justify-center font-bold text-base transition-colors hover:bg-blue-700"
        >
          확정
        </button>
      </div>

      {durationSheetIdx !== null && (
        <DurationSheet
          place={items[durationSheetIdx].place}
          onClose={() => setDurationSheetIdx(null)}
          onSave={(duration) => {
            updateDuration(
              items[durationSheetIdx].place.id,
              duration,
            );
            setDurationSheetIdx(null);
          }}
        />
      )}

      {transportSheetIdx !== null && (
        <TransportSheet
          currentMode={
            items[transportSheetIdx].segment?.mode || "transit"
          }
          fromName={items[transportSheetIdx].place.name}
          toName={
            items[transportSheetIdx + 1]?.place.name || ""
          }
          onClose={() => setTransportSheetIdx(null)}
          onSelect={(mode) => {
            updateTransport(transportSheetIdx, mode);
            setTransportSheetIdx(null);
          }}
        />
      )}

      {depTransportSheet && (
        <TransportSheet
          currentMode={day.departureSegment?.mode || "transit"}
          fromName={day.departure.name}
          toName={items[0]?.place.name || ""}
          onClose={() => setDepTransportSheet(false)}
          onSelect={(mode) => {
            updateDepartureTransport(mode);
            setDepTransportSheet(false);
          }}
        />
      )}

      {arrTransportSheet && (
        <TransportSheet
          currentMode={day.arrivalSegment?.mode || "transit"}
          fromName={items[items.length - 1]?.place.name || ""}
          toName={day.arrival.name}
          onClose={() => setArrTransportSheet(false)}
          onSelect={(mode) => {
            updateArrivalTransport(mode);
            setArrTransportSheet(false);
          }}
        />
      )}
    </div>
  );
}