import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param {object} props component properties
 * @returns FormDialog component
 */
function FormDialog(props) {
  const { t } = useTranslation();

  const { dialogProps, onSubmit, children } = props;

  const { show, onClose } = dialogProps;

  const onEscapePress = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", onEscapePress);
    return () => {
      window.removeEventListener("keydown", onEscapePress);
    };
  }, [onEscapePress]);

  return (
    <div
      className={`fixed z-50 top-0 left-0 w-screen flex justify-center items-center h-screen transition duration-500 bg-black/20 backdrop-blur-md ease-in-out ${show ? "opacity-1 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <form className="relative min-w-80 p-5 rounded-md bg-white">
        <button type="button" className="right-3 top-3 absolute hover:text-error" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        {children}
        <div className="flex items-end justify-end gap-5">
          <button type="submit" className="submit" onClick={onSubmit}>
            {t("_accessibility:buttons.save")}
          </button>
          <button type="button" className="outlined" onClick={onClose}>
            {t("_accessibility:buttons.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormDialog;
