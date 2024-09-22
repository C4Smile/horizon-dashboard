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
  ChatBot: "chatBot",
  ChatBotContext: "chatBotContext",
};

export const entities = ["room", "roomArea", "activity", "events", "news"];

export const chatBotEntities = ["room"];

export const Parents = {
  room: "museo",
  roomArea: "museo",
  guestBook: "museo",
  service: "museo",
  roomType: "museo",
  activity: "informacion",
  event: "informacion",
  news: "informacion",
  tag: "informacion",
  application: "dispositivos",
  appText: "gestion",
  pushNotification: "gestion",
  user: "personal",
};
