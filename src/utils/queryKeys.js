export const ReactQueryKeys = {
  Activities: "Activities",
  AppTexts: "AppTexts",
  Events: "Events",
  PushNotifications: "PushNotifications",
  Roles: "Roles",
  Rooms: "Rooms",
  RoomStatuses: "RoomStatuses",
  RoomTypes: "RoomTypes",
  RoomAreas: "RoomAreas",
  RoomAreaStatuses: "RoomAreaStatuses",
  Services: "Services",
  Users: "Users",
  News: "News",
  Tags: "Tags",
  GuestBooks: "GuestBooks",
};

export const entities = ["room", "roomArea", "activity", "events", "news"];

export const parents = {
  room: "museum",
  activity: "information",
  events: "information",
  news: "information",
};
