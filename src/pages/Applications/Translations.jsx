import React from "react";
import { useQuery } from "@tanstack/react-query";

// api
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import Loading from "../../partials/loading/Loading";
import TabComponent from "../../components/TabComponent/TabComponent";

/**
 *
 * @returns Translations page
 */
function Translations() {
  const museumApiClient = useMuseumApiClient();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Applications],
    queryFn: () => museumApiClient.Application.getAll(),
  });

  return (
    <div className="p-7">
      {!isLoading ? (
        <TabComponent
          tabs={data?.items?.map((app) => ({ id: app.id, label: app.name })) ?? []}
          content={{}}
        />
      ) : (
        <Loading
          className="bg-none w-full h-6"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      )}
    </div>
  );
}

export default Translations;
