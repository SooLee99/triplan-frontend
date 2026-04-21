import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ChevronLeft,
  CalendarDays,
  Clock,
  Tag,
  ClipboardList,
  FileText,
  Pencil,
  Check,
  Plus,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type PlaceDetailNavigationState = {
  name: string;
  description: string;
  image: string;
  category: string;
  visitDate: string;
  visitTime: string;
  preparations: string[];
  memo: string;
};

const CATEGORY_OPTIONS = [
  { label: "숙소", emoji: "🏨" },
  { label: "식사", emoji: "🍽️" },
  { label: "카페", emoji: "☕" },
  { label: "관광", emoji: "📸" },
  { label: "명소", emoji: "🏛️" },
  { label: "자연", emoji: "🌿" },
  { label: "해변", emoji: "🏖️" },
  { label: "산책", emoji: "🚶" },
  { label: "공원", emoji: "🌳" },
  { label: "쇼핑", emoji: "🛍️" },
  { label: "시장", emoji: "🧺" },
  { label: "문화", emoji: "🎭" },
  { label: "전시", emoji: "🖼️" },
  { label: "박물관", emoji: "🏺" },
  { label: "액티비티", emoji: "🎡" },
  { label: "체험", emoji: "🛶" },
  { label: "야경", emoji: "🌃" },
  { label: "사진스팟", emoji: "📷" },
  { label: "교통", emoji: "🚉" },
  { label: "휴식", emoji: "🛋️" },
  { label: "기타", emoji: "📍" },
];

function getCategoryDisplay(category: string) {
  const matched = CATEGORY_OPTIONS.find(
    (item) => item.label === category,
  );
  if (matched) return `${matched.emoji} ${matched.label}`;
  return category;
}

export function PlaceDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDetail =
    location.state as PlaceDetailNavigationState | null;

  const [isEditing, setIsEditing] = useState(false);
  const [detail, setDetail] =
    useState<PlaceDetailNavigationState | null>(initialDetail);
  const [newPreparation, setNewPreparation] = useState("");

  const hasDetail = useMemo(() => !!detail, [detail]);

  if (!hasDetail || !detail) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 px-6 text-center">
        <p
          className="text-gray-500"
          style={{ fontSize: "0.9rem", fontWeight: 500 }}
        >
          표시할 장소 정보가 없습니다.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white"
          style={{ fontSize: "0.85rem", fontWeight: 600 }}
        >
          이전으로
        </button>
      </div>
    );
  }

  const updateField = <
    K extends keyof PlaceDetailNavigationState,
  >(
    key: K,
    value: PlaceDetailNavigationState[K],
  ) => {
    setDetail((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev,
    );
  };

  const handleSave = () => {
    setIsEditing(false);

    navigate(".", {
      replace: true,
      state: detail,
    });
  };

  const handleCancel = () => {
    setDetail(initialDetail);
    setNewPreparation("");
    setIsEditing(false);
  };

  const addPreparation = () => {
    const value = newPreparation.trim();
    if (!value) return;

    updateField("preparations", [
      ...detail.preparations,
      value,
    ]);
    setNewPreparation("");
  };

  const removePreparation = (index: number) => {
    updateField(
      "preparations",
      detail.preparations.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-14 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div>
              <h2
                className="text-gray-900"
                style={{ fontSize: "1.05rem", fontWeight: 700 }}
              >
                장소 상세
              </h2>
              <p
                className="text-gray-400 mt-0.5"
                style={{ fontSize: "0.75rem" }}
              >
                방문 정보 확인 및 수정
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 rounded-xl bg-gray-100 text-gray-600"
                style={{ fontSize: "0.78rem", fontWeight: 600 }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-1"
                style={{ fontSize: "0.78rem", fontWeight: 600 }}
              >
                <Check className="w-4 h-4" />
                저장
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 flex items-center gap-1"
              style={{ fontSize: "0.78rem", fontWeight: 600 }}
            >
              <Pencil className="w-4 h-4" />
              수정
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
          <div className="w-full h-56 bg-gray-100">
            {detail.image ? (
              <ImageWithFallback
                src={detail.image}
                alt={detail.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지가 없습니다
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              >
                {getCategoryDisplay(detail.category)}
              </span>
            </div>

            <h3
              className="text-gray-900"
              style={{ fontSize: "1.1rem", fontWeight: 700 }}
            >
              {detail.name}
            </h3>

            {isEditing ? (
              <textarea
                value={detail.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={4}
                className="w-full mt-3 p-3 rounded-2xl border border-gray-200 text-gray-700 resize-none"
                style={{ fontSize: "0.86rem", lineHeight: 1.6 }}
                placeholder="장소 설명을 입력하세요"
              />
            ) : (
              <p
                className="text-gray-500 mt-2 leading-6"
                style={{ fontSize: "0.86rem" }}
              >
                {detail.description || "장소 설명이 없습니다."}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            <span
              className="text-gray-700"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              방문 날짜
            </span>

            <div className="ml-auto">
              {isEditing ? (
                <input
                  type="date"
                  value={detail.visitDate}
                  onChange={(event) =>
                    updateField("visitDate", event.target.value)
                  }
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                />
              ) : (
                <span
                  className="text-gray-500"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  {detail.visitDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span
              className="text-gray-700"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              방문 시간
            </span>

            <div className="ml-auto">
              {isEditing ? (
                <input
                  type="time"
                  value={detail.visitTime}
                  onChange={(event) =>
                    updateField("visitTime", event.target.value)
                  }
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                />
              ) : (
                <span
                  className="text-gray-500"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  {detail.visitTime}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Tag className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div
                className="text-gray-700 mb-2"
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                카테고리
              </div>

              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isSelected =
                      detail.category === option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          updateField("category", option.label)
                        }
                        className={`px-3 py-2 rounded-xl border transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        <span className="mr-1">
                          {option.emoji}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span
                  className="text-gray-500"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  {getCategoryDisplay(detail.category)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span
              className="text-gray-800"
              style={{ fontSize: "0.9rem", fontWeight: 700 }}
            >
              준비물
            </span>
          </div>

          {detail.preparations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {detail.preparations.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1.5"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  <span>{item}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removePreparation(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-gray-400"
              style={{ fontSize: "0.82rem" }}
            >
              준비물 정보가 없습니다.
            </p>
          )}

          {isEditing && (
            <div className="flex items-center gap-2 mt-4">
              <input
                value={newPreparation}
                onChange={(event) =>
                  setNewPreparation(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addPreparation();
                  }
                }}
                placeholder="준비물 추가"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
                style={{ fontSize: "0.82rem" }}
              />
              <button
                type="button"
                onClick={addPreparation}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-1"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <span
              className="text-gray-800"
              style={{ fontSize: "0.9rem", fontWeight: 700 }}
            >
              메모
            </span>
          </div>

          {isEditing ? (
            <textarea
              value={detail.memo}
              onChange={(event) =>
                updateField("memo", event.target.value)
              }
              rows={5}
              className="w-full p-3 rounded-2xl border border-gray-200 text-gray-700 resize-none"
              style={{ fontSize: "0.84rem", lineHeight: 1.6 }}
              placeholder="메모를 입력하세요"
            />
          ) : (
            <p
              className="text-gray-500 leading-6"
              style={{ fontSize: "0.84rem" }}
            >
              {detail.memo || "메모가 없습니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}