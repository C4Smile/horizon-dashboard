import {
  fromLocal,
  Methods,
  RestSessionAuthClient,
  type AuthDto,
  type RefreshDto,
  type SessionDto,
} from "@sito/dashboard-app";

// lib
import { UserDto } from "lib";

/**
 * @description extra session data horizon carries on top of the shared SessionDto
 */
export type HorizonSessionExtra = {
  horizonUser: UserDto;
};

export type HorizonSessionDto = SessionDto<HorizonSessionExtra>;

/**
 * @description what `POST auth/login` answers
 */
type LoggedUserDto = {
  user: { id: number; horizonUserId: number };
  token: string;
};

/**
 * @description payload the server signs into the access token
 */
type HorizonJwtPayload = {
  id: number;
  username: string;
};

/**
 * @description reads the payload of a JWT without validating it, the server
 * is the one that validates on `auth/validate`
 * @param token - access token
 * @returns decoded payload, or undefined when the token is not a readable JWT
 */
function decodeJwtPayload(token: string): HorizonJwtPayload | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized)) as HorizonJwtPayload;
    return typeof decoded?.id === "number" ? decoded : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 * @class HorizonAuthClient
 * @description the horizon backend does not implement the default
 * `auth/sign-in` + `auth/session` contract, it exposes `auth/login` and a
 * `auth/validate` probe that answers a message instead of a session, so login
 * and getSession are composed here from the endpoints it does have
 */
export class HorizonAuthClient extends RestSessionAuthClient {
  /**
   * @param horizonUserId - id of the horizon user, signed into the token
   * @param token - access token, passed explicitly because on login it is not
   * stored yet
   * @returns the horizon user record
   */
  private async fetchHorizonUser(
    horizonUserId: number,
    token: string,
  ): Promise<UserDto> {
    return await this.api.doQuery<UserDto>(
      `horizonUser/${horizonUserId}`,
      Methods.GET,
      undefined,
      { Authorization: `Bearer ${token}` },
    );
  }

  /**
   * @param session - raw login answer plus the resolved horizon user
   * @returns session in the shape the shared AuthProvider expects
   */
  private toSessionDto(
    token: string,
    username: string,
    horizonUser: UserDto,
  ): HorizonSessionDto {
    return {
      id: horizonUser.id,
      username: horizonUser.username ?? username,
      email: horizonUser.email ?? username,
      token,
      horizonUser,
    };
  }

  async login(data: AuthDto): Promise<HorizonSessionDto> {
    // the server takes email or username in the same field
    const logged = await this.api.doQuery<LoggedUserDto>(
      "auth/login",
      Methods.POST,
      { username: data.email, password: data.password },
      { authMode: "none" },
    );

    const horizonUser = await this.fetchHorizonUser(
      logged.user.horizonUserId,
      logged.token,
    );

    return this.toSessionDto(logged.token, data.email, horizonUser);
  }

  async getSession(): Promise<HorizonSessionDto> {
    const bearer = fromLocal(this.api.userKey, "string");

    if (!bearer) throw new Error("No stored session");

    // throws 401 when the token is no longer good, which is what the shared
    // AuthProvider uses to decide it has to log the user out
    await this.api.doQuery("auth/validate", Methods.GET);

    const payload = decodeJwtPayload(bearer);
    if (!payload) throw new Error("Unreadable session token");

    const horizonUser = await this.fetchHorizonUser(payload.id, bearer);

    return this.toSessionDto(bearer, payload.username, horizonUser);
  }

  /**
   * @description the horizon backend has no refresh endpoint, sessions live
   * until the access token expires
   */
  async refresh(_data: RefreshDto): Promise<HorizonSessionDto> {
    throw new Error("Horizon does not support token refresh");
  }

  /**
   * @description there is no server side sign out, clearing the stored token
   * is handled by the shared AuthProvider
   */
  async logout(): Promise<void> {}
}
