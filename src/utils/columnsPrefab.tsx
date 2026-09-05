import { Link } from "react-router-dom";

// @sito/dashboar
import { ColumnType, FilterTypes } from "@sito/dashboard-app";

// images
import noProduct from "assets/images/no-product.jpg";

// utils
import { staticUrlPhoto } from "components";

// lib
import { BaseCommonEntityDto, BaseEntityDto, PhotoDto } from "lib";

export const nameColumn = <
  TDto extends BaseCommonEntityDto & { deletedAt?: Date | null },
>(): ColumnType<TDto> => ({
  key: "name",
  filterOptions: { type: FilterTypes.text, defaultValue: "" },
  renderBody: (name: string, entity: BaseEntityDto) => (
    <Link
      className={`underline ${entity.deletedAt ? "text-white" : "text-light-primary"} flex`}
      to={`${entity.id}`}
    >
      <span className="w-80 truncate">{name}</span>
    </Link>
  ),
});

/**
 * @param altProp image alt prop
 * @param key image key
 * @returns imageColumn
 */
export const imageColumn = <TDto extends BaseEntityDto>(
  altProp?: keyof TDto,
  key?: keyof TDto,
) => {
  const altKey = altProp ?? ("name" as keyof TDto);
  // every dto carries a single `image` relation, not a list
  const imageKey = key ?? ("image" as keyof TDto);

  return {
    key: imageKey,
    sortable: false,
    renderBody: (_: unknown, entity: TDto) => {
      const value = entity[imageKey];
      // older entities answered a list, the api sends a single relation now
      const photos = (Array.isArray(value) ? value : [value]).filter(
        (photo): photo is PhotoDto => !!photo?.url,
      );

      if (!photos.length)
        return (
          <img
            className="small-image rounded-full object-cover"
            src={noProduct}
            alt={entity[altKey] as string}
          />
        );

      return (
        <div className="flex items-center justify-start">
          {photos.map((photo, i) => (
            <img
              key={photo.id ?? i}
              className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
              src={staticUrlPhoto(photo.url)}
              alt={`${entity[altKey]} ${i}`}
            />
          ))}
        </div>
      );
    },
  };
};

export const titleColumn = {
  key: "title",
  filterOptions: { type: FilterTypes.text, defaultValue: "" },
  renderBody: (title: string, entity: BaseEntityDto) => (
    <Link
      className={`underline ${entity.deletedAt ? "text-white" : "text-light-primary"} flex`}
      to={`${entity.id}`}
    >
      <span className="w-80 truncate">{title}</span>
    </Link>
  ),
};
