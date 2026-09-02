import { describe, expect, it } from "vitest";

// utils
import {
  camelCaseToSentence,
  extractKeysFromObject,
  toCapitalize,
} from "./parser";

describe("parser", () => {
  it("turns camel case into a sentence", () => {
    expect(camelCaseToSentence("buildingReqTechs")).toBe("Building Req Techs");
  });

  it("capitalizes the first character", () => {
    expect(toCapitalize("horizon")).toBe("Horizon");
  });

  it("extracts the keys of an object minus the excluded ones", () => {
    expect(
      extractKeysFromObject({ id: 1, name: "a", deleted: false }, "deleted"),
    ).toEqual(["id", "name"]);
  });
});
