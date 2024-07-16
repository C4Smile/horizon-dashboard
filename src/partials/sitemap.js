export const sitemap = [
  {
    path: "/",
    page: "dashboard",
    child: [{ label: "main", path: "/" }],
  },
  {
    path: "/museum",
    page: "museum",
    child: [
      {
        services: "services",
        path: "/services",
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
    path: "/information",
    page: "information",
    child: [
      {
        label: "activities",
        path: "/activities",
      },
      {
        label: "news",
        path: "/news",
      },
      {
        label: "events",
        path: "/events",
      },
      {
        label: "tags",
        path: "/tags",
      },
    ],
  },
  {
    path: "/management",
    page: "management",
    child: [
      {
        label: "pushNotifications",
        path: "/push-notifications",
      },
      {
        label: "appTexts",
        path: "/app-texts",
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
