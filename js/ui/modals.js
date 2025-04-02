// Modals.js - Handles modal dialogs

class ModalManager {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.initDownloadModal();
  }

  initDownloadModal() {
    const downloadBtn = document.getElementById("downloadBtn");
    const downloadModal = document.getElementById("downloadModal");
    const closeDownloadModal = document.getElementById("closeDownloadModal");
    const cancelDownload = document.getElementById("cancelDownload");
    const confirmDownload = document.getElementById("confirmDownload");
    const downloadFormat = document.getElementById("downloadFormat");
    const downloadQuality = document.getElementById("downloadQuality");
    const qualityValue = document.getElementById("qualityValue");

    // Open download modal
    if (downloadBtn && downloadModal) {
      downloadBtn.addEventListener("click", () => {
        downloadModal.style.display = "flex";
      });
    }

    // Close download modal
    if (closeDownloadModal && downloadModal) {
      closeDownloadModal.addEventListener("click", () => {
        downloadModal.style.display = "none";
      });
    }

    // Cancel download
    if (cancelDownload && downloadModal) {
      cancelDownload.addEventListener("click", () => {
        downloadModal.style.display = "none";
      });
    }

    // Update quality value display
    if (downloadQuality && qualityValue) {
      downloadQuality.addEventListener("input", (e) => {
        const quality = Math.round(e.target.value * 100);
        qualityValue.textContent = `${quality}%`;
      });
    }

    // Confirm download
    if (confirmDownload && downloadModal && downloadFormat && downloadQuality) {
      confirmDownload.addEventListener("click", () => {
        const format = downloadFormat.value;
        const quality = parseFloat(downloadQuality.value);

        // Use the download utility to save the canvas
        DownloadUtils.downloadCanvas(
          this.canvasManager.getMergedCanvas(),
          format,
          quality
        );

        // Close the modal
        downloadModal.style.display = "none";
      });
    }

    // Close modal if clicked outside
    window.addEventListener("click", (e) => {
      if (downloadModal && e.target === downloadModal) {
        downloadModal.style.display = "none";
      }
    });
  }
}
