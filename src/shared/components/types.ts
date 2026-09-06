// @sito/dashboard-app
import { Option } from "@sito/dashboard-app";

// lib
import { PhotoDto } from "lib";

/**
 * An entity the relation pickers offer. It is the library's Option, which the
 * SelectInput takes as it comes, plus the photo the relation rows show beside
 * the name.
 */
export interface EntityOption extends Option {
  image?: PhotoDto;
}
