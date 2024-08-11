import React, { forwardRef, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// providers
import { useMuseumApiClient } from "../providers/MuseumApiProvider";

// utils
import { ReactQueryKeys } from "../utils/queryKeys";

// components
import SelectInput from "./Forms/SelectInput";
import TextInput from "./Forms/TextInput";
import LinkChip from "./Chip/LinkChip";

/**
 * External Link component
 * @param {object} props
 * @returns External link component
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExternalLinkInput = forwardRef(function (props, ref) {
  const { children, value = [], onChange, label, placeholder, containerClassName } = props;

  const { t } = useTranslation();

  const museumApiClient = useMuseumApiClient();

  const [error, setError] = useState(false);
  const [currentExternalLInk, setCurrentExternalLink] = useState();
  const [currentPreview, setCurrentPreview] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const externalLinkQuery = useQuery({
    queryKey: [ReactQueryKeys.ExternalLinks],
    queryFn: () => museumApiClient.ExternalLink.getAll(),
  });

  const externalLinkList = useMemo(() => {
    try {
      if (externalLinkQuery?.data) {
        setCurrentExternalLink(externalLinkQuery?.data?.at(0).id);
        setCurrentPreview(externalLinkQuery?.data?.at(0).preview);
      }
      return (
        externalLinkQuery?.data?.map((c) => ({ value: `${c.name}`, id: c.id, preview: c.preview })) ??
        []
      );
    } catch (err) {
      return [];
    }
  }, [externalLinkQuery.data]);

  const add = () => {
    setError(false);
    if (!currentUrl?.length) setError("emptyError");
    const repeated = value?.find((link) => link.url === `${currentPreview}${currentUrl}`);
    if (repeated) setError("repeatedError");
    else {
      if (value)
        onChange([
          ...value,
          {
            url: `${currentPreview}${currentUrl}`,
            preview: currentPreview,
            linkId: currentExternalLInk,
          },
        ]);
      else onChange([{ url: `${currentPreview}${currentUrl}`, linkId: currentExternalLInk }]);
      setCurrentUrl("");
    }
  };

  const onEnterDown = (e) => {
    const { key } = e;
    if (key === "Enter" || key === "Return") {
      e.preventDefault();
      add();
    }
  };

  const onDelete = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={`relative z-0 w-full mt-5 mb-10 group ${containerClassName}`}>
      <SelectInput
        id="externalLinks"
        name="externalLinks"
        label={label}
        options={externalLinkList}
        value={currentExternalLInk}
        onChange={(e) => {
          setCurrentExternalLink(e.target.value);
          setError(false);
          const link = externalLinkQuery?.data?.find(
            (extLink) => extLink.id === Number(e.target.value),
          );
          setCurrentPreview(link?.preview);
        }}
      />
      <div className="flex gap-5 items-center justify-start">
        <button type="button" onClick={add} className="outlined dashed icon-button">
          <FontAwesomeIcon icon={faAdd} />
        </button>
        <TextInput
          value={currentUrl}
          onKeyDown={onEnterDown}
          state={error ? "error" : ""}
          label={t("_entities:externalLink.url.label")}
          onChange={(e) => {
            setCurrentUrl(e.target.value.toLowerCase());
            setError(false);
          }}
          placeholder={`${placeholder} ${currentPreview ?? ""}${currentUrl}`}
          helperText={error ? t(`_entities:externalLink.url.${error}`) : ""}
        />
      </div>
      <div className="flex items-center justify-start flex-wrap my-4 gap-2">
        {value?.map((link, i) => (
          <LinkChip
            link={link}
            onDelete={() => onDelete(i)}
            key={`${link.preview}${link.url}`}
            externalLinkList={externalLinkList}
          />
        ))}
      </div>
      {children}
    </div>
  );
});

export default ExternalLinkInput;
