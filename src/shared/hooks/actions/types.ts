// @sito/dashboard-app
import { ActionType } from "@sito/dashboard-app";

// lib
import { BaseEntityDto } from "lib";

// sitemap
import { PageId } from "pages";

export enum BaseActions {
  Edit = "edit",
  Delete = "delete",
  Restore = "restore",
}

export interface UseActionPropTypes {
  hidden?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface UseSingleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto) => void;
  hidden?: boolean;
}

export interface UseEditActionPropTypes extends Omit<
  UseSingleActionPropTypes<BaseEntityDto>,
  "onClick"
> {
  /**
   * The list page of the model. The route comes from the sitemap: the hand
   * built `game/${Tables.X}` strings were relative, so navigate resolved them
   * against the list route and edit landed on /game/resources/game/resources/1,
   * and two of them named a table that is not the route segment either.
   */
  pageKey: PageId;
}

export interface UseMultipleActionPropTypes<TInDto> extends UseActionPropTypes {
  onClick: (record: TInDto[]) => void;
  hidden?: boolean;
}

export type ActionHook<TDto extends BaseEntityDto> = {
  action: (row: TDto) => ActionType<TDto>;
};
