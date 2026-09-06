import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueries } from "@tanstack/react-query";

// providers
import { useAccount, useHorizonApiClient } from "providers";

// lib
import { Roles } from "lib";

// utils
import { ReactQueryKeys } from "utils";

/**
 * How many rows an entity holds, and where to go to see them
 */
type Counter = {
  key: ReactQueryKeys;
  path: string;
  label: string;
  count: () => Promise<number>;
};

/**
 * The home page used to be a greeting and nothing else. These are the counts
 * the api already answers with: a page of one row carries totalElements, so a
 * counter costs a single row rather than the whole list.
 * @returns the counters, or nothing for an account that cannot open them
 */
export function Counters() {
  const { t } = useTranslation();

  const horizonApiClient = useHorizonApiClient();

  const { account } = useAccount();

  const isAdmin = account?.horizonUser?.roleId === Roles.administrator;

  const counters: Counter[] = useMemo(() => {
    if (!isAdmin) return [];

    /** the envelope carries the total, the single row is the price of asking */
    const total = async (
      get: (query: { pageSize: number }) => Promise<{ totalElements: number }>,
    ) => (await get({ pageSize: 1 })).totalElements;

    return [
      {
        key: ReactQueryKeys.Resources,
        path: "/game/resources",
        label: "_pages:game.links.resources",
        count: () => total((query) => horizonApiClient.Resource.get(query)),
      },
      {
        key: ReactQueryKeys.Buildings,
        path: "/game/buildings",
        label: "_pages:game.links.buildings",
        count: () => total((query) => horizonApiClient.Building.get(query)),
      },
      {
        key: ReactQueryKeys.Techs,
        path: "/game/techs",
        label: "_pages:game.links.techs",
        count: () => total((query) => horizonApiClient.Tech.get(query)),
      },
      {
        key: ReactQueryKeys.Ships,
        path: "/game/ships",
        label: "_pages:game.links.ships",
        count: () => total((query) => horizonApiClient.Ship.get(query)),
      },
      {
        key: ReactQueryKeys.Cannons,
        path: "/game/cannons",
        label: "_pages:game.links.cannons",
        count: () => total((query) => horizonApiClient.Cannon.get(query)),
      },
      {
        key: ReactQueryKeys.Skills,
        path: "/game/skills",
        label: "_pages:game.links.skills",
        count: () => total((query) => horizonApiClient.Skill.get(query)),
      },
      {
        key: ReactQueryKeys.Nations,
        path: "/game/nations",
        label: "_pages:game.links.nations",
        count: () => total((query) => horizonApiClient.Nation.get(query)),
      },
      {
        key: ReactQueryKeys.Users,
        path: "/players/users",
        label: "_pages:players.links.users",
        count: () => total((query) => horizonApiClient.User.get(query)),
      },
    ];
  }, [horizonApiClient, isAdmin]);

  const results = useQueries({
    queries: counters.map((counter) => ({
      queryKey: [counter.key, "count"],
      queryFn: counter.count,
      // the totals move when someone saves, not while the page sits open
      staleTime: 60_000,
    })),
  });

  if (!counters.length) return null;

  return (
    <ul className="section-grid">
      {counters.map((counter, index) => (
        <li key={counter.key}>
          <Link to={counter.path} className="section-card stat-card">
            <span className="stat-count">
              {results[index]?.isPending ? "—" : (results[index]?.data ?? 0)}
            </span>
            <span className="stat-label">{t(counter.label)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
