import { useState, useCallback, useEffect } from "react";
import { scrollTo } from "some-javascript-utils/browser";

// components
import Chevron from "../Chevron/Chevron";

/**
 * ToTop
 * @returns ToTop component
 */
function ToTop(props) {
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
      className={`${show ? "scale-100" : "scale-0"} group bg-primary hover:bg-secondary transition duration-300 ease-in-out fixed rounded-full flex items-center justify-center w-10 h-10 bottom-5 right-10 z-10`}
      onClick={scroll}
    >
      <Chevron className="rotate-180 mt-[1px] text-white group-hover:text-primary transition" />
    </button>
  );
}

export default ToTop;
