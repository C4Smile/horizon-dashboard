import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// icons
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import Chip from "../Chip/Chip";
import TextInput from "./TextInput";

/**
 *
 * @param {object} props
 * @returns
 */
const AutocompleteInput = forwardRef(function (props, ref) {
  const {
    state,
    value,
    onChange,
    options,
    name,
    id,
    label,
    containerClassName,
    helperText,
    placeholder,
    multiple,
    ...rest
  } = props;

  const [localValue, setLocalValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = options.filter((option) => {
    const isIncluded = option.value.toLowerCase().includes(localValue?.toLowerCase());
    if (value && value.length) {
      const toShow = value?.some ? !value?.some((v) => v.id === option.id) : value?.id !== option.id;
      return toShow;
    }
    return isIncluded;
  });

  const autocompleteRef = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target))
        setShowSuggestions(false);
    };
    const escapePressed = (e) => {
      if (e.key === "Escape") setShowSuggestions(false);
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", escapePressed);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", escapePressed);
    };
  }, []);

  const handleChange = (event) => {
    setLocalValue(event.target.value);
  };

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setLocalValue("");
      if (!suggestion) onChange(null);
      else {
        if (multiple) value ? onChange([...value, suggestion]) : onChange([suggestion]);
        else onChange(suggestion);
      }
      setShowSuggestions(false);
    },
    [multiple, onChange, value],
  );

  const handleDeleteChip = useCallback(
    (index) => {
      const newValue = value.filter((_, i) => i !== index);
      if (newValue.length) onChange(newValue);
      else onChange(null);
    },
    [onChange, value],
  );

  return (
    <div className={`relative w-full mb-5 group ${containerClassName}`} ref={autocompleteRef}>
      <TextInput
        state={state}
        name={name}
        id={id}
        value={!multiple && value ? value.value : localValue}
        onChange={handleChange}
        placeholder={placeholder}
        helperText={helperText}
        onFocus={() => setShowSuggestions(true)}
        label={label}
        ref={ref}
        containerClassName="!mb-0"
        {...rest}
      >
        {!multiple && value && (
          <button
            type="button"
            className="absolute right-0 top-[9px]"
            onClick={() => handleSuggestionClick()}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        )}
      </TextInput>
      {showSuggestions && (
        <ul className="m-0 p-0 z-10 bg-white absolute w-full">
          {suggestions.map((suggestion) => (
            <li
              className="p-2 hover:bg-primary/20"
              onClick={() => handleSuggestionClick(suggestion)}
              key={suggestion.id}
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
      {multiple && value && value.length ? (
        <div className="flex items-center justify-start flex-wrap my-4 gap-2">
          {value.map((selected, i) => (
            <Chip key={selected.value} label={selected.value} onDelete={() => handleDeleteChip(i)} />
          ))}
        </div>
      ) : null}
    </div>
  );
});

AutocompleteInput.defaultProps = {
  type: "text",
  required: false,
  containerClassName: "",
  inputClassName: "",
  labelClassName: "",
  helperTextClassName: "",
  value: "",
};

AutocompleteInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  state: PropTypes.oneOf(["error", "good", "default"]),
  name: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  containerClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  helperText: PropTypes.string,
  helperTextClassName: PropTypes.string,
  options: PropTypes.array.isRequired,
};

export default AutocompleteInput;
