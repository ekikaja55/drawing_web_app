// main.js - Initializes the DrawAnywhere app

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the canvas manager
  const canvasManager = new CanvasManager();

  // Initialize the tool manager
  const toolManager = new ToolManager(canvasManager);

  // Initialize the layer manager
  const layerManager = new LayerManager(canvasManager);

  // Initialize canvas actions
  const canvasActions = new CanvasActions(canvasManager);

  // Create and register tools
  const brushTool = new BrushTool(canvasManager);
  toolManager.registerTool("brush", brushTool);

  const eraserTool = new EraserTool(canvasManager);
  toolManager.registerTool("eraser", eraserTool);

  const fillTool = new FillTool(canvasManager);
  toolManager.registerTool("fill", fillTool);

  // Set brush as the default active tool
  toolManager.setActiveTool("brush");

  // Mobile panel close button
  const closePanel = document.getElementById("closePanel");
  const mobilePanel = document.getElementById("mobilePanel");

  if (closePanel && mobilePanel) {
    closePanel.addEventListener("click", () => {
      mobilePanel.style.display = "none";
    });
  }

  // Handle window resizing
  window.addEventListener("resize", () => {
    canvasManager.updateCanvasSize();
  });

  // Log ready message
  console.log("DrawAnywhere initialization complete");
});
