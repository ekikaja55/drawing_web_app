class PanelManager {
  constructor(uiManager, layerManager) {
    this.uiManager = uiManager;
    this.layerManager = layerManager;

    this.panels = {
      brush: document.getElementById("brushPanel"),
      eraser: document.getElementById("eraserPanel"),
      fill: document.getElementById("fillPanel"),
      layers: document.getElementById("layersPanel"),
      settings: document.getElementById("settingsPanel"),
    };

    this.initLayerControls();
  }

  initLayerControls() {
    const addLayerBtn = document.getElementById("addLayerBtn");
    const duplicateLayerBtn = document.getElementById("duplicateLayerBtn");
    const deleteLayerBtn = document.getElementById("deleteLayerBtn");

    if (addLayerBtn) {
      addLayerBtn.addEventListener("click", () => {
        this.layerManager.addLayer();
        this.uiManager.updateLayersList(
          this.layerManager.getLayers(),
          this.layerManager.getCurrentLayerIndex() // Changed from getActiveLayerIndex
        );
      });
    }

    if (duplicateLayerBtn) {
      duplicateLayerBtn.addEventListener("click", () => {
        this.layerManager.duplicateCurrentLayer(); // Changed from duplicateActiveLayer
        this.uiManager.updateLayersList(
          this.layerManager.getLayers(),
          this.layerManager.getCurrentLayerIndex() // Changed from getActiveLayerIndex
        );
      });
    }

    if (deleteLayerBtn) {
      deleteLayerBtn.addEventListener("click", () => {
        if (this.layerManager.getLayers().length > 1) {
          if (confirm("Are you sure you want to delete this layer?")) {
            this.layerManager.deleteCurrentLayer(); // Changed from deleteActiveLayer
            this.uiManager.updateLayersList(
              this.layerManager.getLayers(),
              this.layerManager.getCurrentLayerIndex() // Changed from getActiveLayerIndex
            );
          }
        } else {
          alert("Cannot delete the last layer");
        }
      });
    }
  }

  showPanel(panelId) {
    Object.values(this.panels).forEach((panel) => {
      if (panel) {
        panel.style.display = "none";
      }
    });

    if (this.panels[panelId]) {
      this.panels[panelId].style.display = "block";
    }
  }
}
