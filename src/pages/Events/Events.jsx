import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// images
import noProduct from "../../assets/images/no-product.jpg";

// icons

// utils
import { staticUrlPhoto } from "../../components/utils";

// dto
import { Event } from "../../models/event/Event";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

// components
import LinkChip from "../../components/Chip/LinkChip";
import Chip from "../../components/Chip/Chip";

const columnClasses = {
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

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Events, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () => museumApiClient.Events.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (event) => {
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
            {event.eventHasTag?.map(({ tagId: tag }) => (
              <Chip key={tag?.id} label={tag?.name} spanClassName="text-xs" />
            ))}
          </div>
        ) ?? " - ",
      eventHasImage:
        event.eventHasImage && event.eventHasImage.length ? (
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
          <img className="small-image rounded-full object-cover" src={noProduct} alt={event.title} />
        ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.Event,
    queryKey: ReactQueryKeys.Events,
    parent: "information",
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Event(), [
      "id",
      "description",
      "subtitle",
      "dateOfCreation",
      "deleted",
      "content",
      "address",
    ]),
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Event.className}
      columns={columns}
      columnsOptions={{ columnClasses, noSortableColumns }}
      title={t("_pages:information.links.events")}
    />
  );
}

export default EventsPage;
