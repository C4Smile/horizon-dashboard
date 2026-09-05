// lib
import { BaseEntityDto } from "lib";

/**
 * Convert hex to RGB
 * @param h - Hex color
 * @returns "255,255,255"
 * @example hexToRGB("#fff") returns "255,255,255"
 */
export const hexToRGB = (h: string) => {
  let r = "0";
  let g = "0";
  let b = "0";
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

/**
 * Format value
 * @param value - Value to format
 * @returns Formatted value
 */
export const formatValue = (value: number | bigint) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

/**
 *
 * @param entity entity to check
 * @returns true is if deleted, false otherwise
 */
export const isDeleted = (entity: BaseEntityDto) => !!entity.deletedAt;

/**
 *
 * @param userId user locker, undefined when there is no session yet
 * @param entity entity to check
 * @returns true if is locked by userId, false otherwise
 */
export const isLockedBy = (userId: number | undefined, entity: BaseEntityDto) =>
  !!entity.lockedBy && entity.lockedBy === userId;

/**
 *
 * @param entity entity to check
 * @returns true if is locked, false otherwise
 */
export const isLocked = (entity: BaseEntityDto) => !!entity.lockedBy;
