import { QueryKey } from "@tanstack/react-query";

// types
import { ValidationError } from "lib";
import { UseConfirmationPropsType } from "../forms";

export interface UseDeleteDialogPropsType extends UseConfirmationPropsType<
  number,
  ValidationError
> {
  queryKey: QueryKey;
}
