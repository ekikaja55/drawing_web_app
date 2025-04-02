class CanvasActions {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Canvas size options
    const sizeOptions = document.querySelectorAll(".canvas-size-option");
    sizeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        sizeOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        const width = parseInt(option.dataset.width);
        const height = parseInt(option.dataset.height);
        this.canvasManager.resizeCanvas(width, height);
      });
    });

    // Custom size inputs
    const applyCustomSizeBtn = document.getElementById("applyCustomSize");
    applyCustomSizeBtn.addEventListener("click", () => {
      const customWidth = document.getElementById("customWidth");
      const customHeight = document.getElementById("customHeight");

      const width = parseInt(customWidth.value);
      const height = parseInt(customHeight.value);

      if (width >= 50 && width <= 4000 && height >= 50 && height <= 4000) {
        this.canvasManager.resizeCanvas(width, height);

        // Reset active class on preset size options
        document.querySelectorAll(".canvas-size-option").forEach((opt) => {
          opt.classList.remove("active");
        });
      }
    });

    // Clear and reset buttons
    const clearCanvasBtn = document.getElementById("clearCanvasBtn");
    clearCanvasBtn.addEventListener("click", () => {
      if (confirm("Clear the current layer? This action cannot be undone.")) {
        this.canvasManager.clearCanvas();
      }
    });

    const resetCanvasBtn = document.getElementById("resetCanvasBtn");
    resetCanvasBtn.addEventListener("click", () => {
      if (
        confirm("Reset all layers and settings? This action cannot be undone.")
      ) {
        this.canvasManager.clearAllLayers();
      }
    });

    // Download modal
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadModal = document.getElementById("downloadModal");
    const closeDownloadModal = document.getElementById("closeDownloadModal");
    const cancelDownload = document.getElementById("cancelDownload");
    const confirmDownload = document.getElementById("confirmDownload");
    const downloadFormat = document.getElementById("downloadFormat");
    const downloadQuality = document.getElementById("downloadQuality");
    const qualityValue = document.getElementById("qualityValue");

    downloadBtn.addEventListener("click", () => {
      downloadModal.style.display = "flex";
    });

    closeDownloadModal.addEventListener("click", () => {
      downloadModal.style.display = "none";
    });

    cancelDownload.addEventListener("click", () => {
      downloadModal.style.display = "none";
    });

    downloadQuality.addEventListener("input", () => {
      qualityValue.textContent = `${Math.round(downloadQuality.value * 100)}%`;
    });

    confirmDownload.addEventListener("click", () => {
      const format = downloadFormat.value;
      const quality = parseFloat(downloadQuality.value);

      const dataURL = this.canvasManager.getCanvasAsDataURL(format, quality);

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.download = `drawing.${format}`;
      link.href = dataURL;
      link.click();

      downloadModal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === downloadModal) {
        downloadModal.style.display = "none";
      }
    });
  }
}

// Export for use in other modules
window.CanvasActions = CanvasActions;
