// Mobile.js - Handles mobile-specific UI functionality

class MobileUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.mobilePanel = document.getElementById("mobilePanel");
    this.mobilePanelContent = document.getElementById("mobilePanelContent");
    this.mobilePanelClose = document.getElementById("mobilePanelClose");

    this.initMobileToolbar();
    this.initMobilePanelClose();
  }

  initMobileToolbar() {
    const mobileToolButtons = document.querySelectorAll(".mobile-tool-btn");

    mobileToolButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        mobileToolButtons.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        const tool = btn.dataset.tool;

        // Activate corresponding tool
        if (tool === "brush" || tool === "eraser" || tool === "fill") {
          // Set the active tool in toolManager
          if (
            this.uiManager.toolManager &&
            typeof this.uiManager.toolManager.setActiveTool === "function"
          ) {
            this.uiManager.toolManager.setActiveTool(tool);
          }
        }

        // Show panel for settings if it's layers or settings
        if (tool === "layers" || tool === "settings") {
          this.showMobilePanel(tool);
        } else {
          // For tools, show their settings
          this.showMobilePanel(tool);
        }
      });
    });
  }

  initMobilePanelClose() {
    if (this.mobilePanelClose && this.mobilePanel) {
      this.mobilePanelClose.addEventListener("click", () => {
        this.mobilePanel.style.display = "none";
      });
    }
  }

  showMobilePanel(panelType) {
    if (!this.mobilePanel || !this.mobilePanelContent) return;

    // Clear previous content
    this.mobilePanelContent.innerHTML = "";

    // Clone the appropriate panel into the mobile panel
    let panelToClone;

    switch (panelType) {
      case "brush":
        panelToClone = document.getElementById("brushPanel");
        break;
      case "eraser":
        panelToClone = document.getElementById("eraserPanel");
        break;
      case "layers":
        panelToClone = document.getElementById("layersPanel");
        break;
      case "settings":
        panelToClone = document.getElementById("canvasPanel");
        break;
      case "fill":
        // Fill might use brush settings or have its own
        panelToClone = document.getElementById("brushPanel");
        break;
    }

    if (panelToClone) {
      const clonedContent = panelToClone.cloneNode(true);
      // Make sure it's displayed
      clonedContent.style.display = "block";

      // We need to re-add event listeners to the cloned content
      this.mobilePanelContent.appendChild(clonedContent);

      // Re-initialize controls in mobile panel based on panel type
      this.reinitializeControls(panelType, clonedContent);

      // Show the panel
      this.mobilePanel.style.display = "block";
    }
  }

  // New method to handle re-initializing controls in the mobile panel
  reinitializeControls(panelType, contentElement) {
    switch (panelType) {
      case "brush":
        this.reinitBrushControls(contentElement);
        break;
      case "eraser":
        this.reinitEraserControls(contentElement);
        break;
      case "layers":
        // If layer controls need re-initialization
        break;
      case "settings":
        this.reinitCanvasControls(contentElement);
        break;
    }
  }

  reinitBrushControls(panel) {
    // Re-initialize brush size control
    const brushSize =
      panel.querySelector("#brushSize") || panel.querySelector(".brush-size");
    const brushSizeValue =
      panel.querySelector("#brushSizeValue") ||
      panel.querySelector(".brush-size-value");

    if (brushSize && brushSizeValue && this.uiManager.toolManager) {
      brushSize.addEventListener("input", (e) => {
        const size = e.target.value;
        brushSizeValue.textContent = size;
        if (typeof this.uiManager.toolManager.setSize === "function") {
          this.uiManager.toolManager.setSize("brush", parseInt(size));
        }
      });
    }

    // Re-initialize brush opacity control
    const brushOpacity =
      panel.querySelector("#brushOpacity") ||
      panel.querySelector(".brush-opacity");
    const brushOpacityValue =
      panel.querySelector("#brushOpacityValue") ||
      panel.querySelector(".brush-opacity-value");

    if (brushOpacity && brushOpacityValue && this.uiManager.toolManager) {
      brushOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        brushOpacityValue.textContent = opacity;
        if (typeof this.uiManager.toolManager.setOpacity === "function") {
          this.uiManager.toolManager.setOpacity(
            "brush",
            parseInt(opacity) / 100
          );
        }
      });
    }

    // Re-initialize brush type selection
    const brushPreviews = panel.querySelectorAll(".brush-preview");

    if (brushPreviews && this.uiManager.toolManager) {
      brushPreviews.forEach((preview) => {
        preview.addEventListener("click", () => {
          brushPreviews.forEach((p) => p.classList.remove("active"));
          preview.classList.add("active");
          if (typeof this.uiManager.toolManager.setBrushType === "function") {
            this.uiManager.toolManager.setBrushType(preview.dataset.brush);
          }
        });
      });
    }
  }

  reinitEraserControls(panel) {
    // Similar to brush controls but for eraser
    const eraserSize =
      panel.querySelector("#eraserSize") || panel.querySelector(".eraser-size");
    const eraserSizeValue =
      panel.querySelector("#eraserSizeValue") ||
      panel.querySelector(".eraser-size-value");

    if (eraserSize && eraserSizeValue && this.uiManager.toolManager) {
      eraserSize.addEventListener("input", (e) => {
        const size = e.target.value;
        eraserSizeValue.textContent = size;
        if (typeof this.uiManager.toolManager.setSize === "function") {
          this.uiManager.toolManager.setSize("eraser", parseInt(size));
        }
      });
    }

    // Re-initialize eraser opacity control
    const eraserOpacity =
      panel.querySelector("#eraserOpacity") ||
      panel.querySelector(".eraser-opacity");
    const eraserOpacityValue =
      panel.querySelector("#eraserOpacityValue") ||
      panel.querySelector(".eraser-opacity-value");

    if (eraserOpacity && eraserOpacityValue && this.uiManager.toolManager) {
      eraserOpacity.addEventListener("input", (e) => {
        const opacity = e.target.value;
        eraserOpacityValue.textContent = opacity;
        if (typeof this.uiManager.toolManager.setOpacity === "function") {
          this.uiManager.toolManager.setOpacity(
            "eraser",
            parseInt(opacity) / 100
          );
        }
      });
    }
  }

  reinitCanvasControls(panel) {
    // Canvas size presets
    const canvasSizeOptions = panel.querySelectorAll(".canvas-size-option");

    if (canvasSizeOptions && this.uiManager.canvasManager) {
      canvasSizeOptions.forEach((option) => {
        option.addEventListener("click", () => {
          canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          option.classList.add("active");

          const width = parseInt(option.dataset.width);
          const height = parseInt(option.dataset.height);
          if (typeof this.uiManager.canvasManager.resizeCanvas === "function") {
            this.uiManager.canvasManager.resizeCanvas(width, height);
          }
        });
      });
    }

    // Custom canvas size
    const customWidth = panel.querySelector("#customWidth");
    const customHeight = panel.querySelector("#customHeight");
    const applyCustomSize = panel.querySelector("#applyCustomSize");

    if (
      applyCustomSize &&
      customWidth &&
      customHeight &&
      this.uiManager.canvasManager
    ) {
      applyCustomSize.addEventListener("click", () => {
        const width = parseInt(customWidth.value);
        const height = parseInt(customHeight.value);

        if (width >= 50 && width <= 4000 && height >= 50 && height <= 4000) {
          if (canvasSizeOptions) {
            canvasSizeOptions.forEach((o) => o.classList.remove("active"));
          }
          if (typeof this.uiManager.canvasManager.resizeCanvas === "function") {
            this.uiManager.canvasManager.resizeCanvas(width, height);
          }
        } else {
          alert("Please enter valid dimensions (50-4000px)");
        }
      });
    }
  }
}
