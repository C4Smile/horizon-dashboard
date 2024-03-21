import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HotelApiClient } from "../api/HotelApiClient";

const HotelApiClientContext = createContext({});

/**
 *
 */
const HotelApiClientProvider = (props) => {
  const { children } = props;

  const hotelApiClient = new HotelApiClient();

  return (
    <HotelApiClientContext.Provider value={{ client: hotelApiClient }}>
      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
    </HotelApiClientContext.Provider>
  );
};

/**
 * @returns HotelApiClient
 */
const useHotelApiClient = () => {
  const context = useContext(HotelApiClientContext);
  if (context === undefined) {
    throw new Error("useHotelApiClient must be used within a HotelApiClientProvider");
  }
  return context.client;
};

// eslint-disable-next-line react-refresh/only-export-components
export { HotelApiClientProvider, useHotelApiClient };
