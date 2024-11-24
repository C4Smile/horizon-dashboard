import resolveConfig from "tailwindcss/resolveConfig";
import { Entity } from "../models/entity/Entity.js";

/**
 * Tailwind config
 * @returns {object} Tailwind config
 */
export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig("./src/css/tailwind.config.js");
};

/**
 * Convert hex to RGB
 * @param {string} h - Hex color
 * @returns {string} "255,255,255"
 * @example hexToRGB("#fff") returns "255,255,255"
 */
export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
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
 * @param {any} value - Value to format
 * @returns Formatted value
 */
export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

/**
 *
 * @param {number} userId user locker
 * @param {Entity} entity entity to check
 * @returns {boolean} true if is locked by userId, false otherwise
 */
export const isLockedBy = (userId, entity) => entity.lockedBy && entity.lockedBy === userId;

/**
 *
 * @param entity entity to check
 * @returns {boolean} true if is locked, false otherwise
 */
export const isLocked = (entity) => !!entity.lockedBy;
