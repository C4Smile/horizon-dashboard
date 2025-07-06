/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// api
import HorizonApiClient from "api";

// types
import { HorizonContextType, HorizonProviderPropsType } from "./types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: true,
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const HorizonApiClientContext = createContext({} as HorizonContextType);

/**
 * HorizonApiClientProvider
 * @param {object} props - Props
 * @returns {object} React component
 */
const HorizonApiClientProvider = (props: HorizonProviderPropsType) => {
  const { children } = props;

  const horizonApiClient = new HorizonApiClient();

  return (
    <HorizonApiClientContext.Provider value={{ client: horizonApiClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HorizonApiClientContext.Provider>
  );
};

/**
 * @returns {HorizonApiClient} HorizonApiClient
 */
const useHorizonApiClient = () => {
  const context = useContext(HorizonApiClientContext);
  if (context === undefined) {
    throw new Error("useHorizonApiClient must be used within a HorizonApiClientProvider");
  }
  return context.client;
};

export { queryClient, HorizonApiClientProvider, useHorizonApiClient };
