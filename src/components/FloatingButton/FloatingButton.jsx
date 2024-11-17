import { Link } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 *
 * @param props component props
 * @returns FloatingButton component
 */
export const FloatingButton = (props) => {
  const { icon, href, component = "button" } = props;

  return component === "button" ? (
    <button type="button" className="filled primary button icon-button absolute bottom-5 right-5">
      <FontAwesomeIcon icon={icon} />
    </button>
  ) : (
    <Link to={href} className="filled primary button icon-button absolute bottom-5 right-5">
      <FontAwesomeIcon icon={icon} />
    </Link>
  );
};
