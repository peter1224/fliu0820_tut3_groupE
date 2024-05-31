let Background;
let Tower;
let lines = [];
let backgroundGraphics;
let towerGraphics;
let staticTowerLines = [];
let maxLines = 200;

// Color dynamic change parameters
let dynamicColorFactor;
let colorChangePeriod = 2400; // Define the color change period

// General variables
let angleRange1;
let angleRange2;

// Define color transition sequence
let startColor, midColor1, midColor2, midColor3, midColor4, midColor5, endColor;
let whiteCircles = []; // Array to store background stars
let numWhiteCircles = 100; // Number of background stars
let whiteCircleSpeed = 1 / 1.5; // Speed of background stars

let whiteCircles1 = [];
let numWhiteCircles1 = 400;
let whiteCircleSpeed1 = 1 / 4; // Speed of smaller background stars

// Initialize general variables
function initializeVariables() {
  angleRange1 = PI / 5; // Control the range of angle = PI / 2 + random(-PI / 5, PI / 5)
  angleRange2 = PI * 0.1; // Control the range of angle = random(PI * 0.85, PI * 1.05)
  dynamicColorFactor = 50; // Dynamic color change range

  // Initialize color transition sequence
  startColor = color(255, 255, 240);
  midColor1 = color(250, 240, 0);
  midColor2 = color(230, 0, 0);
  midColor3 = color(0, 40, 190);
  midColor4 = color(230, 0, 0);
  midColor5 = color(250, 240, 0);
  endColor = color(255, 255, 240);
}

class Line {
  constructor(x1, y1, angle, length, color, thickness, direction, speed) {
    this.x1 = x1;
    this.y1 = y1;
    this.angle = angle;
    this.length = length;
    this.color = color;
    this.thickness = thickness;
    this.direction = direction; // Add direction attribute
    this.speed = speed;
    this.updateEndpoints();
  }

  updateEndpoints() {
    this.x2 = this.x1 + cos(this.angle) * this.length;
    this.y2 = this.y1 + sin(this.angle) * this.length;
  }

  update() {
    this.x1 += this.direction * this.speed * cos(this.angle);
    this.x2 += this.direction * this.speed * cos(this.angle);
    this.y1 += this.direction * this.speed * sin(this.angle);
    this.y2 += this.direction * this.speed * sin(this.angle);

    // If the line exceeds the boundary, reset it to the other side
    if (this.x1 > windowWidth) this.x1 = -this.length;
    if (this.x1 < -this.length) this.x1 = windowWidth;
    if (this.y1 > windowHeight) this.y1 = -this.length;
    if (this.y1 < -this.length) this.y1 = windowHeight;

    this.updateEndpoints();
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.thickness);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

function preload() {
  Background = loadImage('asset/background.png');
  Tower = loadImage('asset/tower.png');
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);

  initializeVariables();

  Tower.resize(windowWidth, windowHeight);
  backgroundGraphics = drawBackground(Background, false); // Do not apply dynamic color change
  towerGraphics = drawBackground(Tower, false); // Do not apply dynamic color change
  generateStaticTowerLines(); // Generate static tower lines
  initializeWhiteCircles(); // Initialize background stars
  redraw();
}

function draw() {
  let dynamicTint = calculateDynamicTint();
  tint(30 + dynamicTint * 1.5, 10); // Adjust transparency based on dynamic color change
  image(backgroundGraphics, 0, 0, windowWidth, windowHeight);

  // Draw background stars
  drawWhiteCircles(dynamicTint);

  for (let i = 0; i < 10; i++) {
    addLine(Background, true); // Apply dynamic color change to background lines
  }

  tint(255, 255); // Keep the tower color normal
  image(towerGraphics, 0, 0, windowWidth, windowHeight);

  while (lines.length > maxLines) {
    lines.shift();
  }

  for (let line of lines) {
    line.update();
    line.draw();
  }

  // Draw static tower lines
  for (let line of staticTowerLines) {
    line.draw();
  }
}

function createLine(img, x1 = null, y1 = null, speed = 1.5, applyDynamicColor = false) {
  if (x1 === null) x1 = random(windowWidth);
  if (y1 === null) y1 = random(windowHeight);

  const { angle, length, direction, col, type } = getLineProperties(img, x1, y1, applyDynamicColor);
  const thickness = random(3, 10);

  return new Line(x1, y1, angle, length, col, thickness, direction, speed);
}

