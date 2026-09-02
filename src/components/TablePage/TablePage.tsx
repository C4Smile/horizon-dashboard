import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// components
import { Links } from "layouts";

// providers
import { useNavbar } from "providers";

// types
import { TablePagePropsType } from "./types";

/**
 *
 * @param {object} props component props
 * @returns TablePage
 */
export const TablePage = (props: TablePagePropsType) => {
  const { children, title, pageKey, noActions = false } = props;

  const { setTitle, setRightContent } = useNavbar();

  const { t } = useTranslation();

  useEffect(() => {
    setTitle(title ?? "");
    if (!noActions)
      setRightContent(
        <Links pageKey={pageKey} navClassName="gap-3" linksClassName="!p-0" />,
      );
  }, [noActions, pageKey, setRightContent, setTitle, t, title]);

  return <div className="h-full">{children}</div>;
};
