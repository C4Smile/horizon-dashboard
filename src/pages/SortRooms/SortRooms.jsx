import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useReducer, useEffect } from "react";
import { useTranslation } from "react-i18next";
import React from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import Loading from "../../partials/loading/Loading";
import AutocompleteInput from "../../components/Forms/AutocompleteInput";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

const roomAreasReducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case "up": {
      const { index } = action;
      const bridge = state[index - 1];
      state[index - 1] = state[index];
      state[index] = bridge;
      return [...state];
    }
    case "down": {
      const { index } = action;
      const bridge = state[index + 1];
      state[index + 1] = state[index];
      state[index] = bridge;
      return [...state];
    }
    default: {
      // set
      const { items } = action;
      return items ?? [];
    }
  }
};

/**
 * Sort Rooms view
 * @returns SortRooms component
 */
function SortRooms() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomAreas, setRoomAreas] = useReducer(roomAreasReducer, []);

  const roomsQuery = useQuery({
    queryKey: [ReactQueryKeys.Rooms],
    queryFn: () => museumApiClient.Room.getAll(),
  });

  const roomsList = useMemo(() => {
    try {
      return roomsQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [];
    } catch (err) {
      return [];
    }
  }, [roomsQuery.data]);

  const roomAreasQuery = useQuery({
    queryKey: [ReactQueryKeys.RoomAreas],
    queryFn: () => museumApiClient.RoomArea.getByRoomId(selectedRoom?.id),
    enabled: !!selectedRoom?.id,
  });

  useEffect(() => {
    setRoomAreas({
      type: "set",
      items: roomAreasQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id })) ?? [],
    });
  }, [roomAreasQuery.data]);

  return (
    <div className="px-5 pt-10 items-start justify-start flex-col w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-10">{t("_pages:sortRooms.title")}</h1>
      {!roomsQuery.isLoading ? (
        <AutocompleteInput
          id="roomId"
          name="roomId"
          label={t("_entities:roomArea.roomId.label")}
          placeholder={t("_entities:roomArea.roomId.placeholder")}
          options={roomsList}
          value={selectedRoom}
          onChange={(v) => {
            setSelectedRoom(v);
          }}
        />
      ) : (
        <Loading />
      )}

      {roomAreas.length ? (
        <div>
          <h2>{t("_pages:sortRooms.areas", { room: selectedRoom?.value })}</h2>
          {!roomAreasQuery?.isLoading ? (
            <ul>
              {roomAreas.map((area, i) => (
                <li
                  key={area.id}
                  className={`pl-2 pr-10 py-2 flex items-center justify-between ${i % 2 ? "bg-slate-200" : ""}`}
                >
                  <p>{area.value}</p>
                  <div className="flex flex-col items-center justify-center">
                    <button
                      disabled={i === 0}
                      className={`${i === 0 ? "" : "hover:text-primary transition"}`}
                    >
                      <FontAwesomeIcon icon={faChevronUp} />
                    </button>
                    <p>{i + 1}</p>
                    <button
                      disabled={i === roomAreas.length - 1}
                      className={`${i === roomAreas.length - 1 ? "" : "hover:text-primary transition"}`}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Loading />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SortRooms;
