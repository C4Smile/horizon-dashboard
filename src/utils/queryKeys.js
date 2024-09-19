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
  Languages: "langs",
  ApplicationTranslations: "appTranslations",
  Applications: "applications",
  ChatBot: "ChatBot",
  ChatBotContext: "ChatBotContext",
};

export const entities = ["room", "roomArea", "activity", "events", "news"];

export const chatBotEntities = ["room"];

export const parents = {
  room: "museum",
  activity: "information",
  events: "information",
  news: "information",
};
