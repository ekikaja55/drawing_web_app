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

    if (downloadBtn && downloadModal) {
      downloadBtn.addEventListener("click", () => {
        downloadModal.style.display = "flex";
      });
    }

    if (closeDownloadModal && downloadModal) {
      closeDownloadModal.addEventListener("click", () => {
        downloadModal.style.display = "none";
      });
    }

    if (cancelDownload && downloadModal) {
      cancelDownload.addEventListener("click", () => {
        downloadModal.style.display = "none";
      });
    }

    if (downloadQuality && qualityValue) {
      downloadQuality.addEventListener("input", (e) => {
        const quality = Math.round(e.target.value * 100);
        qualityValue.textContent = `${quality}%`;
      });
    }

    if (confirmDownload && downloadModal && downloadFormat && downloadQuality) {
      confirmDownload.addEventListener("click", () => {
        const format = downloadFormat.value;
        const quality = parseFloat(downloadQuality.value);

        DownloadUtils.downloadCanvas(
          this.canvasManager.getMergedCanvas(),
          format,
          quality
        );

        downloadModal.style.display = "none";
      });
    }

    window.addEventListener("click", (e) => {
      if (downloadModal && e.target === downloadModal) {
        downloadModal.style.display = "none";
      }
    });
  }
}
