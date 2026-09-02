import { useState, useCallback, useEffect } from "react";
import { scrollTo } from "some-javascript-utils/browser";

// @sito/dashboard-app
import { ChevronUp } from "@sito/dashboard-app";

// types
import { ToTopPropsType } from "./types";

/**
 * ToTop
 * @param {object} props - Props
 * @returns ToTop component
 */
function ToTop(props: ToTopPropsType) {
  const { dealer } = props;

  const scroll = useCallback(() => {
    scrollTo(0, 0, dealer);
  }, [dealer]);

  const [show, setShow] = useState(false);

  const onScroll = useCallback(() => {
    if (dealer?.scrollTop > 100) setShow(true);
    else setShow(false);
  }, [dealer]);

  useEffect(() => {
    dealer?.addEventListener("scroll", onScroll);
    return () => {
      dealer?.removeEventListener("scroll", onScroll);
    };
  }, [dealer, onScroll]);

  return (
    <button
      className={`${show ? "scale-100" : "scale-0"} transition duration-300 ease-in-out fixed rounded-full bg-primary flex items-center justify-center w-10 h-10 bottom-5 right-10 z-10`}
      onClick={scroll}
    >
      <ChevronUp className="rotate-180 text-white" />
    </button>
  );
}

export default ToTop;
