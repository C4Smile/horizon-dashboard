import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

// utils
import { staticUrlPhoto } from "../../components/utils";

// dto
import { Event } from "../../models/event/Event";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";
import { SortOrder } from "../../models/query/GenericFilter";

// providers
import { useNotification } from "../../providers/NotificationProvider";
import { useMuseumApiClient, queryClient } from "../../providers/MuseumApiProvider";

// components
import LinkChip from "../../components/Chip/LinkChip";
import Table from "../../components/Table/Table";
import Chip from "../../components/Chip/Chip";

const columnClasses = {
  title: "max-w-40 overflow-hidden",
  lastUpdate: "w-50",
};

const noSortableColumns = {
  eventHasTag: true,
  eventHasImage: true,
  eventHasLink: true,
  location: true,
};

/**
 * Events page
 * @returns Events page component
 */
function EventsPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { setNotification } = useNotification();
  const museumApiClient = useMuseumApiClient();

  const preparedColumns = useMemo(() => {
    const keys = extractKeysFromObject(new Event(), [
      "id",
      "description",
      "subtitle",
      "dateOfCreation",
      "deleted",
      "content",
      "address",
    ]);
    return keys.map((key) => ({
      id: key,
      label: t(`_entities:event.${key}.label`),
      className: columnClasses[key] ?? "",
      sortable: !noSortableColumns[key],
    }));
  }, [t]);

  const [sort, setSort] = useState({
    attribute: "lastUpdate",
    order: SortOrder.ASC,
  });

  const onTableSort = (attribute, order) => setSort({ attribute, order });

  const eventsQuery = useQuery({
    queryKey: [
      ReactQueryKeys.Events,
      {
        ...sort,
      },
    ],
    queryFn: () => museumApiClient.Events.getAll(sort.attribute, sort.order),
  });

  const [localData, setLocalData] = useState([]);

  const preparedRows = useMemo(() => {
    return localData.map((event) => {
      let geoLocation = undefined;
      if (event.location) {
        geoLocation = {};
        const [lat, lng] = event.location.split(",");
        geoLocation.lat = Number(lat);
        geoLocation.lng = Number(lng);
      }
      return {
        id: event.id,
        lastUpdate: new Date(event.lastUpdate).toLocaleDateString("es-ES"),
        deleted: event.deleted ? t("_accessibility:buttons.yes") : t("_accessibility:buttons.no"),
        title: (
          <Link className="underline text-light-primary flex" to={`${event.id}`}>
            <span className="w-80 truncate">{event.title}</span>
          </Link>
        ),
        location:
          geoLocation && geoLocation.lat && geoLocation.lat ? (
            <a
              href={`https://www.google.com/maps/dir//${geoLocation.lat},${geoLocation.lng}/@${geoLocation.lat},${geoLocation.lng},21z`}
              rel="noreferrer"
              target="_blank"
              className="underline"
            >
              {geoLocation.lat},{geoLocation.lng}
            </a>
          ) : (
            t("_accessibility:labels.none")
          ),
        eventHasLink:
          (
            <div className="flex gap-1">
              {event.eventHasLink?.map((link) => (
                <LinkChip
                  link={{ url: link.url, ...link.linkId }}
                  key={link?.linkId?.id}
                  onlyIcon
                  variant="empty"
                  className="!px-1"
                  spanClassName="text-xs"
                />
              ))}
            </div>
          ) ?? " - ",
        eventHasTag:
          (
            <div className="flex flex-wrap gap-3">
              {event.eventHasTag?.map((tag) => (
                <Chip key={tag?.id} label={tag?.name} spanClassName="text-xs" />
              ))}
            </div>
          ) ?? " - ",
        eventHasImage: (
          <>
            {event.eventHasImage && event.eventHasImage.length ? (
              <div className="flex items-center justify-start">
                {event.eventHasImage.map((image, i) => (
                  <img
                    key={i}
                    className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
                    src={staticUrlPhoto(image.imageId.url)}
                    alt={`${event.title} ${i}`}
                  />
                ))}
              </div>
            ) : (
              <img
                className="small-image rounded-full object-cover"
                src={noProduct}
                alt={event.title}
              />
            )}
          </>
        ),
      };
    });
  }, [localData, t]);

  useEffect(() => {
    const { data } = eventsQuery;
    if (data) {
      if (data.status && data?.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        setNotification(String(data.status));
      } else setLocalData(data ?? []);
    }
  }, [eventsQuery, navigate, setNotification]);

  const getActions = [
    {
      id: "edit",
      onClick: (e) => navigate(`/information/events/${e.id}`),
      icon: faPencil,
      tooltip: t("_accessibility:buttons.edit"),
    },
    {
      id: "delete",
      onClick: async (e) => {
        const result = await museumApiClient.Events.delete([e.id]);
        const { error, status } = result;
        setNotification(String(status), { model: t("_entities:entities.event") });

        if (status !== 204) {
          // eslint-disable-next-line no-console
          console.error(error);
          setNotification(String(status));
        } else queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.Events] });
      },
      icon: faTrash,
      tooltip: t("_accessibility:buttons.delete"),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">{t("_pages:information.links.events")}</h1>
      <Table
        isLoading={eventsQuery.isLoading}
        rows={preparedRows}
        columns={preparedColumns}
        actions={getActions}
        onSort={onTableSort}
      />
    </div>
  );
}

export default EventsPage;
