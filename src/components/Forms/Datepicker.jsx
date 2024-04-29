import { forwardRef } from "react";
import Flatpickr from "react-flatpickr";

// @emotion/css
import { css } from "@emotion/css";

// utils
import { inputStateClassName, labelStateClassName, helperTextStateClassName } from "./utils";

/* const wrapper = {
  ""
} */

/**
 * DatePicker
 * @param {object} props
 * @returns {object} React component
 */
const DatePicker = forwardRef(function (props, ref) {
  const {
    align,
    id,
    children,
    value = [new Date().setDate(new Date().getDate() - 6), new Date()],
    onChange,
    state,
    name,
    label,
    required,
    placeholder,
    inputClassName,
    containerClassName,
    labelClassName,
    helperText,
    helperTextClassName,
    enableTime = true,
    ...rest
  } = props;

  const options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: value,

    prevArrow:
      '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr;
      const customClass = align ? align : "";
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    },
    onChange: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr;
      onChange(selectedDates);
    },
    enableTime,
  };

  return (
    <div className={`relative z-1 w-full mb-5 group ${containerClassName}`}>
      <label
        htmlFor={name}
        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 ${labelStateClassName(state)} ${labelClassName}`}
      >
        {label}
        {required ? " *" : ""}
      </label>
      <Flatpickr
        id={id}
        ref={ref}
        name={name}
        width="100%"
        className={`block py-2.5 px-0 pl-10 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 ${inputStateClassName(state)} peer ${inputClassName}`}
        options={options}
        {...rest}
      />
      {children}
      <p className={`mt-2 text-sm ${helperTextStateClassName(state)} ${helperTextClassName}`}>
        {state !== "error" && state !== "good" ? placeholder : helperText}
      </p>
      <div className="absolute inset-0 left-0 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
          viewBox="0 0 16 16"
        >
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>
    </div>
  );
});

export default DatePicker;
