class ToolManager {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.tools = {};
    this.activeTool = null;
    this.activeToolName = null;

    // Tool buttons
    this.toolButtons = {
      brush: document.getElementById("brushTool"),
      eraser: document.getElementById("eraserTool"),
      fill: document.getElementById("fillTool"),
      layers: document.getElementById("layersTool"),
      settings: document.getElementById("settingsTool"),
    };

    // Panels
    this.panels = {
      brush: document.getElementById("brushPanel"),
      eraser: document.getElementById("eraserPanel"),
      layers: document.getElementById("layersPanel"),
      canvas: document.getElementById("canvasPanel"),
    };

    this.setupEventListeners();
  }

  registerTool(name, tool) {
    this.tools[name] = tool;
    if (!this.activeTool) {
      this.setActiveTool(name);
    }
    return tool;
  }

  setActiveTool(toolName) {
    if (this.tools[toolName]) {
      // Deactivate current tool
      if (this.activeTool && this.activeTool.deactivate) {
        this.activeTool.deactivate();
      }

      // Update UI
      Object.values(this.toolButtons).forEach((btn) => {
        btn.classList.remove("active");
      });

      if (this.toolButtons[toolName]) {
        this.toolButtons[toolName].classList.add("active");
      }

      // Hide all panels
      Object.values(this.panels).forEach((panel) => {
        panel.style.display = "none";
      });

      // Show relevant panel
      if (toolName === "brush" && this.panels.brush) {
        this.panels.brush.style.display = "block";
      } else if (toolName === "eraser" && this.panels.eraser) {
        this.panels.eraser.style.display = "block";
      } else if (toolName === "layers" && this.panels.layers) {
        this.panels.layers.style.display = "block";
      } else if (toolName === "settings" && this.panels.canvas) {
        this.panels.canvas.style.display = "block";
      }

      // Set new active tool
      this.activeTool = this.tools[toolName];
      this.activeToolName = toolName;

      // Activate new tool
      if (this.activeTool && this.activeTool.activate) {
        this.activeTool.activate();
      }

      return true;
    }
    return false;
  }

  setupEventListeners() {
    // Tool selection buttons
    Object.entries(this.toolButtons).forEach(([name, button]) => {
      button.addEventListener("click", () => {
        this.setActiveTool(name);
      });
    });

    // Mobile toolbar buttons
    const mobileToolBtns = document.querySelectorAll(".mobile-tool-btn");
    mobileToolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const toolName = btn.dataset.tool;
        if (toolName) {
          this.setActiveTool(toolName);

          // Update mobile UI
          mobileToolBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Show mobile panel for relevant tools
          const mobilePanel = document.getElementById("mobilePanel");
          const mobilePanelContent =
            document.getElementById("mobilePanelContent");

          if (["brush", "eraser", "layers", "settings"].includes(toolName)) {
            mobilePanel.style.display = "block";

            // Clone the panel content for mobile
            mobilePanelContent.innerHTML = "";
            if (toolName === "brush" && this.panels.brush) {
              mobilePanelContent.appendChild(this.panels.brush.cloneNode(true));
            } else if (toolName === "eraser" && this.panels.eraser) {
              mobilePanelContent.appendChild(
                this.panels.eraser.cloneNode(true)
              );
            } else if (toolName === "layers" && this.panels.layers) {
              mobilePanelContent.appendChild(
                this.panels.layers.cloneNode(true)
              );
            } else if (toolName === "settings" && this.panels.canvas) {
              mobilePanelContent.appendChild(
                this.panels.canvas.cloneNode(true)
              );
            }
          }
        }
      });
    });
  }
}

// Export for use in other modules
window.ToolManager = ToolManager;
