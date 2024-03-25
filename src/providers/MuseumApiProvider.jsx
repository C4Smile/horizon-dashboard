import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MuseumApiClient } from "../api/MuseumApiClient";

const queryClient = new QueryClient();

const MuseumApiClientContext = createContext({});

/**
 * MuseumApiClientProvider
 * @param {object} props - Props
 * @returns {object} React component
 */
const MuseumApiClientProvider = (props) => {
  const { children } = props;

  const museumApiClient = new MuseumApiClient();

  return (
    <MuseumApiClientContext.Provider value={{ client: museumApiClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MuseumApiClientContext.Provider>
  );
};

/**
 * @returns MuseumApiClient
 */
const useMuseumApiClient = () => {
  const context = useContext(MuseumApiClientContext);
  if (context === undefined) {
    throw new Error("useMuseumApiClient must be used within a MuseumApiClientProvider");
  }
  return context.client;
};

export { queryClient, MuseumApiClientProvider, useMuseumApiClient };
