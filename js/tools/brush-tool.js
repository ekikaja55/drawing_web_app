class BrushTool {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.canvas;

    this.color = "#000000";
    this.size = 10;
    this.opacity = 1.0;
    this.type = "round";
    this.customBrush = null;

    this.isDrawing = false;
    this.lastPoint = null;

    this.colorWheel = document.getElementById("colorWheel");
    this.hexInput = document.getElementById("hexInput");
    this.brushSize = document.getElementById("brushSize");
    this.brushSizeValue = document.getElementById("brushSizeValue");
    this.brushOpacity = document.getElementById("brushOpacity");
    this.brushOpacityValue = document.getElementById("brushOpacityValue");
    this.brushPreviews = document.querySelectorAll(".brush-preview");
    this.customBrushBtn = document.getElementById("customBrushBtn");
    this.brushFileInput = document.getElementById("brushFileInput");

    this.setupEventListeners();
  }

  setColor(color) {
    this.color = color;
  }

  setSize(size) {
    this.size = size;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
  }

  setBrushType(type) {
    this.type = type;
    this.customBrush = null;
  }

  setCustomBrush(img) {
    this.customBrush = img;
    this.type = "custom";
  }

  activate() {
    this.setupCanvasListeners();
  }

  deactivate() {
    this.removeCanvasListeners();
  }

  setupEventListeners() {
    this.colorWheel.addEventListener("input", () => {
      this.color = this.colorWheel.value;
      this.hexInput.value = this.color;
    });

    this.hexInput.addEventListener("change", () => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (hexRegex.test(this.hexInput.value)) {
        this.color = this.hexInput.value;
        this.colorWheel.value = this.color;
      } else {
        this.hexInput.value = this.color;
      }
    });

    this.brushSize.addEventListener("input", () => {
      this.size = parseInt(this.brushSize.value);
      this.brushSizeValue.textContent = this.size;
    });

    this.brushOpacity.addEventListener("input", () => {
      this.opacity = parseInt(this.brushOpacity.value) / 100;
      this.brushOpacityValue.textContent = this.brushOpacity.value;
    });

    this.brushPreviews.forEach((preview) => {
      preview.addEventListener("click", () => {
        this.brushPreviews.forEach((p) => p.classList.remove("active"));
        preview.classList.add("active");
        this.type = preview.dataset.brush;
        this.customBrush = null;
      });
    });

    this.customBrushBtn.addEventListener("click", () => {
      this.brushFileInput.click();
    });

    this.brushFileInput.addEventListener("change", () => {
      if (this.brushFileInput.files && this.brushFileInput.files[0]) {
        const file = this.brushFileInput.files[0];

        if (file.type.match("image.*")) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              this.customBrush = img;
              this.type = "custom";

              this.brushPreviews.forEach((p) => p.classList.remove("active"));
              this.customBrushBtn.classList.add("active");
            };
            img.src = e.target.result;
          };

          reader.readAsDataURL(file);
        }
      }
    });
  }

  setupCanvasListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.canvas.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  removeCanvasListeners() {
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.canvas.removeEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    window.removeEventListener("mouseup", this.handleMouseUp.bind(this));

    this.canvas.removeEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
    this.canvas.removeEventListener(
      "touchmove",
      this.handleTouchMove.bind(this)
    );
    this.canvas.removeEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleMouseDown(e) {
    this.isDrawing = true;
    const point = this.getCanvasPoint(e);
    this.lastPoint = point;
    this.drawDot(point);
  }

  handleMouseMove(e) {
    if (!this.isDrawing) return;

    const point = this.getCanvasPoint(e);
    this.drawLine(this.lastPoint, point);
    this.lastPoint = point;
  }

  handleMouseUp() {
    this.isDrawing = false;
    this.lastPoint = null;

    this.canvasManager.redrawCanvas();
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      this.isDrawing = true;
      const point = this.getCanvasPointFromTouch(e.touches[0]);
      this.lastPoint = point;
      this.drawDot(point);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (!this.isDrawing || e.touches.length === 0) return;

    const point = this.getCanvasPointFromTouch(e.touches[0]);
    this.drawLine(this.lastPoint, point);
    this.lastPoint = point;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.isDrawing = false;
    this.lastPoint = null;

    this.canvasManager.redrawCanvas();
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  getCanvasPointFromTouch(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  drawDot(point) {
    const layer = this.canvasManager.getActiveLayer();
    if (!layer || !layer.visible) return;

    const ctx = layer.ctx;
    ctx.globalAlpha = this.opacity;

    if (this.type === "custom" && this.customBrush) {
      const halfSize = this.size / 2;
      ctx.drawImage(
        this.customBrush,
        point.x - halfSize,
        point.y - halfSize,
        this.size,
        this.size
      );
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();

      if (this.type === "round" || this.type === "soft") {
        ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2);
      } else if (this.type === "square") {
        const halfSize = this.size / 2;
        ctx.rect(point.x - halfSize, point.y - halfSize, this.size, this.size);
      } else if (this.type === "texture") {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * (this.size / 2);
          const x = point.x + Math.cos(angle) * distance;
          const y = point.y + Math.sin(angle) * distance;

          ctx.beginPath();
          ctx.arc(x, y, Math.random() * (this.size / 4) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      ctx.fill();

      if (this.type === "soft") {
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          this.size / 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    this.canvasManager.redrawCanvas();
  }

  drawLine(from, to) {
    const layer = this.canvasManager.getActiveLayer();
    if (!layer || !layer.visible) return;

    const ctx = layer.ctx;
    ctx.globalAlpha = this.opacity;

    if (this.type === "custom" && this.customBrush) {
      const distance = Math.sqrt(
        Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
      );
      const steps = Math.max(Math.floor(distance / (this.size / 4)), 1);

      for (let i = 0; i <= steps; i++) {
        const point = {
          x: from.x + (to.x - from.x) * (i / steps),
          y: from.y + (to.y - from.y) * (i / steps),
        };

        const halfSize = this.size / 2;
        ctx.drawImage(
          this.customBrush,
          point.x - halfSize,
          point.y - halfSize,
          this.size,
          this.size
        );
      }
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (this.type === "texture") {
        const distance = Math.sqrt(
          Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)
        );
        const steps = Math.max(Math.floor(distance / (this.size / 8)), 1);

        ctx.fillStyle = this.color;
        for (let i = 0; i <= steps; i++) {
          const point = {
            x: from.x + (to.x - from.x) * (i / steps),
            y: from.y + (to.y - from.y) * (i / steps),
          };

          for (let j = 0; j < 3; j++) {
            const angle = Math.random() * Math.PI * 2;
            const jitter = (Math.random() * this.size) / 2;
            const x = point.x + Math.cos(angle) * jitter;
            const y = point.y + Math.sin(angle) * jitter;

            ctx.beginPath();
            ctx.arc(x, y, Math.random() * (this.size / 4) + 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (this.type === "soft") {
        const blur = 2;
        for (let i = 0; i < blur; i++) {
          ctx.globalAlpha = (this.opacity / (i + 1)) * 0.5;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        ctx.globalAlpha = this.opacity;
      } else {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    }

    this.canvasManager.redrawCanvas();
  }
}

window.BrushTool = BrushTool;
