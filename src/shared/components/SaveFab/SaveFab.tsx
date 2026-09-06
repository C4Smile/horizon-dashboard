import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Loading } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

// types
import { SaveFabPropsType } from "./types";

/**
 * The save button of an entity form, floating in the bottom right corner so it
 * stays reachable however long the form runs. It stacks under the scroll to
 * top button rather than sharing its spot.
 *
 * @param props component props
 * @returns the submit button
 */
export function SaveFab(props: SaveFabPropsType) {
  const { disabled = false, loading = false } = props;

  const { t } = useTranslation();

  return (
    <button
      type="submit"
      disabled={disabled}
      className="save-fab"
      aria-label={t("_accessibility:buttons.save")}
      title={t("_accessibility:buttons.save")}
    >
      {loading ? (
        <Loading
          className="button-loading no-bg"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-page"
        />
      ) : (
        <FontAwesomeIcon icon={faFloppyDisk} />
      )}
    </button>
  );
}
