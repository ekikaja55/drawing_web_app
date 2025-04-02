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
        // Check if setColor exists, if not use a different approach
        if (typeof this.toolManager.setColor === "function") {
          this.toolManager.setColor(color);
        } else if (typeof this.toolManager.setBrushColor === "function") {
          // Alternative method name that might exist
          this.toolManager.setBrushColor(color);
        } else {
          // Fallback: Store color in toolManager directly
          this.toolManager.currentColor = color;
          console.log("Using fallback color storage:", color);
        }
      });

      // Update color wheel when hex input changes
      hexInput.addEventListener("input", (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
          colorWheel.value = color;
          // Check if setColor exists, if not use a different approach
          if (typeof this.toolManager.setColor === "function") {
            this.toolManager.setColor(color);
          } else if (typeof this.toolManager.setBrushColor === "function") {
            // Alternative method name that might exist
            this.toolManager.setBrushColor(color);
          } else {
            // Fallback: Store color in toolManager directly
            this.toolManager.currentColor = color;
            console.log("Using fallback color storage:", color);
          }
        }
      });

      // Initial color setting - with safeguard
      try {
        if (typeof this.toolManager.setColor === "function") {
          this.toolManager.setColor(colorWheel.value);
        } else if (typeof this.toolManager.setBrushColor === "function") {
          this.toolManager.setBrushColor(colorWheel.value);
        } else {
          this.toolManager.currentColor = colorWheel.value;
          console.log("Using fallback color storage:", colorWheel.value);
        }
      } catch (err) {
        console.warn("Failed to set initial color:", err);
      }
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

    if (brushSize && brushSizeValue && this.toolManager) {
      brushSize.addEventListener("input", (e) => {
        const size = e.target.value;
        brushSizeValue.textContent = size;
        if (typeof this.toolManager.setSize === "function") {
          this.toolManager.setSize("brush", parseInt(size));
        }
      });

      // Set initial brush size
      if (typeof this.toolManager.setSize === "function") {
        try {
          this.toolManager.setSize("brush", parseInt(brushSize.value));
        } catch (err) {
          console.warn("Failed to set initial brush size:", err);
        }
      }
    }

    if (brushOpacity && brushOpacityValue && this.toolManager) {
      brushOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        brushOpacityValue.textContent = opacity;
        if (typeof this.toolManager.setOpacity === "function") {
          this.toolManager.setOpacity("brush", parseInt(opacity) / 100);
        }
      });

      // Set initial brush opacity
      if (typeof this.toolManager.setOpacity === "function") {
        try {
          this.toolManager.setOpacity("brush", parseInt(brushOpacity.value) / 100);
        } catch (err) {
          console.warn("Failed to set initial brush opacity:", err);
        }
      }
    }

    // Brush type selection
    if (brushPreviews && this.toolManager) {
      brushPreviews.forEach((preview) => {
        preview.addEventListener("click", () => {
          brushPreviews.forEach((p) => p.classList.remove("active"));
          preview.classList.add("active");
          if (typeof this.toolManager.setBrushType === "function") {
            this.toolManager.setBrushType(preview.dataset.brush);
          }
        });
      });
    }

    // Custom brush upload
    if (customBrushBtn && brushFileInput && this.toolManager) {
      customBrushBtn.addEventListener("click", () => {
        brushFileInput.click();
      });

      brushFileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              if (typeof this.toolManager.setCustomBrush === "function") {
                this.toolManager.setCustomBrush(img);
              }
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

    if (eraserSize && eraserSizeValue && this.toolManager) {
      eraserSize.addEventListener("input", (e) => {
        const size = e.target.value;
        eraserSizeValue.textContent = size;
        if (typeof this.toolManager.setSize === "function") {
          this.toolManager.setSize("eraser", parseInt(size));
        }
      });

      // Set initial eraser size
      if (typeof this.toolManager.setSize === "function") {
        try {
          this.toolManager.setSize("eraser", parseInt(eraserSize.value));
        } catch (err) {
          console.warn("Failed to set initial eraser size:", err);
        }
      }
    }

    if (eraserOpacity && eraserOpacityValue && this.toolManager) {
      eraserOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        eraserOpacityValue.textContent = opacity;
        if (typeof this.toolManager.setOpacity === "function") {
          this.toolManager.setOpacity("eraser", parseInt(opacity) / 100);
        }
      });

      // Set initial eraser opacity
      if (typeof this.toolManager.setOpacity === "function") {
        try {
          this.toolManager.setOpacity(
            "eraser",
            parseInt(eraserOpacity.value) / 100
          );
        } catch (err) {
          console.warn("Failed to set initial eraser opacity:", err);
        }
      }
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
    if (canvasSizeOptions && this.canvasManager) {
      canvasSizeOptions.forEach((option) => {
        option.addEventListener("click", () => {
          canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          option.classList.add("active");

          const width = parseInt(option.dataset.width);
          const height = parseInt(option.dataset.height);
          if (typeof this.canvasManager.resizeCanvas === "function") {
            this.canvasManager.resizeCanvas(width, height);
          }
        });
      });
    }

    // Custom canvas size
    if (applyCustomSize && customWidth && customHeight && this.canvasManager) {
      applyCustomSize.addEventListener("click", () => {
        const width = parseInt(customWidth.value);
        const height = parseInt(customHeight.value);

        if (width >= 50 && width <= 4000 && height >= 50 && height <= 4000) {
          canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          if (typeof this.canvasManager.resizeCanvas === "function") {
            this.canvasManager.resizeCanvas(width, height);
          }
        } else {
          alert("Please enter valid dimensions (50-4000px)");
        }
      });
    }

    // Clear canvas
    if (clearCanvasBtn && this.canvasManager) {
      clearCanvasBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the canvas?")) {
          if (typeof this.canvasManager.clearCanvas === "function") {
            this.canvasManager.clearCanvas();
          }
        }
      });
    }

    // Reset all
    if (resetCanvasBtn && this.canvasManager) {
      resetCanvasBtn.addEventListener("click", () => {
        if (
          confirm(
            "Are you sure you want to reset everything? This will clear all layers and settings."
          )
        ) {
          if (typeof this.canvasManager.resetAll === "function") {
            this.canvasManager.resetAll();
          }
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
        if (typeof this.toolManager.setActiveLayer === "function") {
          this.toolManager.setActiveLayer(index);
        }
      });

      visibilityBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent layer selection
        if (typeof this.toolManager.toggleLayerVisibility === "function") {
          this.toolManager.toggleLayerVisibility(index);
        }
      });

      // Assemble layer item
      layerItem.appendChild(layerPreview);
      layerItem.appendChild(layerName);
      layerItem.appendChild(visibilityBtn);
      layersList.appendChild(layerItem);
    });
  }
}