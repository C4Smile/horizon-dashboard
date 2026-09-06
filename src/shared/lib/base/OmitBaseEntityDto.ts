/**
 * Fields the api owns: they are never sent when writing an entity, the server
 * assigns them.
 */
export type OmitBaseEntityDto =
  "id" | "deletedAt" | "createdAt" | "updatedAt" | "lockedBy";
