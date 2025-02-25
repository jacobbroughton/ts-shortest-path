const gridElement = document.querySelector(".grid") as HTMLElement;
gridElement.style.width = "300px";
gridElement.style.height = "300px";
gridElement.style.backgroundColor = "grey";
gridElement.style.position = "relative";

const maxDimensions: [number, number] = [10, 10];
const currCoords: [number, number] = [0, 0];
let currAxisIndex: 0 | 1 = 0; // 0 = x, 1 = y
let running = true;

// render grid
while (running) {
  // both limits are reached, exit loop
  if (currAxisIndex === 1 && currCoords[currAxisIndex] >= maxDimensions[currAxisIndex]) {
    running = false;
    break;
  }

  const nodeElement = document.createElement("div") as HTMLElement;

  nodeElement.title = `[${currCoords[0]}, ${currCoords[1]}]`;
  nodeElement.style.position = "absolute";
  nodeElement.style.backgroundColor = "green";
  nodeElement.style.border = "1px solid lightgreen";
  nodeElement.style.width = "28px";
  nodeElement.style.height = "28px";
  nodeElement.style.marginLeft = `${currCoords[0] * 10 || 0}%`;
  nodeElement.style.marginTop = `${currCoords[1] * 10 || 0}%`;

  gridElement.appendChild(nodeElement);

  // max x reached, focus on y axis and reset x coord to 0
  if (
    currAxisIndex === 0 &&
    currCoords[currAxisIndex] === maxDimensions[currAxisIndex] - 1
  ) {
    currAxisIndex = 1;
    currCoords[0] = 0;
  }

  // increment coord on current axis
  currCoords[currAxisIndex] += 1;

  if (currCoords[0] === 0 && currCoords[1] < maxDimensions[1]) currAxisIndex = 0;
}
