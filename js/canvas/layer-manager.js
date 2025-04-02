class LayerManager {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.layersList = document.getElementById("layersList");

    this.setupEventListeners();
    this.updateLayersList();
  }

  // Add this method to get layers from the canvas manager
  getLayers() {
    return this.canvasManager.layers;
  }

  // Add this method to get the current layer index
  getCurrentLayerIndex() {
    return this.canvasManager.activeLayerIndex;
  }

  // Add this method to set the current layer
  setCurrentLayer(index) {
    this.canvasManager.setActiveLayer(index);
  }

  // Add this method to toggle layer visibility
  toggleLayerVisibility(index) {
    this.canvasManager.toggleLayerVisibility(index);
  }

  // Add these methods to match the ones called in app.js
  addLayer() {
    this.canvasManager.addLayer();
    this.updateLayersList();
  }

  duplicateCurrentLayer() {
    this.canvasManager.duplicateLayer(this.canvasManager.activeLayerIndex);
    this.updateLayersList();
  }

  deleteCurrentLayer() {
    this.canvasManager.deleteLayer(this.canvasManager.activeLayerIndex);
    this.updateLayersList();
  }

  updateLayersList() {
    // Clear the current list
    this.layersList.innerHTML = "";

    // Add each layer to the list
    this.canvasManager.layers.forEach((layer, index) => {
      const layerItem = document.createElement("div");
      layerItem.className = "layer-item";
      if (index === this.canvasManager.activeLayerIndex) {
        layerItem.classList.add("active");
      }

      // Create layer preview
      const layerPreview = document.createElement("div");
      layerPreview.className = "layer-preview";
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = 40;
      previewCanvas.height = 30;
      const previewCtx = previewCanvas.getContext("2d");

      // Scale down the layer content for preview
      const scaleX = previewCanvas.width / layer.canvas.width;
      const scaleY = previewCanvas.height / layer.canvas.height;
      previewCtx.scale(scaleX, scaleY);
      previewCtx.drawImage(layer.canvas, 0, 0);

      layerPreview.appendChild(previewCanvas);
      layerItem.appendChild(layerPreview);

      // Layer name
      const layerName = document.createElement("div");
      layerName.className = "layer-name";
      layerName.textContent = layer.name;
      layerItem.appendChild(layerName);

      // Layer visibility toggle
      const visibilityBtn = document.createElement("button");
      visibilityBtn.className = "layer-visibility";
      visibilityBtn.title = "Toggle Visibility";
      visibilityBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;

      if (!layer.visible) {
        visibilityBtn.classList.add("hidden");
        visibilityBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          `;
      }

      visibilityBtn.addEventListener("click", () => {
        this.canvasManager.toggleLayerVisibility(index);
        this.updateLayersList();
      });

      layerItem.appendChild(visibilityBtn);

      // Make layer selectable
      layerItem.addEventListener("click", (e) => {
        // Skip if clicking on the visibility button
        if (e.target !== visibilityBtn && !visibilityBtn.contains(e.target)) {
          this.canvasManager.setActiveLayer(index);
          this.updateLayersList();
        }
      });

      this.layersList.appendChild(layerItem);
    });
  }

  setupEventListeners() {
    const addLayerBtn = document.getElementById("addLayerBtn");
    const duplicateLayerBtn = document.getElementById("duplicateLayerBtn");
    const deleteLayerBtn = document.getElementById("deleteLayerBtn");

    if (addLayerBtn) {
      addLayerBtn.addEventListener("click", () => {
        this.addLayer();
      });
    }

    if (duplicateLayerBtn) {
      duplicateLayerBtn.addEventListener("click", () => {
        this.duplicateCurrentLayer();
      });
    }

    if (deleteLayerBtn) {
      deleteLayerBtn.addEventListener("click", () => {
        this.deleteCurrentLayer();
      });
    }
  }
}

// Export for use in other modules
window.LayerManager = LayerManager;
