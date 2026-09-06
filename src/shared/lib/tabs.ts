/**
 * A tab on an entity form. `hide` decides whether the tab is offered for the
 * record at hand: the relation tabs only make sense once the entity exists.
 */
export type EntityTabType = {
  id: string;
  hide?: (isEditing: boolean) => boolean;
};
