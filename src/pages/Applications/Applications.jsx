import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// @sito/dashboard
import { Table, useTableOptions } from "@sito/dashboard";

// dto
import { Application } from "../../models/application/Application";

// utils
import { extractKeysFromObject } from "../../utils/parser";
import { Parents, ReactQueryKeys } from "../../utils/queryKeys";

// providers
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// hooks
import { useActions } from "../../hooks/useActions";
import { useParseColumns, useParseRows } from "../../utils/parseBaseColumns";

/**
 * Application page
 * @returns Application page component
 */
function Applications() {
  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const { sortingBy, setTotal, sortingOrder, currentPage, pageSize } = useTableOptions();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Applications, sortingBy, sortingOrder, currentPage, pageSize],
    queryFn: () =>
      museumApiClient.Application.getAll({ sortingBy, sortingOrder, currentPage, pageSize }),
  });

  useEffect(() => {
    if (data) setTotal(data.total ?? 0);
  }, [data, setTotal]);

  const prepareRows = (application) => {
    return {
      ...application,
      name: (
        <Link className="underline text-light-primary" to={`${application.id}`}>
          {application.name}
        </Link>
      ),
    };
  };

  const getActions = useActions({
    apiClient: museumApiClient.Application,
    queryKey: ReactQueryKeys.Applications,
    parent: Parents.application,
  });

  const { columns } = useParseColumns(
    extractKeysFromObject(new Application(), []),
    Application.className,
  );

  const { rows } = useParseRows(prepareRows);

  return (
    <Table
      rows={data?.items}
      actions={getActions}
      isLoading={isLoading}
      parseRows={rows}
      entity={Application.className}
      columns={columns}
      title={t("_pages:devices.links.applications")}
    />
  );
}

export default Applications;
