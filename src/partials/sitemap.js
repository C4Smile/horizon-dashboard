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
        label: "services",
        path: "/services",
      },
      {
        label: "rooms",
        path: "/rooms",
      },
      {
        label: "roomAreas",
        path: "/room-areas",
      },
      {
        label: "roomTypes",
        path: "/room-types",
      },
      {
        label: "guestBook",
        path: "/guest-book",
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
