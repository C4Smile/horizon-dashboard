import { useEffect, useState } from "react";

// components
import Loading from "./Loading";
import Logo from "../../components/Logo/Logo";

/**
 * SplashScreen component
 * @param {object} props - Component props
 * @returns SplashScreen component
 */
export default function SplashScreen(props) {
  const { visible } = props;

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 2000);
  }, []);

  return (
    <div
      className={`bg-white w-full h-screen fixed top-0 left-0 z-50 transition-opacity duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0 pointer-events-none"} flex items-center justify-center flex-col`}
    >
      <Logo className={`w-20 h-20`} />
      <div
        className={`transition duration-300 ease-in-out ${loader ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      >
        <Loading
          className="w-10 h-10 rounded-lg mt-4"
          strokeWidth="4"
          loaderClass="!w-6"
          color="stroke-primary"
        />
      </div>
    </div>
  );
}
