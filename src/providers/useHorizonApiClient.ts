// @sito/dashboard-app
import { useManager } from "@sito/dashboard-app";

// api
import { Manager } from "api";

/**
 * @returns the horizon manager mounted by HorizonProvider
 */
export const useHorizonApiClient = () => useManager() as Manager;
