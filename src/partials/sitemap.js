export const sitemap = [
  {
    path: "/",
    page: "dashboard",
    child: [
      { label: "main", path: "/" },
      { label: "analytics", path: "/analytics" },
    ],
  },
  {
    path: "/management",
    page: "management",
    child: [
      {
        label: "customers",
        path: "/customers",
      },
      {
        label: "reservations",
        path: "/reservations",
      },
      {
        label: "invoices",
        path: "/invoices",
      },
      {
        label: "rooms",
        path: "/rooms",
      },
      {
        label: "roomTypes",
        path: "/room-types",
      },
    ],
  },
  {
    path: "/personal",
    page: "personal",
    child: [
      {
        label: "users",
        path: "/users",
      },
    ],
  },
  {
    path: "/settings",
    page: "settings",
    child: [
      {
        label: "account",
        path: "/account",
      },
      {
        label: "notifications",
        path: "/notifications",
      },
    ],
  },
];
