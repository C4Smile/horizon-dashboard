import { useMemo } from "react";
import { useParams } from "react-router-dom";

// components
import Loading from "../../partials/loading/Loading";

/**
 * Reservation Form page component
 * @returns Reservation Form page component
 */
function ReservationForm() {
  const { id } = useParams();

  const loading = useMemo(() => {}, []);

  return <div>{loading ? <Loading /> : <form></form>}</div>;
}

export default ReservationForm;
