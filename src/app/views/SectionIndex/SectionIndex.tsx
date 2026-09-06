import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

// menu
import { getMenuMap } from "../../menuMap";

// types
import { SectionIndexPropsType } from "./types";

/**
 * The landing page of a drawer group. /game, /players and /settings used to be
 * nothing but the prefix of their children, so opening one from the address
 * bar or from a half typed url landed on the not found page. They list their
 * children instead, read from the same menu the drawer is built from, so a new
 * entry shows up here without anyone remembering to add it twice.
 *
 * @param props component props
 * @returns the section index
 */
export function SectionIndex(props: SectionIndexPropsType) {
  const { page } = props;

  const { t } = useTranslation();

  const group = useMemo(
    () => getMenuMap(t).find((item) => item.page === page),
    [page, t],
  );

  const children = group?.children ?? [];

  return (
    <div className="p-5">
      <h1 className="page-title">{t(`_pages:${page}.title`)}</h1>
      <ul className="section-grid">
        {children.map((child) => (
          <li key={child.id}>
            <Link to={child.path ?? "/"} className="section-card">
              <span>{child.label}</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
