// @sito/dashboard-app
import { useManager } from "@sito/dashboard-app";

// api
import { Manager } from "app/api/Manager";

/**
 * @returns the horizon manager mounted by HorizonProvider
 */
export const useHorizonApiClient = () => useManager() as Manager;
