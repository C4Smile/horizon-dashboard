import { useMemo } from "react";
import { useParams } from "react-router-dom";

// components
import Loading from "../../partials/loading/Loading";

/**
 * Room Form page component
 * @returns Room Form page component
 */
function RoomForm() {
  const { id } = useParams();

  const loading = useMemo(() => {}, []);

  return <div>{loading ? <Loading /> : <form></form>}</div>;
}

export default RoomForm;
