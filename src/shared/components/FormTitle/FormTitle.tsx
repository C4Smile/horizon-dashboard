import { Link, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// types
import { FormTitlePropsType, ModelOutletContext } from "./types";

/**
 * The heading of a model form, with the chevron back to its list on the same
 * row. The path comes from the layout through the outlet, so a form does not
 * have to know where it was opened from.
 *
 * @param props component props
 * @returns the heading row
 */
export function FormTitle(props: FormTitlePropsType) {
  const { children } = props;

  const { t } = useTranslation();

  // null on any route the model layout does not mount, and then there is no
  // list to go back to
  const context = useOutletContext<ModelOutletContext | null>();

  return (
    <div className="flex items-center gap-3 mb-2">
      {!!context?.listPath && (
        <Link
          to={context.listPath}
          className="icon-button button text-primary hover:text-hover-primary"
          aria-label={t("_accessibility:buttons.back")}
          title={t("_accessibility:buttons.back")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
      )}
      <h1 className="text-2xl md:text-3xl font-bold">{children}</h1>
    </div>
  );
}
