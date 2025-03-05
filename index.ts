const gridElement = document.querySelector(".grid") as HTMLDivElement;
gridElement.style.width = "300px";
gridElement.style.height = "300px";
gridElement.style.backgroundColor = "grey";
gridElement.style.position = "relative";

const maxDimensions: [number, number] = [10, 10];
const currCoords: [number, number] = [0, 0];
let currAxisIndex: 0 | 1 = 0; // 0 = x, 1 = y
let running = true;
let needsRefresh = false;
const targetCoords = [
  Math.floor(Math.random() * maxDimensions[0]),
  Math.floor(Math.random() * maxDimensions[1]),
];
let selectedCoords: [number | null, number | null] = [null, null];

// render grid
while (running) {
  // both limits are reached, exit loop
  if (currAxisIndex === 1 && currCoords[currAxisIndex] >= maxDimensions[currAxisIndex]) {
    running = false;
    break;
  }

  const nodeElement = document.createElement("button") as HTMLButtonElement;

  nodeElement.title = `[${currCoords[0]}, ${currCoords[1]}]`;
  nodeElement.style.position = "absolute";
  nodeElement.style.backgroundColor =
    targetCoords[0] === currCoords[0] && targetCoords[1] === currCoords[1]
      ? "orange"
      : "green";
  nodeElement.style.border = "1px solid lightgreen";
  nodeElement.style.width = "28px";
  nodeElement.style.height = "28px";
  nodeElement.style.marginLeft = `${currCoords[0] * 10 || 0}%`;
  nodeElement.style.marginTop = `${currCoords[1] * 10 || 0}%`;
  nodeElement.dataset.coordX = `${currCoords[0]}`;
  nodeElement.dataset.coordY = `${currCoords[1]}`;

  nodeElement.addEventListener("click", (e: MouseEvent) => {
    const el = e.target as HTMLButtonElement;
    const clickedCoords = [parseInt(el.dataset.coordX!), parseInt(el.dataset.coordY!)];

    if (clickedCoords[0] === targetCoords[0] && clickedCoords[1] === targetCoords[1])
      return;

    nodeElement.style.backgroundColor = "blue";

    selectedCoords[0] = clickedCoords[0]!;
    selectedCoords[1] = clickedCoords[1]!;
    needsRefresh = true;

    refreshGrid();
  });

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

function refreshGrid() {
  const refreshCoords: [number, number] = [0, 0];
  let currRefreshAxisIndex: 0 | 1 = 0;

  let runIndex = 0;
  while (needsRefresh) {
    if (
      currRefreshAxisIndex === 1 &&
      refreshCoords[currRefreshAxisIndex] >= maxDimensions[currRefreshAxisIndex]
    ) {
      needsRefresh = false;
      break;
    }

    // determine surrounding coordinates (above, bottom, left, right)
    let aboveCoord = null;

    if (refreshCoords[1] > 0) {
      const aboveX = refreshCoords[0];
      const aboveY = refreshCoords[1] - 1;
      aboveCoord = [aboveX, aboveY];
    }

    let belowCoord = null;

    if (refreshCoords[1] < maxDimensions[1] - 1) {
      const belowX = refreshCoords[0];
      const belowY = refreshCoords[1] + 1;
      belowCoord = [belowX, belowY];
    }

    let leftCoord = null;

    if (refreshCoords[0] > 0) {
      const leftX = refreshCoords[0] - 1;
      const leftY = refreshCoords[1];
      leftCoord = [leftX, leftY];
    }

    let rightCoord = null;

    if (refreshCoords[0] < maxDimensions[0] - 1) {
      const rightX = refreshCoords[0] + 1;
      const rightY = refreshCoords[1];
      rightCoord = [rightX, rightY];
    }

    if (
      refreshCoords[0] === selectedCoords[0] &&
      refreshCoords[1] === selectedCoords[1]
    ) {


      // determine which closest (on the grid, not numerically)
      const leftDiff = [leftCoord[0] - targetCoords[0], leftCoord[1] - targetCoords[1]];

      const rightDiff = [
        rightCoord[0] - targetCoords[0],
        rightCoord[1] - targetCoords[1],
      ];

      const aboveDiff = [
        aboveCoord[0] - targetCoords[0],
        aboveCoord[1] - targetCoords[1],
      ];

      const belowDiff = [
        belowCoord[0] - targetCoords[0],
        belowCoord[1] - targetCoords[1],
      ];

      console.log(
        `
target: ${targetCoords.toString()}
left: ${leftCoord?.toString()} - diff: ${leftDiff.toString()}
right: ${rightCoord?.toString()} - diff: ${rightDiff.toString()}
above: ${aboveCoord?.toString()} - diff: ${aboveDiff.toString()}
below: ${belowCoord?.toString()} - diff: ${belowDiff.toString()}
        `
      );
    }

    const nodeElement = document.querySelector(
      `[data-coord-x="${refreshCoords[0]}"][data-coord-y="${refreshCoords[1]}"]`
    ) as HTMLButtonElement;

    if (
      !(
        refreshCoords[0] === selectedCoords[0] && refreshCoords[1] === selectedCoords[1]
      ) &&
      !(refreshCoords[0] === targetCoords[0] && refreshCoords[1] === targetCoords[1])
    ) {
      nodeElement.style.backgroundColor = "green";
    }

    // max x reached, focus on y axis and reset x coord to 0
    if (
      currRefreshAxisIndex === 0 &&
      refreshCoords[currRefreshAxisIndex] === maxDimensions[currRefreshAxisIndex] - 1
    ) {
      currRefreshAxisIndex = 1;
      refreshCoords[0] = 0;
    }

    // increment coord on current axis
    refreshCoords[currRefreshAxisIndex] += 1;

    if (refreshCoords[0] === 0 && refreshCoords[1] < maxDimensions[1])
      currRefreshAxisIndex = 0;

    runIndex++;
  }
}
