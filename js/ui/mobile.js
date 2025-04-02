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
        mobileToolButtons.forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");

        const tool = btn.dataset.tool;

        if (tool === "brush" || tool === "eraser" || tool === "fill") {
          if (
            this.uiManager.toolManager &&
            typeof this.uiManager.toolManager.setActiveTool === "function"
          ) {
            this.uiManager.toolManager.setActiveTool(tool);
          }
        }

        if (tool === "layers" || tool === "settings") {
          this.showMobilePanel(tool);
        } else {
          this.showMobilePanel(tool);
        }
      });
    });
  }

  initMobilePanelClose() {
    if (this.mobilePanelClose && this.mobilePanel) {
      console.log("Setting up mobile panel close button");
      this.mobilePanelClose.addEventListener("click", () => {
        console.log("Close button clicked");
        this.mobilePanel.style.cssText += "display: none !important;";
        console.log("Panel hidden:", this.mobilePanel.style.display);
      });
    } else {
      console.error("Mobile panel close button or mobile panel not found");
    }
  }

  // Add this missing method to fix the error
  updateMobileToolbar(toolId) {
    const mobileToolButtons = document.querySelectorAll(".mobile-tool-btn");

    mobileToolButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.tool === toolId) {
        btn.classList.add("active");
      }
    });

    // Show the appropriate panel based on the selected tool
    this.showMobilePanel(toolId);
  }

  showMobilePanel(panelType) {
    console.log("Showing mobile panel:", panelType);
    if (!this.mobilePanel || !this.mobilePanelContent) {
      console.error("mobilePanel or mobilePanelContent not found");
      return;
    }

    console.log("Mobile panel CSS before:", {
      display: this.mobilePanel.style.display,
      position: getComputedStyle(this.mobilePanel).position,
      zIndex: getComputedStyle(this.mobilePanel).zIndex,
      opacity: getComputedStyle(this.mobilePanel).opacity,
      visibility: getComputedStyle(this.mobilePanel).visibility,
    });

    this.mobilePanelContent.innerHTML = "";

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
        panelToClone = document.getElementById("brushPanel");
        break;
    }

    if (panelToClone) {
      console.log("Found panel to clone:", panelType);
      const clonedContent = panelToClone.cloneNode(true);
      clonedContent.style.display = "block";
      this.mobilePanel.classList.add("visible");
      this.mobilePanelContent.appendChild(clonedContent);
      this.reinitializeControls(panelType, clonedContent);
      // this.mobilePanel.style.display = "block";
    } else {
      console.error(`Panel "${panelType}" not found in DOM`);
    }

    console.log("Mobile panel CSS after:", {
      display: this.mobilePanel.style.display,
      position: getComputedStyle(this.mobilePanel).position,
      zIndex: getComputedStyle(this.mobilePanel).zIndex,
      opacity: getComputedStyle(this.mobilePanel).opacity,
      visibility: getComputedStyle(this.mobilePanel).visibility,
    });

    // Tambahkan debugging untuk memeriksa apakah perubahan diterapkan
    console.log(
      "Mobile panel style after forcing:",
      this.mobilePanel.style.cssText
    );
    console.log(
      "Computed style:",
      window.getComputedStyle(this.mobilePanel).display
    );
  }

  reinitializeControls(panelType, contentElement) {
    switch (panelType) {
      case "brush":
        this.reinitBrushControls(contentElement);
        break;
      case "eraser":
        this.reinitEraserControls(contentElement);
        break;
      case "layers":
        break;
      case "settings":
        this.reinitCanvasControls(contentElement);
        break;
      case "fill":
        this.reinitBrushControls(contentElement);
        break;
    }
  }

  reinitBrushControls(panel) {
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
