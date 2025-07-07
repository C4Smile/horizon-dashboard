import { Link } from "react-router-dom";

// @sito/dashboar
import { ColumnType, FilterTypes } from "@sito/dashboard";

// images
import noProduct from "assets/images/no-product.jpg";

// utils
import { staticUrlPhoto } from "components";

// lib
import { BaseCommonEntityDto, BaseEntityDto } from "lib";

export const nameColumn = <
  TDto extends BaseCommonEntityDto & { deleted: boolean },
>(): ColumnType<TDto> => ({
  key: "name",
  filterOptions: { type: FilterTypes.text, defaultValue: "" },
  renderBody: (name: string, entity: BaseEntityDto) => (
    <Link
      className={`underline ${entity.deleted ? "text-white" : "text-light-primary"} flex`}
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
  altProp: keyof TDto,
  key?: keyof TDto
) => {
  const imageKey = key ?? ("images" as keyof TDto);

  return {
    key: imageKey,
    sortable: false,
    renderBody: (_: unknown, entity: TDto) =>
      Array.isArray(entity[imageKey]) && entity[imageKey].length ? (
        <div className="flex items-center justify-start">
          {entity[imageKey].map((image, i) => (
            <img
              key={i}
              className={`small-image rounded-full object-cover border-white border-2 ${i > 0 ? "-ml-4" : ""}`}
              src={staticUrlPhoto(image.url)}
              alt={`${entity[altProp]} ${i}`}
            />
          ))}
        </div>
      ) : (
        <img
          className="small-image rounded-full object-cover"
          src={noProduct}
          alt={entity[altProp] as string}
        />
      ),
  };
};

export const titleColumn = {
  key: "title",
  filterOptions: { type: FilterTypes.text, defaultValue: "" },
  renderBody: (title: string, entity: BaseEntityDto) => (
    <Link
      className={`underline ${entity.deleted ? "text-white" : "text-light-primary"} flex`}
      to={`${entity.id}`}
    >
      <span className="w-80 truncate">{title}</span>
    </Link>
  ),
};
