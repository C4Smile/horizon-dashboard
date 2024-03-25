import { useMemo } from "react";
import { useParams } from "react-router-dom";

// components
import Loading from "../../partials/loading/Loading";

/**
 * Invoice Form page component
 * @returns Invoice Form page component
 */
function InvoiceForm() {
  const { id } = useParams();

  const loading = useMemo(() => {
    return false;
  }, []);

  return <div>{loading ? <Loading /> : <form></form>}</div>;
}

export default InvoiceForm;
