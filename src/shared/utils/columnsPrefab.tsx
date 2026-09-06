import { Link } from "react-router-dom";

// @sito/dashboar
import { ColumnType, FilterTypes } from "@sito/dashboard-app";

// components
import { PhotoPreview } from "components";

// lib
import { BaseCommonEntityDto, BaseEntityDto, PhotoDto } from "lib";

export const nameColumn = <
  TDto extends BaseCommonEntityDto & { deletedAt?: Date | null },
>(): ColumnType<TDto> =>
  ({
    key: "name",
    filterOptions: { type: FilterTypes.text, defaultValue: "" },
    renderBody: (name: unknown, entity: BaseEntityDto) => (
      <Link
        className={`underline ${entity.deletedAt ? "text-fg-muted" : "text-primary"} flex`}
        to={`${entity.id}`}
      >
        <span className="w-80 truncate">{String(name)}</span>
      </Link>
    ),
    // the key belongs to BaseCommonEntityDto, but the caller is generic over
    // its own dto and typescript cannot see through that
  }) as unknown as ColumnType<TDto>;

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
    // the table sorts its columns by pos, descending, and keeps the array
    // order within a tie. Anything the pages add lands on 0, so a 1 puts the
    // pictures between the id and the name wherever they are declared.
    pos: 1,
    renderBody: (_: unknown, entity: TDto) => {
      const value = entity[imageKey];
      // older entities answered a list, the api sends a single relation now
      const photos = (Array.isArray(value) ? value : [value]).filter(
        (photo): photo is PhotoDto => !!photo?.url,
      );

      return <PhotoPreview photos={photos} alt={entity[altKey] as string} />;
    },
  };
};

export const titleColumn = {
  key: "title",
  filterOptions: { type: FilterTypes.text, defaultValue: "" },
  renderBody: (title: string, entity: BaseEntityDto) => (
    <Link
      className={`underline ${entity.deletedAt ? "text-fg-muted" : "text-primary"} flex`}
      to={`${entity.id}`}
    >
      <span className="w-80 truncate">{title}</span>
    </Link>
  ),
};
