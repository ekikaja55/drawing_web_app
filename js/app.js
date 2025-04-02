// app.js - Initializes the DrawAnywhere app

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the canvas manager
  const canvasManager = new CanvasManager();

  // Initialize the tool manager FIRST
  const toolManager = new ToolManager(canvasManager);

  // THEN initialize the UI manager with required parameters
  const uiManager = new UIManager(canvasManager, toolManager);

  // Initialize the layer manager
  const layerManager = new LayerManager(canvasManager);
  // Initialize panels manager
  const panelsManager = new PanelManager();

  // Initialize modals
  const modalsManager = new ModalManager();

  // Initialize canvas actions
  const canvasActions = new CanvasActions(canvasManager, layerManager);

  // Create and register tools
  const brushTool = new BrushTool(canvasManager);
  toolManager.registerTool("brush", brushTool);

  const eraserTool = new EraserTool(canvasManager);
  toolManager.registerTool("eraser", eraserTool);

  const fillTool = new FillTool(canvasManager);
  toolManager.registerTool("fill", fillTool);

  // Set brush as the default active tool
  toolManager.setActiveTool("brush");

  // Initialize mobile UI handler
  const mobileUI = new MobileUI(panelsManager);

  // Setup tool selection events
  document.querySelectorAll(".tool-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const toolId = button.id.replace("Tool", "").toLowerCase();
      toolManager.setActiveTool(toolId);
      panelsManager.showPanel(toolId);

      // Update UI active states
      document
        .querySelectorAll(".tool-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  // Handle brush settings
  document.getElementById("colorWheel").addEventListener("input", (e) => {
    brushTool.setColor(e.target.value);
    document.getElementById("hexInput").value = e.target.value;
  });

  document.getElementById("hexInput").addEventListener("change", (e) => {
    brushTool.setColor(e.target.value);
    document.getElementById("colorWheel").value = e.target.value;
  });

  document.getElementById("brushSize").addEventListener("input", (e) => {
    brushTool.setSize(parseInt(e.target.value));
    document.getElementById("brushSizeValue").textContent = e.target.value;
  });

  document.getElementById("brushOpacity").addEventListener("input", (e) => {
    brushTool.setOpacity(parseInt(e.target.value) / 100);
    document.getElementById("brushOpacityValue").textContent = e.target.value;
  });

  // Handle eraser settings
  document.getElementById("eraserSize").addEventListener("input", (e) => {
    eraserTool.setSize(parseInt(e.target.value));
    document.getElementById("eraserSizeValue").textContent = e.target.value;
  });

  document.getElementById("eraserOpacity").addEventListener("input", (e) => {
    eraserTool.setOpacity(parseInt(e.target.value) / 100);
    document.getElementById("eraserOpacityValue").textContent = e.target.value;
  });

  // Handle brush type selection
  document.querySelectorAll(".brush-preview").forEach((brushPreview) => {
    brushPreview.addEventListener("click", () => {
      const brushType = brushPreview.dataset.brush;
      brushTool.setBrushType(brushType);

      // Update UI active states
      document.querySelectorAll(".brush-preview").forEach((preview) => {
        preview.classList.remove("active");
      });
      brushPreview.classList.add("active");
    });
  });

  // Handle custom brush upload
  document.getElementById("customBrushBtn").addEventListener("click", () => {
    document.getElementById("brushFileInput").click();
  });

  document.getElementById("brushFileInput").addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          brushTool.setCustomBrush(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Layer management
  document.getElementById("addLayerBtn").addEventListener("click", () => {
    layerManager.addLayer();
    updateLayersList();
  });

  document.getElementById("duplicateLayerBtn").addEventListener("click", () => {
    layerManager.duplicateCurrentLayer();
    updateLayersList();
  });

  document.getElementById("deleteLayerBtn").addEventListener("click", () => {
    layerManager.deleteCurrentLayer();
    updateLayersList();
  });

  // Canvas settings
  document.querySelectorAll(".canvas-size-option").forEach((option) => {
    option.addEventListener("click", () => {
      const width = parseInt(option.dataset.width);
      const height = parseInt(option.dataset.height);

      canvasManager.resizeCanvas(width, height);

      // Update UI active states
      document.querySelectorAll(".canvas-size-option").forEach((opt) => {
        opt.classList.remove("active");
      });
      option.classList.add("active");
    });
  });

  document.getElementById("applyCustomSize").addEventListener("click", () => {
    const width = parseInt(document.getElementById("customWidth").value);
    const height = parseInt(document.getElementById("customHeight").value);

    if (width >= 50 && width <= 4000 && height >= 50 && height <= 4000) {
      canvasManager.resizeCanvas(width, height);

      // Update UI active states
      document.querySelectorAll(".canvas-size-option").forEach((opt) => {
        opt.classList.remove("active");
      });
    }
  });

  document.getElementById("clearCanvasBtn").addEventListener("click", () => {
    canvasActions.clearCanvas();
  });

  document.getElementById("resetCanvasBtn").addEventListener("click", () => {
    canvasActions.resetCanvas();

    // Reset UI to defaults
    document.getElementById("brushSize").value = 10;
    document.getElementById("brushSizeValue").textContent = 10;
    document.getElementById("brushOpacity").value = 100;
    document.getElementById("brushOpacityValue").textContent = 100;
    document.getElementById("colorWheel").value = "#000000";
    document.getElementById("hexInput").value = "#000000";

    toolManager.setActiveTool("brush");
    panelsManager.showPanel("brush");

    // Reset active states
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById("brushTool").classList.add("active");

    updateLayersList();
  });

  // Download functionality
  document.getElementById("downloadBtn").addEventListener("click", () => {
    modalsManager.openModal("downloadModal");
  });

  document.getElementById("confirmDownload").addEventListener("click", () => {
    const format = document.getElementById("downloadFormat").value;
    const quality = parseFloat(
      document.getElementById("downloadQuality").value
    );

    DownloadUtils.downloadCanvas(
      canvasManager.getMergedCanvas(),
      format,
      quality
    );
    modalsManager.closeModal("downloadModal");
  });

  document.getElementById("cancelDownload").addEventListener("click", () => {
    modalsManager.closeModal("downloadModal");
  });

  document
    .getElementById("closeDownloadModal")
    .addEventListener("click", () => {
      modalsManager.closeModal("downloadModal");
    });

  document.getElementById("downloadQuality").addEventListener("input", (e) => {
    const value = Math.round(parseFloat(e.target.value) * 100);
    document.getElementById("qualityValue").textContent = `${value}%`;
  });

  // Mobile panel close button
  document.getElementById("mobilePanelClose").addEventListener("click", () => {
    document.getElementById("mobilePanel").style.display = "none";
  });

  // Mobile toolbar buttons
  document.querySelectorAll(".mobile-tool-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const toolId = button.dataset.tool;

      if (toolId === "layers" || toolId === "settings") {
        mobileUI.showMobilePanel(toolId);
      } else {
        toolManager.setActiveTool(toolId);
        mobileUI.updateMobileToolbar(toolId);
      }
    });
  });

  // Helper function to update layers list UI
  function updateLayersList() {
    const layers = layerManager.getLayers();
    const layersList = document.getElementById("layersList");
    layersList.innerHTML = "";

    layers.forEach((layer, index) => {
      const layerItem = document.createElement("div");
      layerItem.className = "layer-item";
      if (index === layerManager.getCurrentLayerIndex()) {
        layerItem.classList.add("active");
      }

      const layerPreview = document.createElement("div");
      layerPreview.className = "layer-preview";

      const layerName = document.createElement("div");
      layerName.className = "layer-name";
      layerName.textContent = `Layer ${index + 1}`;

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

      layerItem.appendChild(layerPreview);
      layerItem.appendChild(layerName);
      layerItem.appendChild(visibilityBtn);

      layerItem.addEventListener("click", (e) => {
        if (!e.target.closest(".layer-visibility")) {
          layerManager.setCurrentLayer(index);
          updateLayersList();
        }
      });

      visibilityBtn.addEventListener("click", () => {
        layerManager.toggleLayerVisibility(index);
        updateLayersList();
      });

      layersList.appendChild(layerItem);
    });
  }

  // Initial update of layers list
  updateLayersList();

  // Handle window resizing
  window.addEventListener("resize", () => {
    canvasManager.updateCanvasSize();
  });

  // Initialize the canvas with default size
  canvasManager.initializeCanvas(800, 600);

  // Log ready message
  console.log("DrawAnywhere initialization complete");
});
