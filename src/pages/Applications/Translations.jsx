import React from "react";
import { useQuery } from "@tanstack/react-query";

// api
import { useMuseumApiClient } from "../../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../../utils/queryKeys";

// components
import TabComponent from "../../components/TabComponent/TabComponent";

function Translations() {
  const museumApiClient = useMuseumApiClient();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Applications],
    queryFn: () => museumApiClient.Application.getAll({ pageSize: 999 }),
  });

  return (
    <div>
      <TabComponent />
    </div>
  );
}

export default Translations;
