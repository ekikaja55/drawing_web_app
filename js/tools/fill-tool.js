class FillTool {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.canvas;

    this.color = "#000000";
    this.tolerance = 32;
  }

  activate() {
    this.fillColorWheel = document.getElementById("fillColorWheel");
    this.fillHexInput = document.getElementById("fillHexInput");
    this.fillTolerance = document.getElementById("fillTolerance");
    this.fillToleranceValue = document.getElementById("fillToleranceValue");

    if (
      this.fillColorWheel &&
      this.fillHexInput &&
      this.fillTolerance &&
      this.fillToleranceValue
    ) {
      this.setupEventListeners();
    }

    this.setupCanvasListeners();
  }

  deactivate() {
    this.removeCanvasListeners();
  }

  setupEventListeners() {
    this.fillColorWheel.addEventListener("input", () => {
      this.color = this.fillColorWheel.value;
      this.fillHexInput.value = this.color;
    });

    this.fillHexInput.addEventListener("change", () => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (hexRegex.test(this.fillHexInput.value)) {
        this.color = this.fillHexInput.value;
        this.fillColorWheel.value = this.color;
      } else {
        this.fillHexInput.value = this.color;
      }
    });

    this.fillTolerance.addEventListener("input", () => {
      this.tolerance = parseInt(this.fillTolerance.value);
      this.fillToleranceValue.textContent = this.tolerance;
    });
  }

  setupCanvasListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));

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
    e.preventDefault();
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

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const targetPos = (point.y * width + point.x) * 4;
    const targetR = data[targetPos];
    const targetG = data[targetPos + 1];
    const targetB = data[targetPos + 2];
    const targetA = data[targetPos + 3];

    const fillColor = this.hexToRgb(this.color);

    const stack = [point.x, point.y];
    const visited = new Set();
    const key = (x, y) => `${x},${y}`;

    while (stack.length > 0) {
      const y = stack.pop();
      const x = stack.pop();

      if (
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        visited.has(key(x, y))
      ) {
        continue;
      }

      const pos = (y * width + x) * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const a = data[pos + 3];

      if (!this.colorMatch(r, g, b, a, targetR, targetG, targetB, targetA)) {
        continue;
      }

      visited.add(key(x, y));

      data[pos] = fillColor.r;
      data[pos + 1] = fillColor.g;
      data[pos + 2] = fillColor.b;
      data[pos + 3] = 255;

      stack.push(x + 1, y);
      stack.push(x - 1, y);
      stack.push(x, y + 1);
      stack.push(x, y - 1);

      stack.push(x + 1, y + 1);
      stack.push(x - 1, y - 1);
      stack.push(x + 1, y - 1);
      stack.push(x - 1, y + 1);
    }

    ctx.putImageData(imageData, 0, 0);

    this.canvasManager.redrawCanvas();
  }

  colorMatch(r1, g1, b1, a1, r2, g2, b2, a2) {
    if (a1 < 10 && a2 < 10) return true;

    if ((a1 < 10 && a2 >= 10) || (a2 < 10 && a1 >= 10)) return false;

    const rDiff = Math.abs(r1 - r2);
    const gDiff = Math.abs(g1 - g2);
    const bDiff = Math.abs(b1 - b2);
    const aDiff = Math.abs(a1 - a2);

    const diff = rDiff + gDiff + bDiff + aDiff;

    return diff <= this.tolerance * 4;
  }

  hexToRgb(hex) {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  }
}

window.FillTool = FillTool;
