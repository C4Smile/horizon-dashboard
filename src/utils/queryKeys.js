export const ReactQueryKeys = {
  Activities: "activities",
  AppTexts: "appTexts",
  Events: "events",
  PushNotifications: "pushNotifications",
  Roles: "roles",
  Rooms: "rooms",
  RoomStatuses: "RoomStatuses",
  RoomTypes: "roomTypes",
  RoomAreas: "roomAreas",
  RoomAreaStatuses: "roomAreaStatuses",
  Services: "services",
  Users: "users",
  News: "news",
  Tags: "tags",
  GuestBooks: "guestBooks",
};

export const entities = ["room", "roomArea", "activity", "events", "news"];

export const parents = {
  room: "museum",
  activity: "information",
  events: "information",
  news: "information",
};
