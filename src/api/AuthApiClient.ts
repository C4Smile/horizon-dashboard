// utils
import { fromLocal, toLocal } from "utils";
import { makeRequest } from "./utils/";

// config
import config from "../config";

// lib
import { AccountDto, LoginDto, UserDto } from "lib";

export class AuthApiClient {
  /**
   * Fetch owner data
   * @param userId - User id
   * @returns Owner
   */
  async fetchOwner(userId: string) {
    const { data, error } = await makeRequest<null, UserDto>(
      `horizonUser/byUserId/${userId}`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return {
      json: async () => ({
        ...data,
        status: error ? error.status : 200,
        error,
      }),
    };
  }

  /**
   * Get session
   * @returns the current session
   */
  async getSession() {
    const { data, error, status } = await makeRequest(
      `auth/validate`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return { data, status: error?.status ?? status, error };
  }

  /**
   * Validates a token
   * @returns refreshed token
   */
  async validates() {
    const { data, error, status } = await makeRequest(
      `auth/validate`,
      "GET",
      null,
      {
        Authorization: "Bearer " + fromLocal(config.user, "object")?.token,
      }
    );
    return { data, status: error?.status ?? status, error };
  }

  /**
   * Logouts an user
   * @returns Transaction result
   */
  async logout() {
    // await supabase.auth.signOut();
  }

  /**
   * Logs an user
   * @param {string} user - username
   * @param {string} password - password
   * @returns Transaction result
   */
  async login(user: string, password: string) {
    const { data, error } = await makeRequest<LoginDto, AccountDto>(
      `auth/login`,
      "POST",
      {
        username: user,
        password,
      }
    );
    if (data && data.user) {
      data.user.email = user;
      toLocal(config.user, data);
    }
    return {
      json: async () => ({
        ...data,
        status: error ? error.status : 200,
        error,
      }),
    };
  }
}
