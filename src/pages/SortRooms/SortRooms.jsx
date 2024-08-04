import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useReducer, useEffect, useCallback } from "react";
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
import { useNotification } from "../../providers/NotificationProvider";
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

  const { setNotification } = useNotification();

  const museumApiClient = useMuseumApiClient();

  const [editing, setEditing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomAreas, setRoomAreas] = useReducer(roomAreasReducer, []);

  const save = useCallback(async () => {
    const error = await museumApiClient.RoomArea.saveOrder(roomAreas);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      setNotification(String(error.status));
    } else setNotification(t("_pages:sortRooms.saved"), "good");
  }, [museumApiClient.RoomArea, roomAreas, setNotification, t]);

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
          <div className="flex items-center justify-between">
            <h2>{t("_pages:sortRooms.areas", { room: selectedRoom?.value })}</h2>
            <div className="flex gap-2 items-center">
              <button
                onClick={editing ? () => save() : () => setEditing(true)}
                type="submit"
                className="submit"
              >
                {editing ? t("_accessibility:buttons.save") : t("_accessibility:buttons.edit")}
              </button>
              <button
                onClick={() => setEditing(false)}
                type="submit"
                disabled={!editing}
                className="submit"
              >
                {t("_accessibility:buttons.cancel")}
              </button>
            </div>
          </div>
          {!roomAreasQuery?.isLoading ? (
            <ul>
              {roomAreas.map((area, i) => (
                <li
                  key={area.id}
                  className={`pl-2 pr-10 py-2 flex items-center justify-between ${i % 2 ? "bg-slate-200" : ""}`}
                >
                  <p>{area.value}</p>
                  <div className="flex flex-col items-center justify-center">
                    {
                      <button
                        disabled={i === 0 || !editing}
                        onClick={() => setRoomAreas({ type: "up", index: i })}
                        className={`${!editing ? "opacity-0" : ""} ${i === 0 ? "" : "hover:text-primary transition"}`}
                      >
                        <FontAwesomeIcon icon={faChevronUp} />
                      </button>
                    }
                    <p>{i + 1}</p>
                    <button
                      onClick={() => setRoomAreas({ type: "down", index: i })}
                      disabled={i === roomAreas.length - 1 || !editing}
                      className={`${!editing ? "opacity-0" : ""} ${i === roomAreas.length - 1 ? "" : "hover:text-primary transition"}`}
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
