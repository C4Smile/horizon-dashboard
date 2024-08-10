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
        path: "/roomAreas",
      },
      {
        label: "sortRooms",
        path: "/sortRooms",
      },
      {
        label: "roomTypes",
        path: "/roomTypes",
      },
      {
        label: "guestBooks",
        path: "/guestBooks",
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
        path: "/pushNotifications",
      },
      {
        label: "appTexts",
        path: "/appTexts",
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
