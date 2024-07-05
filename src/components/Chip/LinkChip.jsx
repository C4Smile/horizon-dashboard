import React from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmerica, faExternalLink, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

// components
import Chip from "./Chip";

const replacePreviews = (url, links) => {
  const link = links.find((link) => url.includes(link.preview));
  return link ? url.replace(link.preview, "") : url;
};

const icons = {
  1: faFacebook,
  2: faXTwitter,
  3: faInstagram,
  4: faEarthAmerica,
  5: faYoutube,
  6: faShoppingBag,
};

/**
 *
 * @returns
 */
function LinkChip(props) {
  const { link, onDelete, externalLinkList, onlyIcon, variant = "", className, spanClassName } = props;

  return (
    <Chip
      variant={variant}
      onDelete={onDelete}
      className={className}
      spanClassName={`flex items-center justify-center gap-2 ${spanClassName}`}
      label={
        <>
          {!onlyIcon ? (
            <>
              <FontAwesomeIcon className="text-xl" icon={icons[link.linkId ?? link.id]} />
              {replacePreviews(link.url, externalLinkList)}
              <a href={link.url} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faExternalLink} />
              </a>
            </>
          ) : (
            <a href={link.url} target="_blank" rel="noreferrer">
              <FontAwesomeIcon className="text-xl" icon={icons[link.linkId ?? link.id]} />
            </a>
          )}
        </>
      }
    />
  );
}

export default LinkChip;
