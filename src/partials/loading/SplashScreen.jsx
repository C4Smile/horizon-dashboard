import React from "react";

import logo from "../../assets/images/logo.webp";
import background from "../../assets/images/bg-footer.jpg";

/**
 * SplashScreen component
 * @param {object} props - Component props
 * @returns SplashScreen component
 */
export default function SplashScreen(props) {
  const { visible } = props;

  return (
    <div
      className={`w-full h-screen fixed top-0 left-0 z-50 transition-opacity duration-500 ease-in-out ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <img src={background} alt="green noise background" className="w-full h-full" />
      <img
        src={logo}
        alt="logo del museo"
        className="w-20 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
      />
    </div>
  );
}
