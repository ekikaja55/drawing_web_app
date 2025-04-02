class CanvasManager {
  constructor() {
    this.canvas = document.getElementById("drawingCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = 800;
    this.height = 600;
    this.zoomLevel = 1;
    this.panOffset = { x: 0, y: 0 };
    this.isDrawing = false;
    this.layers = [];
    this.activeLayerIndex = 0;

    this.setupCanvas();
    this.setupEventListeners();
    this.initializeLayers();
  }

  setupCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.updateCanvasSize();

    // Set default styles
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  updateCanvasSize() {
    const container = document.querySelector(".canvas-wrapper");
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate the scale factor to fit the canvas in the container
    const scaleX = containerWidth / this.width;
    const scaleY = containerHeight / this.height;
    const scale = Math.min(scaleX, scaleY);

    // Update canvas display size
    this.canvas.style.width = `${this.width * scale * this.zoomLevel}px`;
    this.canvas.style.height = `${this.height * scale * this.zoomLevel}px`;
  }

  initializeLayers() {
    // Create an initial layer
    this.addLayer();
  }

  addLayer() {
    const layerCanvas = document.createElement("canvas");
    layerCanvas.width = this.width;
    layerCanvas.height = this.height;

    const layer = {
      canvas: layerCanvas,
      ctx: layerCanvas.getContext("2d"),
      name: `Layer ${this.layers.length + 1}`,
      visible: true,
    };

    this.layers.push(layer);
    this.activeLayerIndex = this.layers.length - 1;
    return layer;
  }

  getActiveLayer() {
    return this.layers[this.activeLayerIndex];
  }

  setActiveLayer(index) {
    if (index >= 0 && index < this.layers.length) {
      this.activeLayerIndex = index;
      return true;
    }
    return false;
  }

  toggleLayerVisibility(index) {
    if (index >= 0 && index < this.layers.length) {
      this.layers[index].visible = !this.layers[index].visible;
      this.redrawCanvas();
      return true;
    }
    return false;
  }

  duplicateLayer(index) {
    if (index >= 0 && index < this.layers.length) {
      const sourceLayer = this.layers[index];
      const newLayer = this.addLayer();

      // Copy the content from the source layer
      newLayer.ctx.drawImage(sourceLayer.canvas, 0, 0);
      newLayer.name = `${sourceLayer.name} copy`;

      return true;
    }
    return false;
  }

  deleteLayer(index) {
    if (this.layers.length <= 1) {
      return false; // Don't delete the last layer
    }

    if (index >= 0 && index < this.layers.length) {
      this.layers.splice(index, 1);

      // Adjust active layer index if needed
      if (this.activeLayerIndex >= this.layers.length) {
        this.activeLayerIndex = this.layers.length - 1;
      }

      this.redrawCanvas();
      return true;
    }
    return false;
  }

  resizeCanvas(width, height) {
    // Store the old dimensions
    const oldWidth = this.width;
    const oldHeight = this.height;

    // Update dimensions
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;

    // Resize all layers
    this.layers.forEach((layer) => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = oldWidth;
      tempCanvas.height = oldHeight;
      const tempCtx = tempCanvas.getContext("2d");

      // Copy the old content
      tempCtx.drawImage(layer.canvas, 0, 0);

      // Resize the layer canvas
      layer.canvas.width = width;
      layer.canvas.height = height;

      // Draw the old content on the resized canvas
      layer.ctx.drawImage(tempCanvas, 0, 0);
    });

    this.updateCanvasSize();
    this.redrawCanvas();
  }

  clearCanvas() {
    const activeLayer = this.getActiveLayer();
    if (activeLayer) {
      activeLayer.ctx.clearRect(0, 0, this.width, this.height);
      this.redrawCanvas();
    }
  }

  clearAllLayers() {
    this.layers.forEach((layer) => {
      layer.ctx.clearRect(0, 0, this.width, this.height);
    });
    this.redrawCanvas();
  }

  redrawCanvas() {
    // Clear the main canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw all visible layers
    this.layers.forEach((layer) => {
      if (layer.visible) {
        this.ctx.drawImage(layer.canvas, 0, 0);
      }
    });
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.updateCanvasSize();
    });
  }

  getCanvasAsDataURL(format = "png", quality = 0.8) {
    // Create a temporary canvas to composite all visible layers
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw all visible layers
    this.layers.forEach((layer) => {
      if (layer.visible) {
        tempCtx.drawImage(layer.canvas, 0, 0);
      }
    });

    // Convert to data URL
    if (format === "png") {
      return tempCanvas.toDataURL("image/png");
    } else if (format === "jpeg") {
      return tempCanvas.toDataURL("image/jpeg", quality);
    } else if (format === "webp") {
      return tempCanvas.toDataURL("image/webp", quality);
    }

    return tempCanvas.toDataURL();
  }
}

// Export for use in other modules
window.CanvasManager = CanvasManager;
