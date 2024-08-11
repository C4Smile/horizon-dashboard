import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import SelectInput from "../../Forms/SelectInput";

// hooks
import { useTableOptions } from "../hooks/TableOptionsProvider";

/**
 * Navigation component
 * @returns Navigation component
 */
function Navigation() {
  const { t } = useTranslation();

  const { total, pageSize, pageSizes, setPageSize, currentPage, setCurrentPage } = useTableOptions();

  const optionPageSize = useMemo(
    () => pageSizes.map((size) => ({ label: size, value: size })),
    [pageSizes],
  );

  return (
    <div className="flex w-full items-center justify-between mt-5">
      <div className="flex w-full items-center justify-start gap-1">
        <p>{t("_accessibility:components.table.pageSizes")}</p>
        {pageSizes[0] < total && (
          <>
            <p>
              {t("_accessibility:components.table.from")} {currentPage + 1}{" "}
              {t("_accessibility:components.table.to")}{" "}
            </p>
            <SelectInput
              value={pageSize}
              options={optionPageSize}
              inputClassName="!py-0 !pl-2 !pr-7 !border-none font-bold"
              containerClassName="!w-auto !mb-0 !border-none"
              helperTextClassName="hidden"
              onChange={(e) => setPageSize(e.target.value)}
            />
            <p>{t("_accessibility:components.table.of")} </p>
          </>
        )}
        <p>
          {total} {t("_accessibility:components.table.results")}
        </p>
      </div>
      <div className="flex gap-5 items-center justify-end">
        <button
          className="disabled:text-light-primary/40"
          disabled={Math.round(total / pageSize) === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {t("_accessibility:buttons.previous")}
        </button>
        <button
          disabled={currentPage === 0}
          className="disabled:text-light-primary/40"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {t("_accessibility:buttons.next")}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
