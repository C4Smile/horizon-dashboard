import { useDeleteDialog } from "./useDeleteDialog.tsx";
import { useRestoreDialog } from "./useRestoreDialog.tsx";
import { useFormDialog } from "./useFormDialog.tsx";

export { useDeleteDialog, useRestoreDialog, useFormDialog };
export type * from "./types.ts";

// dialog open/close state lives in the shared library
export { useDialog } from "@sito/dashboard-app";
