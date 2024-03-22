import { useMemo } from "react";
import { useParams } from "react-router-dom";

// components
import Loading from "../../partials/loading/Loading";

/**
 * Room Type page component
 * @returns Room Type page component
 */
function RoomTypeForm() {
  const { id } = useParams();

  const loading = useMemo(() => {
    return false;
  }, []);

  return <div>{loading ? <Loading /> : <form></form>}</div>;
}

export default RoomTypeForm;
