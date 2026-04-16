import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router";
import { useApp } from "../context";
import { type DayPoint } from "../store";
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Flag,
  MapPin,
  Check,
  Copy,
  Sparkles,
  Search,
  X,
} from "lucide-react";

function PointEditor({
  dayIndex,
  type,
  point,
}: {
  dayIndex: number;
  type: "departure" | "arrival";
  point: DayPoint;
}) {
  const navigate = useNavigate();
  const { updateDayDeparture, updateDayArrival } = useApp();

  const handleReset = () => {
    const emptyPoint = { name: "", lat: 0, lng: 0 };
    if (type === "departure") {
      updateDayDeparture(dayIndex, emptyPoint);
      return;
    }
    updateDayArrival(dayIndex, emptyPoint);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() =>
          navigate(`/map-search?type=${type}&day=${dayIndex}`)
        }
        className="w-full flex items-center gap-3 bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-3 hover:border-blue-300 transition-colors text-left"
      >
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p
            className={
              point.name
                ? "text-gray-900 truncate"
                : "text-gray-400"
            }
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            {point.name || "지도 검색으로 장소를 선택하세요"}
          </p>
          <p
            className="text-gray-300 mt-0.5"
            style={{ fontSize: "0.7rem" }}
          >
            검색창 + 검색 버튼으로 장소를 찾을 수 있어요
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </button>
    </div>
  );
}

export function DepartureArrivalScreen() {
  const navigate = useNavigate();
  const {
    tripInfo,
    daySchedules,
    dayCount,
    initDaySchedules,
    updateDayDeparture,
    updateDayArrival,
  } = useApp();
  const [activeDay, setActiveDay] = useState(0);
  const didInitSchedules = useRef(false);
  
  useEffect(() => {
    if (didInitSchedules.current) return;
    didInitSchedules.current = true;
    initDaySchedules();
  }, [initDaySchedules]);

  const safeDayCount = Math.max(1, dayCount || 1);
  const currentDayData = daySchedules[activeDay];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const allDaysHavePoints =
    daySchedules.length > 0 &&
    daySchedules.every(
      (d) => d.departure.name && d.arrival.name,
    );

  const handleCopyToAll = () => {
    if (!currentDayData) return;
    daySchedules.forEach((_, i) => {
      if (i !== activeDay) {
        updateDayDeparture(i, { ...currentDayData.departure });
        updateDayArrival(i, { ...currentDayData.arrival });
      }
    });
  };

  const handleNext = () => {
    if (!allDaysHavePoints) return;
    navigate("/places");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 pt-14 pb-3 flex items-center gap-3">
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
            STEP 4
          </p>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            출발/도착 설정
          </h2>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <MapPin className="w-4 h-4" />
            <span
              style={{ fontSize: "0.8rem", fontWeight: 600 }}
            >
              {tripInfo.destination} 일정 기준
            </span>
          </div>
          <p
            className="text-blue-600"
            style={{ fontSize: "0.75rem" }}
          >
            각 일차별로 출발지/도착지를 설정하면 장소 추천과
            동선 계산 정확도가 높아집니다.
          </p>
        </div>
      </div>

      <div className="px-6 mb-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {Array.from({ length: safeDayCount }, (_, i) => {
            const dayData = daySchedules[i];
            const done = !!(
              dayData?.departure.name && dayData?.arrival.name
            );
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveDay(i)}
                className={`px-3 py-2 rounded-xl border text-left min-w-[94px] transition-colors ${
                  activeDay === i
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    Day {i + 1}
                  </span>
                  {done && (
                    <Check
                      className={`w-3.5 h-3.5 ${activeDay === i ? "text-white" : "text-blue-600"}`}
                    />
                  )}
                </div>
                <p
                  className={`mt-0.5 ${activeDay === i ? "text-blue-100" : "text-gray-400"}`}
                  style={{ fontSize: "0.65rem" }}
                >
                  {dayData ? formatDate(dayData.date) : "-"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {currentDayData && (
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span
                    className="text-white"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {activeDay + 1}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    Day {activeDay + 1}
                  </p>
                  <p
                    className="text-gray-400"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {formatDate(currentDayData.date)}
                  </p>
                </div>
              </div>
              {daySchedules.length > 1 &&
                currentDayData.departure.name &&
                currentDayData.arrival.name && (
                  <button
                    onClick={handleCopyToAll}
                    className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}
                  >
                    <Copy className="w-3 h-3" />
                    전체 일정에 복사
                  </button>
                )}
            </div>

            <PointEditor
              dayIndex={activeDay}
              type="departure"
              point={currentDayData.departure}
            />

            <div className="flex items-center gap-3 ml-3">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-px h-3 bg-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="w-px h-3 bg-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="w-px h-3 bg-gray-300" />
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span
                  className="text-blue-600"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                  }}
                >
                  AI가 출발지→도착지 거리 기반으로 장소를 최적
                  배치합니다
                </span>
              </div>
            </div>

            <PointEditor
              dayIndex={activeDay}
              type="arrival"
              point={currentDayData.arrival}
            />
          </div>
        </div>
      )}

      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          disabled={!allDaysHavePoints}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
            allDaysHavePoints
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          {allDaysHavePoints
            ? "장소 선택하기"
            : "모든 일정의 출발지·도착지를 설정하세요"}
          {allDaysHavePoints && (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}