import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HorizonApiClient } from "../api/HorizonApiClient";

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

const HorizonApiClientContext = createContext({});

/**
 * HorizonApiClientProvider
 * @param {object} props - Props
 * @returns {object} React component
 */
const HorizonApiClientProvider = (props) => {
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
