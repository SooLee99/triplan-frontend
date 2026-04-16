import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context";
import { TRANSPORT_OPTIONS } from "../store";
import {
  ChevronLeft,
  Copy,
  Share2,
  Clock,
  MapPin,
  CircleDot,
  Flag,
  Navigation,
  CalendarDays,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export function ShareScreen() {
  const navigate = useNavigate();
  const { tripInfo, daySchedules } = useApp();
  const [activeDay, setActiveDay] = useState(0);

  const formatDate = (date?: string) =>
    date ? date.replace(/-/g, ".") : "";

  const normalizedDaySchedules = useMemo(() => {
    return daySchedules ?? [];
  }, [daySchedules]);

  const currentDay = normalizedDaySchedules[activeDay];

  const getDayDuration = (
    day: (typeof normalizedDaySchedules)[number],
  ) => {
    return (
      day.items.reduce((sum, item) => {
        let t = item.place.duration;
        if (item.segment) t += item.segment.duration;
        return sum + t;
      }, 0) +
      (day.departureSegment?.duration || 0) +
      (day.arrivalSegment?.duration || 0)
    );
  };

  const getStartTime = (
    day: (typeof normalizedDaySchedules)[number],
  ) => {
    const base = (day.startHour || 9) * 60;
    return `${String(Math.floor(base / 60)).padStart(2, "0")}:${String(base % 60).padStart(2, "0")}`;
  };

  const getEndTime = (
    day: (typeof normalizedDaySchedules)[number],
  ) => {
    if (day.items.length === 0) {
      return getStartTime(day);
    }

    const last = day.items[day.items.length - 1];
    const [h, m] = last.startTime.split(":").map(Number);
    let endMin = h * 60 + m + last.place.duration;

    if (day.arrivalSegment) {
      endMin += day.arrivalSegment.duration;
    }

    return `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
  };

  const totalDuration = normalizedDaySchedules.reduce(
    (sum, day) => sum + getDayDuration(day),
    0,
  );
  const totalPlaces = normalizedDaySchedules.reduce(
    (sum, day) => sum + day.items.length,
    0,
  );

  const buildShareText = () => {
    const daysText = normalizedDaySchedules
      .map((day, dayIdx) => {
        const dayDuration = getDayDuration(day);
        const dayHours = Math.floor(dayDuration / 60);
        const dayMins = dayDuration % 60;
        const lines: string[] = [];

        lines.push(
          `📅 Day ${dayIdx + 1} (${formatDate(day.date)})`,
        );
        lines.push(`총 소요시간: ${dayHours}시간 ${dayMins}분`);
        lines.push(
          `0. ${getStartTime(day)} 출발지 - ${day.departure.name}`,
        );

        if (day.departureSegment && day.items.length > 0) {
          const depMode = TRANSPORT_OPTIONS.find(
            (t) => t.mode === day.departureSegment!.mode,
          );
          lines.push(
            `   → ${depMode?.label ?? "이동"} ${day.departureSegment.duration}분`,
          );
        }

        day.items.forEach((item, idx) => {
          lines.push(
            `${idx + 1}. ${item.startTime} ${item.place.name} (${item.place.duration}분 · ${item.place.category})`,
          );

          if (item.segment && idx < day.items.length - 1) {
            const mode = TRANSPORT_OPTIONS.find(
              (t) => t.mode === item.segment!.mode,
            );
            lines.push(
              `   → ${mode?.label ?? "이동"} ${item.segment.duration}분`,
            );
          }
        });

        if (day.arrivalSegment && day.items.length > 0) {
          const arrMode = TRANSPORT_OPTIONS.find(
            (t) => t.mode === day.arrivalSegment!.mode,
          );
          lines.push(
            `   → ${arrMode?.label ?? "이동"} ${day.arrivalSegment.duration}분`,
          );
        }

        lines.push(
          `도착. ${getEndTime(day)} 도착지 - ${day.arrival.name}`,
        );

        return lines.join("\n");
      })
      .join("\n\n");

    return [
      `📍 ${tripInfo.destination} 여행 일정`,
      `${formatDate(tripInfo.startDate)} ~ ${formatDate(tripInfo.endDate)}`,
      `인원: ${tripInfo.travelers}명`,
      "",
      daysText,
    ].join("\n");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      toast.success("전체 일정이 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const shareAll = async () => {
    const text = buildShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tripInfo.destination} 여행 일정`,
          text,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      toast.success("공유용 일정이 복사되었습니다");
    } catch {
      toast.error("공유에 실패했습니다");
    }
  };

  if (!currentDay) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Toaster position="top-center" />
        <div className="px-6 pt-14 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            일정 공유
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-400">
          일정이 없습니다
        </div>
      </div>
    );
  }

  const activeDayDuration = getDayDuration(currentDay);
  const activeDayHours = Math.floor(activeDayDuration / 60);
  const activeDayMins = activeDayDuration % 60;

  return (
    <div className="flex flex-col h-full bg-white">
      <Toaster position="top-center" />

      <div className="px-6 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
          일정 공유
        </h2>
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white mb-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4" />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              여행 일정 요약
            </span>
          </div>

          <h3
            className="text-white mt-1"
            style={{ fontSize: "1.3rem", fontWeight: 700 }}
          >
            {tripInfo.destination}
          </h3>

          <div
            className="flex items-center gap-3 mt-2"
            style={{ fontSize: "0.8rem", opacity: 0.8 }}
          >
            <span>
              {formatDate(tripInfo.startDate)} ~{" "}
              {formatDate(tripInfo.endDate)}
            </span>
            <span>|</span>
            <span>{tripInfo.travelers}명</span>
          </div>

          <div className="flex gap-4 mt-4 pt-3 border-t border-white/20">
            <div>
              <div
                style={{ fontSize: "1.3rem", fontWeight: 700 }}
              >
                {normalizedDaySchedules.length}
              </div>
              <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                일정 일수
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "1.3rem", fontWeight: 700 }}
              >
                {totalPlaces}
              </div>
              <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                장소
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "1.3rem", fontWeight: 700 }}
              >
                {Math.floor(totalDuration / 60)}h{" "}
                {totalDuration % 60}m
              </div>
              <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                총 소요시간
              </div>
            </div>
          </div>
        </div>

        {/* Day buttons */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {normalizedDaySchedules.map((day, dayIdx) => {
              const dayDuration = getDayDuration(day);
              const dayHours = Math.floor(dayDuration / 60);
              const dayMins = dayDuration % 60;
              const selected = activeDay === dayIdx;

              return (
                <button
                  key={`day-tab-${dayIdx}`}
                  onClick={() => setActiveDay(dayIdx)}
                  className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    Day {dayIdx + 1}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      opacity: selected ? 0.9 : 0.7,
                    }}
                  >
                    {formatDate(day.date)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      opacity: selected ? 0.9 : 0.7,
                    }}
                  >
                    총 {dayHours}시간 {dayMins}분
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active day summary */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div
                  className="flex items-center gap-2 text-blue-600"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Day {activeDay + 1}</span>
                </div>
                <div
                  className="mt-1 text-gray-900"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                  }}
                >
                  {formatDate(currentDay.date)}
                </div>
                <div
                  className="mt-1 text-gray-500"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {getStartTime(currentDay)} ~{" "}
                  {getEndTime(currentDay)} ·{" "}
                  {currentDay.items.length}개 장소 · 총{" "}
                  {activeDayHours}시간 {activeDayMins}분
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-0">
              {/* Departure */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CircleDot className="w-4 h-4" />
                  </div>
                  <div className="w-px h-6 bg-gray-200 mt-1" />
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-green-600"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {getStartTime(currentDay)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {currentDay.departure.name}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 mt-0.5 text-gray-400"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>출발지</span>
                  </div>
                </div>
              </div>

              {/* Departure segment */}
              {currentDay.departureSegment &&
                currentDay.items.length > 0 && (
                  <div
                    className="ml-11 text-gray-400 flex items-center gap-1 pb-1"
                    style={{ fontSize: "0.7rem" }}
                  >
                    <span>
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) =>
                            t.mode ===
                            currentDay.departureSegment!.mode,
                        )?.icon
                      }
                    </span>
                    <span>
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) =>
                            t.mode ===
                            currentDay.departureSegment!.mode,
                        )?.label
                      }{" "}
                      {currentDay.departureSegment.duration}분
                    </span>
                  </div>
                )}

              {/* Places */}
              {currentDay.items.map((item, idx) => (
                <React.Fragment
                  key={`${activeDay}-${item.place.id}-${idx}`}
                >
                  <div className="flex items-start gap-3 py-2">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div className="w-px h-6 bg-gray-200 mt-1" />
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-blue-600"
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.startTime}
                        </span>
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.place.name}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 mt-0.5 text-gray-400"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <Clock className="w-3 h-3" />
                        <span>
                          {item.place.duration}분 체류
                        </span>
                        <span>·</span>
                        <span>{item.place.category}</span>
                      </div>
                    </div>
                  </div>

                  {item.segment &&
                    idx < currentDay.items.length - 1 && (
                      <div
                        className="ml-11 text-gray-400 flex items-center gap-1 pb-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <span>
                          {
                            TRANSPORT_OPTIONS.find(
                              (t) =>
                                t.mode === item.segment!.mode,
                            )?.icon
                          }
                        </span>
                        <span>
                          {
                            TRANSPORT_OPTIONS.find(
                              (t) =>
                                t.mode === item.segment!.mode,
                            )?.label
                          }{" "}
                          {item.segment.duration}분
                        </span>
                      </div>
                    )}
                </React.Fragment>
              ))}

              {/* Arrival segment */}
              {currentDay.arrivalSegment &&
                currentDay.items.length > 0 && (
                  <div
                    className="ml-11 text-gray-400 flex items-center gap-1 pb-1"
                    style={{ fontSize: "0.7rem" }}
                  >
                    <span>
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) =>
                            t.mode ===
                            currentDay.arrivalSegment!.mode,
                        )?.icon
                      }
                    </span>
                    <span>
                      {
                        TRANSPORT_OPTIONS.find(
                          (t) =>
                            t.mode ===
                            currentDay.arrivalSegment!.mode,
                        )?.label
                      }{" "}
                      {currentDay.arrivalSegment.duration}분
                    </span>
                  </div>
                )}

              {/* Arrival */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Flag className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-red-600"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {getEndTime(currentDay)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {currentDay.arrival.name}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 mt-0.5 text-gray-400"
                    style={{ fontSize: "0.75rem" }}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>도착지</span>
                  </div>
                </div>
              </div>

              {currentDay.items.length === 0 && (
                <div
                  className="py-4 text-center text-gray-400"
                  style={{ fontSize: "0.8rem" }}
                >
                  등록된 장소가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pb-10 border-t border-gray-100 space-y-3">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={copyToClipboard}
            className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl"
          >
            <Copy className="w-5 h-5 text-gray-600" />
            <span
              className="text-gray-600"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              전체 복사
            </span>
          </button>

          <button
            onClick={shareAll}
            className="flex flex-col items-center gap-1.5 py-3 bg-gray-50 rounded-xl"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
            <span
              className="text-gray-600"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              전체 공유
            </span>
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white"
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}