function getLineProperties(img, x1, y1, applyDynamicColor) {
  let angle;
  let direction = 1;
  let col = img.get(x1, y1);
  let type = 'background';

  if (img === Tower) {
    angle = PI / 2 + random(-PI / 5, PI / 5);
    direction = -1;
    type = 'tower';
  } else {
    if (y1 > windowHeight * 0.3 && y1 < windowHeight * 0.6) {
      direction = -1;
      type = 'horizontal';
    }
    if (y1 < windowHeight * 0.6) {
      angle = PI / 2 + random(-angleRange1, angleRange1);
      if (applyDynamicColor) {
        col = getDynamicColor(col); // Use dynamic color change function
      }
    } else {
      angle = random(PI * 0.85, PI * 1.05);
      if (applyDynamicColor) {
        col = getDynamicColor(col); // Use dynamic color change function
      }
    }
  }

  const length = random(50);
  return { angle, length, direction, col, type };
}

function getDynamicColor(col) {
  let c = getCurrentTransitionColor();

  // Overlay dynamic color on the original color
  let r = lerp(red(col), red(c), 0.5);
  let g = lerp(green(col), green(c), 0.5);
  let b = lerp(blue(col), blue(c), 0.5);

  return color(r, g, b);
}

function calculateDynamicTint() {
  let c = getCurrentTransitionColor();

  // Calculate the sum of RGB values
  let r = red(c);
  let g = green(c);
  let b = blue(c);
  return (r + g + b) / 3;
}

function getCurrentTransitionColor() {
  let phase = frameCount % colorChangePeriod;
  let progress = phase / colorChangePeriod;

  let c;
  let progress1 = 1 / 6; // Progress proportion for each phase
  let progress2 = 2 / 6;
  let progress3 = 3 / 6;
  let progress4 = 4 / 6;
  let progress5 = 5 / 6;
  let progress6 = 1;

  if (progress < progress1) {
    c = lerpColor(startColor, midColor1, progress / progress1);
  } else if (progress < progress2) {
    c = lerpColor(midColor1, midColor2, (progress - progress1) / progress1);
  } else if (progress < progress3) {
    c = lerpColor(midColor2, midColor3, (progress - progress2) / progress1);
  } else if (progress < progress4) {
    c = lerpColor(midColor3, midColor4, (progress - progress3) / progress1);
  } else if (progress < progress5) {
    c = lerpColor(midColor4, midColor5, (progress - progress4) / progress1);
  } else {
    c = lerpColor(midColor5, endColor, (progress - progress5) / progress1);
  }
  return c;
}

function drawBackground(img, applyDynamicColor) {
  img.resize(windowWidth, windowHeight);
  let graphics = createGraphics(windowWidth, windowHeight);
  graphics.clear();

  const numLines = 50000;
  for (let i = 0; i < numLines; i++) {
    const line = createLine(img, null, null, 1.5, applyDynamicColor);
    graphics.stroke(line.color);
    graphics.strokeWeight(line.thickness);
    graphics.line(line.x1, line.y1, line.x2, line.y2);
  }

  return graphics;
}

// Function to initialize background stars
function initializeWhiteCircles() {
  // Create background stars
  for (let i = 0; i < numWhiteCircles; i++) {
    let size = random(3, 10); // Random size
    let x = random(width); // Random x position
    let y = random(height); // Random y position
    whiteCircles.push({ x, y, size });
  }

  // Create smaller background stars
  for (let i = 0; i < numWhiteCircles1; i++) {
    let size = random(1, 3); // Random size
    let x = random(width); // Random x position
    let y = random(height); // Random y position
    whiteCircles1.push({ x, y, size });
  }
}

// Function to draw and move background stars
function drawWhiteCircles(dynamicTint) {
  fill(255, 255, 255, 120 + (dynamicTint * -1)); // Set fill color to white with dynamic transparency
  noStroke();

  // Move stars horizontally
  for (let circle of whiteCircles) {
    circle.x += whiteCircleSpeed; // Move star to the right
    if (circle.x > width) {
      circle.x = 0; // Reset star to the left if it goes off the right
    }
    ellipse(circle.x, circle.y, circle.size); // Draw star
  }

  // Move smaller stars horizontally
  for (let circle of whiteCircles1) {
    circle.x += whiteCircleSpeed1; // Move star to the right
    if (circle.x > width) {
      circle.x = 0; // Reset star to the left if it goes off the right
    }
    ellipse(circle.x, circle.y, circle.size); // Draw star
  }
}

function addLine(img, applyDynamicColor) {
  const line = createLine(img, null, null, 1.5, applyDynamicColor);
  lines.push(line);
}

function generateStaticTowerLines() {
  const numLines = 20000;
  for (let i = 0; i < numLines; i++) {
    const line = createLine(Tower, int(random(windowWidth)), int(random(windowHeight)), 1.5, false);
    staticTowerLines.push(line);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundGraphics = drawBackground(Background, false); // Do not apply dynamic color change
  towerGraphics = drawBackground(Tower, false); // Do not apply dynamic color change
  staticTowerLines = [];
  generateStaticTowerLines(); // Regenerate static tower lines
  redraw();
}
