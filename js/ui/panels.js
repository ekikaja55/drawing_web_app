// Panels.js - Manages panel interactions and layer controls

class PanelManager {
  constructor(uiManager, layerManager) {
    this.uiManager = uiManager;
    this.layerManager = layerManager;

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
          this.layerManager.getActiveLayerIndex()
        );
      });
    }

    if (duplicateLayerBtn) {
      duplicateLayerBtn.addEventListener("click", () => {
        this.layerManager.duplicateActiveLayer();
        this.uiManager.updateLayersList(
          this.layerManager.getLayers(),
          this.layerManager.getActiveLayerIndex()
        );
      });
    }

    if (deleteLayerBtn) {
      deleteLayerBtn.addEventListener("click", () => {
        if (this.layerManager.getLayers().length > 1) {
          if (confirm("Are you sure you want to delete this layer?")) {
            this.layerManager.deleteActiveLayer();
            this.uiManager.updateLayersList(
              this.layerManager.getLayers(),
              this.layerManager.getActiveLayerIndex()
            );
          }
        } else {
          alert("Cannot delete the last layer");
        }
      });
    }
  }
}
