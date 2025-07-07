import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";

// types
import { ActionHook, UseMultipleActionPropTypes } from "hooks";

// lib
import { BaseEntityDto } from "lib";

export const useRestoreAction = (
  props: UseMultipleActionPropTypes<number>
): ActionHook<BaseEntityDto> => {
  const { t } = useTranslation();

  const {
    onClick,
    isLoading = false,
    hidden = false,
    disabled = false,
  } = props;

  const action = useCallback(
    (record: BaseEntityDto) => ({
      id: "restore",
      hidden: !record.deleted || hidden,
      disabled,
      icon: (
        <FontAwesomeIcon
          className={`text-red-500 ${isLoading ? "rotate" : ""}`}
          icon={isLoading ? faSpinner : faRotateLeft}
        />
      ),
      tooltip: t("_pages:common.actions.restore.text"),
      onClick: () => onClick([record?.id]),
    }),
    [disabled, hidden, isLoading, onClick, t]
  );

  return { action };
};
