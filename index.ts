const maxDimensions: [number, number] = [10, 10];
const currCoords: [number, number] = [0, 0];
const targetCoords = [
  Math.floor(Math.random() * maxDimensions[0]),
  Math.floor(Math.random() * maxDimensions[1]),
]!;

let currAxisIndex: 0 | 1 = 0; // 0 = x, 1 = y
let selectedCoords: [number | null, number | null] = [null, null];
let aboveCoord: null | [number, number] = null;
let belowCoord: null | [number, number] = null;
let leftCoord: null | [number, number] = null;
let rightCoord: null | [number, number] = null;
let running = true;
let needsRefresh = false;
let surroundingsNeedRefresh = false;

const gridElement = document.querySelector(".grid") as HTMLDivElement;
gridElement.style.width = "300px";
gridElement.style.height = "300px";
gridElement.style.backgroundColor = "grey";
gridElement.style.position = "relative";

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
    selectedCoords = [parseInt(el.dataset.coordX!), parseInt(el.dataset.coordY!)];

    if (selectedCoords[0] === targetCoords[0] && selectedCoords[1] === targetCoords[1])
      return;

    nodeElement.style.backgroundColor = "brown";

    selectedCoords[0] = selectedCoords[0]!;
    selectedCoords[1] = selectedCoords[1]!;
    needsRefresh = true;
    surroundingsNeedRefresh = true;

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
  const currentRefreshCoords: [number, number] = [0, 0];
  let currRefreshAxisIndex: 0 | 1 = 0;
  let runIndex = 0;

  while (needsRefresh) {
    if (
      currRefreshAxisIndex === 1 &&
      currentRefreshCoords[currRefreshAxisIndex] >= maxDimensions[currRefreshAxisIndex]
    ) {
      needsRefresh = false;
      break;
    }

    if (!selectedCoords[0] || !selectedCoords[1])
      throw new Error("No selected coords found");

    // determine surrounding coordinates (above, below, left, right)
    if (
      selectedCoords[1] - 1 === currentRefreshCoords[1] - 1 &&
      selectedCoords[0] === currentRefreshCoords[0]
    ) {
      const aboveX = currentRefreshCoords[0];
      const aboveY = currentRefreshCoords[1] - 1;
      aboveCoord = [aboveX, aboveY];
    }

    if (
      // currentRefreshCoords[1] < maxDimensions[1] - 1 &&
      selectedCoords[1] + 1 === currentRefreshCoords[1] + 1 &&
      selectedCoords[0] === currentRefreshCoords[0]
    ) {
      const belowX = currentRefreshCoords[0];
      const belowY = currentRefreshCoords[1] + 1;
      belowCoord = [belowX, belowY];
    }

    if (
      // currentRefreshCoords[0] > 0 &&
      selectedCoords[0] - 1 === currentRefreshCoords[0] - 1 &&
      selectedCoords[1] === currentRefreshCoords[1]
    ) {
      const leftX = currentRefreshCoords[0] - 1;
      const leftY = currentRefreshCoords[1];
      console.log(leftX, leftY)
      leftCoord = [leftX, leftY];
    }

    if (
      // currentRefreshCoords[0] < maxDimensions[0] - 1 &&
      selectedCoords[0] + 1 === currentRefreshCoords[0] + 1 &&
      selectedCoords[1] === currentRefreshCoords[1]
    ) {
      const rightX = currentRefreshCoords[0] + 1;
      const rightY = currentRefreshCoords[1];
      rightCoord = [rightX, rightY];
    }

    if (surroundingsNeedRefresh) surroundingsNeedRefresh = false;

    const isClickedSquare =
      currentRefreshCoords[0] === selectedCoords[0] &&
      currentRefreshCoords[1] === selectedCoords[1];

    if (isClickedSquare) {
      // determine which closest (on the grid, not numerically)

      if (!targetCoords[0] || !targetCoords[1]) throw new Error("No target coordinates");

      let leftDiff = [0, 0];

      if (leftCoord && leftCoord[0] && leftCoord[1])
        leftDiff = [leftCoord[0] - targetCoords[0], leftCoord[1] - targetCoords[1]];

      let rightDiff = [0, 0];

      if (rightCoord && rightCoord[0] && rightCoord[1])
        rightDiff = [rightCoord[0] - targetCoords[0], rightCoord[1] - targetCoords[1]];

      let aboveDiff = [0, 0];

      if (aboveCoord && aboveCoord[0] && aboveCoord[1])
        aboveDiff = [aboveCoord[0] - targetCoords[0], aboveCoord[1] - targetCoords[1]];

      let belowDiff = [0, 0];

      if (belowCoord && belowCoord[0] && belowCoord[1])
        belowDiff = [belowCoord[0] - targetCoords[0], belowCoord[1] - targetCoords[1]];

      // console.log(
      //   `
      //     selected: ${selectedCoords.toString()}
      //     target: ${targetCoords.toString()}
      //     left: ${leftCoord?.toString()} - diff: ${leftDiff.toString()}
      //     right: ${rightCoord?.toString()} - diff: ${rightDiff.toString()}
      //     above: ${aboveCoord?.toString()} - diff: ${aboveDiff.toString()}
      //     below: ${belowCoord?.toString()} - diff: ${belowDiff.toString()}
      //   `
      // );
    }

    const nodeElement = document.querySelector(
      `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
    ) as HTMLButtonElement;

    if (
      !(
        currentRefreshCoords[0] === selectedCoords[0] &&
        currentRefreshCoords[1] === selectedCoords[1]
      ) &&
      !(
        currentRefreshCoords[0] === targetCoords[0] &&
        currentRefreshCoords[1] === targetCoords[1]
      )
    ) {
      nodeElement.style.backgroundColor = "green";
      nodeElement.classList.remove("right");
      nodeElement.classList.remove("left");
      nodeElement.classList.remove("above");
      nodeElement.classList.remove("below");
    }

    if (rightCoord && rightCoord.length) {
      const isRightSquare =
        currentRefreshCoords[0] === rightCoord[0] &&
        currentRefreshCoords[1] === rightCoord[1];

      if (isRightSquare) {
        const rightNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        rightNodeElement.classList.add("right");

        rightNodeElement.style.backgroundColor = "red";
      }
    }

    if (leftCoord && leftCoord.length) {
      const isLeftSquare =
        currentRefreshCoords[0] === leftCoord[0] &&
        currentRefreshCoords[1] === leftCoord[1];

      if (isLeftSquare) {
        const leftNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        leftNodeElement.classList.add("left");

        leftNodeElement.style.backgroundColor = "yellow";
      }
    }

    if (aboveCoord && aboveCoord.length) {
      const isAboveSquare =
        currentRefreshCoords[0] === aboveCoord[0] &&
        currentRefreshCoords[1] === aboveCoord[1];

      if (isAboveSquare) {
        const aboveNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        aboveNodeElement.classList.add("above");

        aboveNodeElement.style.backgroundColor = "apricot";
      }
    }

    if (belowCoord && belowCoord.length) {
      const isBelowSquare =
        currentRefreshCoords[0] === belowCoord[0] &&
        currentRefreshCoords[1] === belowCoord[1];

      if (isBelowSquare) {
        const belowNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        belowNodeElement.classList.add("below");
        belowNodeElement.style.backgroundColor = "blue";
      }
    }

    // if (currentRefreshCoords[0] == aboveCoord[0] && currentRefreshCoords[1] == aboveCoord[1])
    // console.log(currentRefreshCoords, 'above: ', aboveCoord, "below: ", belowCoord, "left: ", leftCoord, 'right: ', rightCoord);

    // max x reached, focus on y axis and reset x coord to 0
    if (
      currRefreshAxisIndex === 0 &&
      currentRefreshCoords[currRefreshAxisIndex] ===
        maxDimensions[currRefreshAxisIndex] - 1
    ) {
      currRefreshAxisIndex = 1;
      currentRefreshCoords[0] = 0;
    }

    // increment coord on current axis
    currentRefreshCoords[currRefreshAxisIndex] += 1;

    if (currentRefreshCoords[0] === 0 && currentRefreshCoords[1] < maxDimensions[1])
      currRefreshAxisIndex = 0;

    runIndex++;
  }
}
