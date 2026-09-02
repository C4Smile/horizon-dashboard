import { useState, forwardRef, ForwardedRef } from "react";

// @sito
import { TextInput, TextInputPropsType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const PasswordInput = forwardRef(function (
  props: TextInputPropsType,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput {...props} type={showPassword ? "text" : "password"} ref={ref}>
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-0 top-[9px]"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </button>
    </TextInput>
  );
});
