// Color picker and converter functionality
const colorPicker = document.getElementById('colorPicker');
const colorDisplay = document.getElementById('colorDisplay');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const hslValue = document.getElementById('hslValue');

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function updateColorDisplay(hex) {
  colorDisplay.style.backgroundColor = hex;
  hexValue.value = hex.toUpperCase();

  const rgb = hexToRgb(hex);
  if (rgb) {
    rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
}

colorPicker.addEventListener('input', (e) => {
  updateColorDisplay(e.target.value);
});

// Initialize with default color
updateColorDisplay(colorPicker.value);

// Copy to clipboard functionality
function copyToClipboard(elementId) {
  const input = document.getElementById(elementId);
  input.select();
  document.execCommand('copy');

  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => {
    button.textContent = originalText;
  }, 1500);
}

// Random palette generator
function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function generatePalette() {
  const container = document.getElementById('paletteContainer');
  container.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const color = generateRandomColor();
    const colorDiv = document.createElement('div');
    colorDiv.className = 'palette-color';
    colorDiv.style.backgroundColor = color;
    colorDiv.textContent = color.toUpperCase();
    colorDiv.title = 'Click to copy';
    colorDiv.onclick = function() {
      navigator.clipboard.writeText(color.toUpperCase()).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      });
    };
    container.appendChild(colorDiv);
  }
}

// Generate initial palette
generatePalette();