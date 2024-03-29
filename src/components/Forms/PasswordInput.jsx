import { useState, forwardRef } from "react";

// icons
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// components
import TextInput from "./TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PasswordInput = forwardRef(function (props, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput {...props} ref={ref}>
      <button
        type="button"
        className="absolute right-0 top-[9px]"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </TextInput>
  );
});

export default PasswordInput;
