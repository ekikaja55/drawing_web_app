// Color-utils.js - Utilities for color manipulation

const ColorUtils = {
  /**
   * Converts a hex color string to RGB values
   * @param {string} hex - Hex color code (e.g., #FF0000)
   * @returns {Object} Object with r, g, b values
   */
  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, "");

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  },

  /**
   * Converts RGB values to a hex color string
   * @param {number} r - Red component (0-255)
   * @param {number} g - Green component (0-255)
   * @param {number} b - Blue component (0-255)
   * @returns {string} Hex color code (e.g., #FF0000)
   */
  rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  },

  /**
   * Converts RGB values to HSL
   * @param {number} r - Red component (0-255)
   * @param {number} g - Green component (0-255)
   * @param {number} b - Blue component (0-255)
   * @returns {Object} Object with h (0-360), s (0-100), l (0-100) values
   */
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  },

  /**
   * Adjusts color brightness
   * @param {string} hex - Hex color code
   * @param {number} factor - Brightness factor (<1 darkens, >1 lightens)
   * @returns {string} Adjusted hex color
   */
  adjustBrightness(hex, factor) {
    const rgb = this.hexToRgb(hex);

    return this.rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
  },

  /**
   * Creates a color with specified opacity
   * @param {string} hex - Hex color code
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} RGBA color string
   */
  withOpacity(hex, opacity) {
    const rgb = this.hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  /**
   * Checks if two colors are similar
   * @param {Object} color1 - RGB color object {r, g, b}
   * @param {Object} color2 - RGB color object {r, g, b}
   * @param {number} tolerance - Tolerance for similarity (0-255)
   * @returns {boolean} True if colors are similar
   */
  areSimilar(color1, color2, tolerance = 5) {
    return (
      Math.abs(color1.r - color2.r) <= tolerance &&
      Math.abs(color1.g - color2.g) <= tolerance &&
      Math.abs(color1.b - color2.b) <= tolerance
    );
  },
};
