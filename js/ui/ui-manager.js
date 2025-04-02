// UI Manager - Handles UI interactions and updates

class UIManager {
  constructor(canvasManager, toolManager) {
    this.canvasManager = canvasManager;
    this.toolManager = toolManager;

    this.panels = {
      brush: document.getElementById("brushPanel"),
      eraser: document.getElementById("eraserPanel"),
      layers: document.getElementById("layersPanel"),
      canvas: document.getElementById("canvasPanel"),
    };

    this.activePanel = "brush";
    this.initToolbarButtons();
    this.initColorPicker();
    this.initBrushSettings();
    this.initEraserSettings();
    this.initCanvasSettings();
  }

  initToolbarButtons() {
    // Tool buttons
    const toolButtons = document.querySelectorAll(".tool-btn");
    toolButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        toolButtons.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        // Hide all panels
        Object.values(this.panels).forEach((panel) => {
          if (panel) panel.style.display = "none";
        });

        // Determine which tool was selected and show the appropriate panel
        if (btn.id === "brushTool") {
          this.activePanel = "brush";
          this.toolManager.setActiveTool("brush");
          if (this.panels.brush) this.panels.brush.style.display = "block";
        } else if (btn.id === "eraserTool") {
          this.activePanel = "eraser";
          this.toolManager.setActiveTool("eraser");
          if (this.panels.eraser) this.panels.eraser.style.display = "block";
        } else if (btn.id === "fillTool") {
          this.activePanel = "fill";
          this.toolManager.setActiveTool("fill");
          // Fill tool might use brush panel settings
          if (this.panels.brush) this.panels.brush.style.display = "block";
        } else if (btn.id === "layersTool") {
          this.activePanel = "layers";
          if (this.panels.layers) this.panels.layers.style.display = "block";
        } else if (btn.id === "settingsTool") {
          this.activePanel = "canvas";
          if (this.panels.canvas) this.panels.canvas.style.display = "block";
        }
      });
    });
  }

  initColorPicker() {
    const colorWheel = document.getElementById("colorWheel");
    const hexInput = document.getElementById("hexInput");

    if (colorWheel && hexInput && this.toolManager) {
      // Update hex input when color wheel changes
      colorWheel.addEventListener("input", (e) => {
        const color = e.target.value;
        hexInput.value = color;
        this.toolManager.setColor(color);
      });

      // Update color wheel when hex input changes
      hexInput.addEventListener("input", (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
          colorWheel.value = color;
          this.toolManager.setColor(color);
        }
      });

      // Initial color setting
      this.toolManager.setColor(colorWheel.value);
    }
  }

  initBrushSettings() {
    const brushSize = document.getElementById("brushSize");
    const brushSizeValue = document.getElementById("brushSizeValue");
    const brushOpacity = document.getElementById("brushOpacity");
    const brushOpacityValue = document.getElementById("brushOpacityValue");
    const brushPreviews = document.querySelectorAll(".brush-preview");
    const customBrushBtn = document.getElementById("customBrushBtn");
    const brushFileInput = document.getElementById("brushFileInput");

    if (brushSize && brushSizeValue) {
      brushSize.addEventListener("input", (e) => {
        const size = e.target.value;
        brushSizeValue.textContent = size;
        this.toolManager.setSize("brush", parseInt(size));
      });

      // Set initial brush size
      this.toolManager.setSize("brush", parseInt(brushSize.value));
    }

    if (brushOpacity && brushOpacityValue) {
      brushOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        brushOpacityValue.textContent = opacity;
        this.toolManager.setOpacity("brush", parseInt(opacity) / 100);
      });

      // Set initial brush opacity
      this.toolManager.setOpacity("brush", parseInt(brushOpacity.value) / 100);
    }

    // Brush type selection
    if (brushPreviews) {
      brushPreviews.forEach((preview) => {
        preview.addEventListener("click", () => {
          brushPreviews.forEach((p) => p.classList.remove("active"));
          preview.classList.add("active");
          this.toolManager.setBrushType(preview.dataset.brush);
        });
      });
    }

    // Custom brush upload
    if (customBrushBtn && brushFileInput) {
      customBrushBtn.addEventListener("click", () => {
        brushFileInput.click();
      });

      brushFileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              this.toolManager.setCustomBrush(img);
              // Visual feedback for selection
              brushPreviews.forEach((p) => p.classList.remove("active"));
              customBrushBtn.classList.add("active");
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }
  }

  initEraserSettings() {
    const eraserSize = document.getElementById("eraserSize");
    const eraserSizeValue = document.getElementById("eraserSizeValue");
    const eraserOpacity = document.getElementById("eraserOpacity");
    const eraserOpacityValue = document.getElementById("eraserOpacityValue");

    if (eraserSize && eraserSizeValue) {
      eraserSize.addEventListener("input", (e) => {
        const size = e.target.value;
        eraserSizeValue.textContent = size;
        this.toolManager.setSize("eraser", parseInt(size));
      });

      // Set initial eraser size
      this.toolManager.setSize("eraser", parseInt(eraserSize.value));
    }

    if (eraserOpacity && eraserOpacityValue) {
      eraserOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        eraserOpacityValue.textContent = opacity;
        this.toolManager.setOpacity("eraser", parseInt(opacity) / 100);
      });

      // Set initial eraser opacity
      this.toolManager.setOpacity(
        "eraser",
        parseInt(eraserOpacity.value) / 100
      );
    }
  }

  initCanvasSettings() {
    const canvasSizeOptions = document.querySelectorAll(".canvas-size-option");
    const customWidth = document.getElementById("customWidth");
    const customHeight = document.getElementById("customHeight");
    const applyCustomSize = document.getElementById("applyCustomSize");
    const clearCanvasBtn = document.getElementById("clearCanvasBtn");
    const resetCanvasBtn = document.getElementById("resetCanvasBtn");

    // Canvas size presets
    if (canvasSizeOptions) {
      canvasSizeOptions.forEach((option) => {
        option.addEventListener("click", () => {
          canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          option.classList.add("active");

          const width = parseInt(option.dataset.width);
          const height = parseInt(option.dataset.height);
          this.canvasManager.resizeCanvas(width, height);
        });
      });
    }

    // Custom canvas size
    if (applyCustomSize && customWidth && customHeight) {
      applyCustomSize.addEventListener("click", () => {
        const width = parseInt(customWidth.value);
        const height = parseInt(customHeight.value);

        if (width >= 50 && width <= 4000 && height >= 50 && height <= 4000) {
          canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          this.canvasManager.resizeCanvas(width, height);
        } else {
          alert("Please enter valid dimensions (50-4000px)");
        }
      });
    }

    // Clear canvas
    if (clearCanvasBtn) {
      clearCanvasBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the canvas?")) {
          this.canvasManager.clearCanvas();
        }
      });
    }

    // Reset all
    if (resetCanvasBtn) {
      resetCanvasBtn.addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to reset everything? This will clear all layers and settings."
          )
        ) {
          this.canvasManager.resetAll();
        }
      });
    }
  }

  updateLayersList(layers, activeLayerIndex) {
    const layersList = document.getElementById("layersList");
    if (!layersList) return;

    // Clear existing layers
    layersList.innerHTML = "";

    // Add each layer to the list
    layers.forEach((layer, index) => {
      const layerItem = document.createElement("div");
      layerItem.className = "layer-item";
      if (index === activeLayerIndex) {
        layerItem.classList.add("active");
      }

      // Layer preview (thumbnail)
      const layerPreview = document.createElement("div");
      layerPreview.className = "layer-preview";
      // Add mini preview of layer content if possible

      // Layer name
      const layerName = document.createElement("div");
      layerName.className = "layer-name";
      layerName.textContent = layer.name || `Layer ${index + 1}`;

      // Visibility toggle button
      const visibilityBtn = document.createElement("button");
      visibilityBtn.className = "layer-visibility";
      visibilityBtn.title = "Toggle Visibility";
      visibilityBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" 
            stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;

      if (!layer.visible) {
        visibilityBtn.classList.add("hidden");
        visibilityBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" 
              stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          `;
      }

      // Add event listeners
      layerItem.addEventListener("click", () => {
        document.querySelectorAll(".layer-item").forEach((item) => {
          item.classList.remove("active");
        });
        layerItem.classList.add("active");
        this.toolManager.setActiveLayer(index);
      });

      visibilityBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent layer selection
        this.toolManager.toggleLayerVisibility(index);
      });

      // Assemble layer item
      layerItem.appendChild(layerPreview);
      layerItem.appendChild(layerName);
      layerItem.appendChild(visibilityBtn);
      layersList.appendChild(layerItem);
    });
  }
}
