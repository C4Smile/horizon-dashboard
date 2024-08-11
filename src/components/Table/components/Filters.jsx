import { useState } from "react";
import { useTranslation } from "react-i18next";

// tippy
import Tippy from "@tippyjs/react";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Popup from "../../Popup/Popup";

/**
 *
 * @returns
 */
function Filters(props) {
  const { t } = useTranslation();

  const { isLoading } = props;

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      <Tippy content={t("_accessibility:buttons.showFilters")}>
        <button onClick={() => setShowPopup(!showPopup)}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </Tippy>
      <Popup className="right-2 top-6" show={showPopup} onClose={() => setShowPopup(false)}>
        <div className="flex items-center gap-5">
          <button type="submit" disabled={isLoading} className="submit">
            {t("_accessibility:buttons.apply")}
          </button>
          <button className="outlined">{t("_accessibility:buttons.cancel")}</button>
        </div>
      </Popup>
    </div>
  );
}

export default Filters;
