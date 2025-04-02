class FillTool {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.canvas;

    // Fill settings
    this.color = "#000000";
    this.tolerance = 32; // Color difference tolerance (0-255)

    // UI elements
    this.fillColorWheel = document.getElementById("fillColorWheel");
    this.fillHexInput = document.getElementById("fillHexInput");
    this.fillTolerance = document.getElementById("fillTolerance");
    this.fillToleranceValue = document.getElementById("fillToleranceValue");

    this.setupEventListeners();
  }

  activate() {
    this.setupCanvasListeners();
  }

  deactivate() {
    this.removeCanvasListeners();
  }

  setupEventListeners() {
    // Color picker
    this.fillColorWheel.addEventListener("input", () => {
      this.color = this.fillColorWheel.value;
      this.fillHexInput.value = this.color;
    });

    this.fillHexInput.addEventListener("change", () => {
      // Validate hex color
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (hexRegex.test(this.fillHexInput.value)) {
        this.color = this.fillHexInput.value;
        this.fillColorWheel.value = this.color;
      } else {
        this.fillHexInput.value = this.color;
      }
    });

    // Tolerance slider
    this.fillTolerance.addEventListener("input", () => {
      this.tolerance = parseInt(this.fillTolerance.value);
      this.fillToleranceValue.textContent = this.tolerance;
    });
  }

  setupCanvasListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    // Touch events for mobile
    this.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
  }

  removeCanvasListeners() {
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.canvas.removeEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
  }

  handleMouseDown(e) {
    const point = this.getCanvasPoint(e);
    this.fill(point);
  }

  handleTouchStart(e) {
    e.preventDefault(); // Prevent scrolling
    if (e.touches.length > 0) {
      const point = this.getCanvasPointFromTouch(e.touches[0]);
      this.fill(point);
    }
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  }

  getCanvasPointFromTouch(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: Math.floor((touch.clientX - rect.left) * scaleX),
      y: Math.floor((touch.clientY - rect.top) * scaleY),
    };
  }

  fill(point) {
    const layer = this.canvasManager.getActiveLayer();
    if (!layer || !layer.visible) return;

    const ctx = layer.ctx;
    const width = this.canvasManager.width;
    const height = this.canvasManager.height;

    // Get the image data to work with
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Get the target color at the clicked point
    const targetPos = (point.y * width + point.x) * 4;
    const targetR = data[targetPos];
    const targetG = data[targetPos + 1];
    const targetB = data[targetPos + 2];
    const targetA = data[targetPos + 3];

    // Parse the fill color
    const fillColor = this.hexToRgb(this.color);

    // Stack-based flood fill algorithm
    const stack = [point.x, point.y];
    const visited = new Set();
    const key = (x, y) => `${x},${y}`;

    while (stack.length > 0) {
      const y = stack.pop();
      const x = stack.pop();

      // Skip if out of bounds or already visited
      if (
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        visited.has(key(x, y))
      ) {
        continue;
      }

      // Get the current pixel position
      const pos = (y * width + x) * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];

      // Check if this pixel is within tolerance of the target color
      if (!this.colorMatch(r, g, b, a, targetR, targetG, targetB, targetA)) {
        continue;
      }

      // Mark as visited
      visited.add(key(x, y));

      // Set the new color
      data[pos] = fillColor.r;
      data[pos + 1] = fillColor.g;
      data[pos + 2] = fillColor.b;
      data[pos + 3] = 255; // Full opacity

      // Add neighboring pixels to stack
      stack.push(x + 1, y);
      stack.push(x - 1, y);
      stack.push(x, y + 1);
      stack.push(x, y - 1);

      // Add diagonals for better fill
      stack.push(x + 1, y + 1);
      stack.push(x - 1, y - 1);
      stack.push(x + 1, y - 1);
      stack.push(x - 1, y + 1);
    }

    // Put the new image data back
    ctx.putImageData(imageData, 0, 0);

    // Update the main canvas
    this.canvasManager.redrawCanvas();
  }

  colorMatch(r1, g1, b1, a1, r2, g2, b2, a2) {
    // For completely transparent pixels (or nearly), always match
    if (a1 < 10 && a2 < 10) return true;

    // If one is transparent and the other isn't, don't match
    if ((a1 < 10 && a2 >= 10) || (a2 < 10 && a1 >= 10)) return false;

    // Calculate color difference
    const rDiff = Math.abs(r1 - r2);
    const gDiff = Math.abs(g1 - g2);
    const bDiff = Math.abs(b1 - b2);
    const aDiff = Math.abs(a1 - a2);

    // Calculate weighted color difference
    const diff = rDiff + gDiff + bDiff + aDiff;

    return diff <= this.tolerance * 4; // Multiplied by 4 because we have 4 channels
  }

  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert short hex to full form
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  }
}

// Export for use in other modules
window.FillTool = FillTool;
