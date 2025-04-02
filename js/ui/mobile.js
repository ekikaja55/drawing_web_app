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
          this.uiManager.toolManager.setActiveTool(tool);
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

      // We need to copy event listeners manually or reinitialize them
      this.mobilePanelContent.appendChild(clonedContent);

      // Show the panel
      this.mobilePanel.style.display = "block";
    }
  }
}
