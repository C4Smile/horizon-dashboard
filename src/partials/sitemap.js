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
        label: "events",
        path: "/events",
      },
      {
        label: "event-tags",
        path: "/event-tags",
      },
      {
        label: "news",
        path: "/news",
      },
      {
        label: "news-tags",
        path: "/news-tags",
      },
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
        label: "countries",
        path: "/countries",
      },
      {
        label: "provinces",
        path: "/provinces",
      },
      {
        label: "paymentMethods",
        path: "/payment-methods",
      },
      {
        label: "currencies",
        path: "/currencies",
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
    ],
  },
];
