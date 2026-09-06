import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Actions, useNavbar } from "@sito/dashboard-app";
import type { ActionPropsType, BaseDto } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";

// sitemap
import { findNewPath, findPath, PageId } from "pages";

// types
import { EntityNavbarActionsOptions } from "./types";

/**
 * Puts a model's two navigation actions in the navbar: back to its list, and
 * on to its create form. Each one resolves its own route from the sitemap, so
 * a layout only has to name the entity.
 *
 * @param pageKey list page of the model
 * @param options entity options
 */
export function useEntityNavbarActions(
  pageKey: PageId,
  options: EntityNavbarActionsOptions = {},
) {
  const { noInsert = false } = options;

  const { setRightContent } = useNavbar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const listPath = findPath(pageKey);
  const newPath = findNewPath(pageKey);

  const actions = useMemo<ActionPropsType<BaseDto>[]>(
    () =>
      [
        {
          id: "list",
          icon: <FontAwesomeIcon icon={faList} />,
          tooltip: t("_accessibility:buttons.list"),
          disabled: pathname === listPath,
          onClick: () => navigate(listPath),
        },
        {
          id: "add",
          icon: <FontAwesomeIcon icon={faPlus} />,
          tooltip: t("_accessibility:buttons.insert"),
          // the only routes under a model layout are the list, the create
          // form and an edit form, so anything but the list is already a form
          disabled: pathname !== listPath,
          onClick: () => navigate(newPath),
        },
      ].filter((action) => action.id !== "add" || !noInsert),
    [listPath, navigate, newPath, noInsert, pathname, t],
  );

  useEffect(() => {
    setRightContent(<Actions actions={actions} />);
  }, [actions, setRightContent]);

  useEffect(() => {
    return () => {
      setRightContent(null);
    };
  }, [setRightContent]);
}
