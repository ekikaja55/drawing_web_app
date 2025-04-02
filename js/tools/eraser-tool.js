class EraserTool {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.canvas = canvasManager.canvas;
    
    // Eraser settings
    this.size = 20;
    this.hardness = 100; // 100 = hard edge, 0 = soft edge
    
    // Drawing state
    this.isErasing = false;
    this.lastPoint = null;
    
    // UI elements - check if they exist before accessing
    this.eraserSize = document.getElementById('eraserSize');
    this.eraserSizeValue = document.getElementById('eraserSizeValue');
    this.eraserHardness = document.getElementById('eraserHardness');
    this.eraserHardnessValue = document.getElementById('eraserHardnessValue');
    
    // Only set up UI listeners if the elements exist
    if (this.eraserSize && this.eraserHardness) {
      this.setupEventListeners();
    }
  }

  activate() {
    this.setupCanvasListeners();
  }

  deactivate() {
    this.removeCanvasListeners();
  }

  setupEventListeners() {
    // Size slider
    if (this.eraserSize && this.eraserSizeValue) {
      this.eraserSize.addEventListener('input', () => {
        this.size = parseInt(this.eraserSize.value);
        this.eraserSizeValue.textContent = this.size;
      });
    }
    
    // Hardness slider
    if (this.eraserHardness && this.eraserHardnessValue) {
      this.eraserHardness.addEventListener('input', () => {
        this.hardness = parseInt(this.eraserHardness.value);
        this.eraserHardnessValue.textContent = this.hardness;
      });
    }
  }

  setupCanvasListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  removeCanvasListeners() {
    // Store bound function references to ensure we remove the correct listeners
    this._boundMouseDown = this.handleMouseDown.bind(this);
    this._boundMouseMove = this.handleMouseMove.bind(this);
    this._boundMouseUp = this.handleMouseUp.bind(this);
    this._boundTouchStart = this.handleTouchStart.bind(this);
    this._boundTouchMove = this.handleTouchMove.bind(this);
    this._boundTouchEnd = this.handleTouchEnd.bind(this);
    
    this.canvas.removeEventListener('mousedown', this._boundMouseDown);
    this.canvas.removeEventListener('mousemove', this._boundMouseMove);
    window.removeEventListener('mouseup', this._boundMouseUp);
    
    this.canvas.removeEventListener('touchstart', this._boundTouchStart);
    this.canvas.removeEventListener('touchmove', this._boundTouchMove);
    this.canvas.removeEventListener('touchend', this._boundTouchEnd);
  }

  handleMouseDown(e) {
    this.isErasing = true;
    const point = this.getCanvasPoint(e);
    this.lastPoint = point;
    this.eraseAt(point);
  }

  handleMouseMove(e) {
    if (!this.isErasing) return;
    
    const point = this.getCanvasPoint(e);
    this.eraseBetween(this.lastPoint, point);
    this.lastPoint = point;
  }

  handleMouseUp() {
    this.isErasing = false;
    this.lastPoint = null;
    
    // Redraw main canvas to reflect changes
    this.canvasManager.redrawCanvas();
  }

  handleTouchStart(e) {
    e.preventDefault(); // Prevent scrolling
    if (e.touches.length > 0) {
      this.isErasing = true;
      const point = this.getCanvasPointFromTouch(e.touches[0]);
      this.lastPoint = point;
      this.eraseAt(point);
    }
  }

  handleTouchMove(e) {
    e.preventDefault(); // Prevent scrolling
    if (!this.isErasing || e.touches.length === 0) return;
    
    const point = this.getCanvasPointFromTouch(e.touches[0]);
    this.eraseBetween(this.lastPoint, point);
    this.lastPoint = point;
  }

  handleTouchEnd(e) {
    e.preventDefault(); // Prevent scrolling
    this.isErasing = false;
    this.lastPoint = null;
    
    // Redraw main canvas to reflect changes
    this.canvasManager.redrawCanvas();
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  getCanvasPointFromTouch(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    };
  }

  eraseAt(point) {
    const layer = this.canvasManager.getActiveLayer();
    if (!layer || !layer.visible) return;
    
    const ctx = layer.ctx;
    
    // Use composite operation to erase
    ctx.globalCompositeOperation = 'destination-out';
    
    if (this.hardness === 100) {
      // Hard eraser
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Soft eraser - use radial gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, this.size / 2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(this.hardness / 100, 'rgba(0,0,0,' + (this.hardness / 100) + ')');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Update the main canvas
    this.canvasManager.redrawCanvas();
  }

  eraseBetween(from, to) {
    const layer = this.canvasManager.getActiveLayer();
    if (!layer || !layer.visible) return;
    
    const ctx = layer.ctx;
    
    // Use composite operation to erase
    ctx.globalCompositeOperation = 'destination-out';
    
    // Calculate distance and steps
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    const steps = Math.max(Math.floor(distance / (this.size / 4)), 1);
    
    for (let i = 0; i <= steps; i++) {
      const point = {
        x: from.x + (to.x - from.x) * (i / steps),
        y: from.y + (to.y - from.y) * (i / steps)
      };
      
      if (this.hardness === 100) {
        // Hard eraser
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft eraser - use radial gradient
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, this.size / 2
        );
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(this.hardness / 100, 'rgba(0,0,0,' + (this.hardness / 100) + ')');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Update the main canvas
    this.canvasManager.redrawCanvas();
  }
}

// Export for use in other modules
window.EraserTool = EraserTool;