function drawCircles(
  canvas,
  bgColor = "white",
  circleColor = "#bababa",
  circleSize = 2,
  circleSpacing = 18,
  cursorRange = 40,
  cursorSpeed = 1
) {
  const ctx = canvas.getContext("2d");
  const circles = [];
  let isCursorMoving = false;
  let mouseX = 0;
  let mouseY = 0;

  function init() {
    circles.length = 0;
    const radius = circleSize / 2;
    const spacingX = circleSpacing + circleSize;
    const spacingY = circleSpacing + circleSize;
    const columns = Math.floor(canvas.width / spacingX);
    const rows = Math.floor(canvas.height / spacingY);
    const offsetX = (canvas.width - columns * spacingX + circleSpacing) / 2;
    const offsetY = (canvas.height - rows * spacingY + circleSpacing) / 2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cx = offsetX + x * spacingX + radius;
        const cy = offsetY + y * spacingY + radius;
        circles.push({ x: cx, y: cy, baseX: cx, baseY: cy });
      }
    }
  }

  function draw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circleSize / 2, 0, 2 * Math.PI);
      ctx.fillStyle = circleColor;
      ctx.fill();
    });
  }

  function update() {
    if (isCursorMoving) {
      circles.forEach((circle) => {
        const distance = Math.sqrt(
          (mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2
        );
        if (distance < cursorRange) {
          const angle = Math.atan2(mouseY - circle.y, mouseX - circle.x);
          const displacement =
            ((cursorRange - distance) / cursorRange) * cursorSpeed;
          circle.x -= displacement * Math.cos(angle);
          circle.y -= displacement * Math.sin(angle);
        } else {
          const dx = circle.baseX - circle.x;
          const dy = circle.baseY - circle.y;
          circle.x += dx / 10;
          circle.y += dy / 10;
        }
      });
    }
  }
  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    init();
  });

  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
    isCursorMoving = true;
  });
  canvas.addEventListener("mouseout", () => {
    isCursorMoving = false;
  });
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  init();
  animate();
}

let canvas = document.getElementById("maincanvas");
drawCircles(canvas);
