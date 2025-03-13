type Coord = [number, number];
type CoordOptional = [number | null, number | null];

const maxDimensions: Coord = [10, 10];
const currCoords: Coord = [0, 0];
const targetCoords: Coord = [
  Math.floor(Math.random() * maxDimensions[0]),
  Math.floor(Math.random() * maxDimensions[1]),
]!;
let currAxisIndex: 0 | 1 = 0; // 0 = x, 1 = y
let selectedCoords: CoordOptional = [null, null];
let aboveCoord: CoordOptional = [null, null];
let belowCoord: CoordOptional = [null, null];
let leftCoord: CoordOptional = [null, null];
let rightCoord: CoordOptional = [null, null];
let running = true;
let needsRefresh = false;
let surroundingsNeedRefresh = false;
let runIndex = 0;

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
    const selectedCoords = [parseInt(el.dataset.coordX!), parseInt(el.dataset.coordY!)];

    if (!selectedCoords[0] || !selectedCoords[1]) {
      console.log(selectedCoords);

      throw new Error("No selected coords found");
    }

    // determine surrounding coordinates (above, below, left, right)
    if (
      selectedCoords[1] - 1 === selectedCoords[1] - 1 &&
      selectedCoords[0] === selectedCoords[0]
    ) {
      const aboveX = selectedCoords[0];
      const aboveY = selectedCoords[1] - 1;
      aboveCoord = [aboveX, aboveY];
      console.log("aboveCoord: ", aboveCoord);
    }

    if (
      // selectedCoords[1] < maxDimensions[1] - 1 &&
      selectedCoords[1] + 1 === selectedCoords[1] + 1 &&
      selectedCoords[0] === selectedCoords[0]
    ) {
      const belowX = selectedCoords[0];
      const belowY = selectedCoords[1] + 1;
      belowCoord = [belowX, belowY];
      console.log("belowCoord: ", belowCoord);
    }

    if (
      // selectedCoords[0] > 0 &&
      selectedCoords[0] - 1 === selectedCoords[0] - 1 &&
      selectedCoords[1] === selectedCoords[1]
    ) {
      const leftX = selectedCoords[0] - 1;
      const leftY = selectedCoords[1];

      leftCoord = [leftX, leftY];
      console.log("leftCoord: ", leftCoord);
    }

    if (
      // selectedCoords[0] < maxDimensions[0] - 1 &&
      selectedCoords[0] + 1 === selectedCoords[0] + 1 &&
      selectedCoords[1] === selectedCoords[1]
    ) {
      const rightX = selectedCoords[0] + 1;
      const rightY = selectedCoords[1];
      rightCoord = [rightX, rightY];
      console.log("rightCoord: ", rightCoord);
    }

    if (selectedCoords[0] === targetCoords[0] && selectedCoords[1] === targetCoords[1])
      return;

    nodeElement.style.backgroundColor = "brown";

    selectedCoords[0] = selectedCoords[0]!;
    selectedCoords[1] = selectedCoords[1]!;
    needsRefresh = true;
    surroundingsNeedRefresh = true;

    refreshGrid();
  });

  gridElement.append(nodeElement);

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

  console.log("outer loop running");
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

    // if (!selectedCoords[0] || !selectedCoords[1]) {
    //   console.log(selectedCoords);

    //   throw new Error("No selected coords found");
    // }

    // // determine surrounding coordinates (above, below, left, right)
    // if (
    //   selectedCoords[1] - 1 === currentRefreshCoords[1] - 1 &&
    //   selectedCoords[0] === currentRefreshCoords[0]
    // ) {
    //   const aboveX = currentRefreshCoords[0];
    //   const aboveY = currentRefreshCoords[1] - 1;
    //   aboveCoord = [aboveX, aboveY];
    //   console.log("aboveCoord: ", aboveCoord);
    // }

    // if (
    //   // currentRefreshCoords[1] < maxDimensions[1] - 1 &&
    //   selectedCoords[1] + 1 === currentRefreshCoords[1] + 1 &&
    //   selectedCoords[0] === currentRefreshCoords[0]
    // ) {
    //   const belowX = currentRefreshCoords[0];
    //   const belowY = currentRefreshCoords[1] + 1;
    //   belowCoord = [belowX, belowY];
    //   console.log("belowCoord: ", belowCoord);
    // }

    // if (
    //   // currentRefreshCoords[0] > 0 &&
    //   selectedCoords[0] - 1 === currentRefreshCoords[0] - 1 &&
    //   selectedCoords[1] === currentRefreshCoords[1]
    // ) {
    //   const leftX = currentRefreshCoords[0] - 1;
    //   const leftY = currentRefreshCoords[1];

    //   leftCoord = [leftX, leftY];
    //   console.log("leftCoord: ", leftCoord);
    // }

    // if (
    //   // currentRefreshCoords[0] < maxDimensions[0] - 1 &&
    //   selectedCoords[0] + 1 === currentRefreshCoords[0] + 1 &&
    //   selectedCoords[1] === currentRefreshCoords[1]
    // ) {
    //   const rightX = currentRefreshCoords[0] + 1;
    //   const rightY = currentRefreshCoords[1];
    //   rightCoord = [rightX, rightY];
    //   console.log("rightCoord: ", rightCoord);
    // }

    if (surroundingsNeedRefresh) surroundingsNeedRefresh = false;

    const isClickedSquare =
      currentRefreshCoords[0] === selectedCoords[0] &&
      currentRefreshCoords[1] === selectedCoords[1];

    if (isClickedSquare) {
      // determine which closest (on the grid, not numerically)

      if (targetCoords[0] === null || !targetCoords[1] === null)
        throw new Error("Missing target coordinates");

      // handle diffs
      {
        let leftDiff = [0, 0];

        if (leftCoord[0] && leftCoord[1]) {
          if (targetCoords[0] === null || isNaN(targetCoords[1])) {
            throw new Error("Left target coord missing");
          }
          leftDiff = [leftCoord[0] - targetCoords[0], leftCoord[1] - targetCoords[1]];
        }
        let rightDiff = [0, 0];

        if (rightCoord && rightCoord[0] && rightCoord[1]) {
          if (targetCoords[0] === null || targetCoords[1] === null) {
            throw new Error("Right target coord missing");
          }
          rightDiff = [rightCoord[0] - targetCoords[0], rightCoord[1] - targetCoords[1]];
        }
        let aboveDiff = [0, 0];

        if (aboveCoord && aboveCoord[0] && aboveCoord[1]) {
          if (targetCoords[0] === null || targetCoords[1] === null) {
            throw new Error("Above target coord missing");
          }
          aboveDiff = [aboveCoord[0] - targetCoords[0], aboveCoord[1] - targetCoords[1]];
        }
        let belowDiff = [0, 0];

        if (belowCoord && belowCoord[0] && belowCoord[1]) {
          if (targetCoords[0] === null || targetCoords[1] === null) {
            throw new Error("Below target coord missing");
          }
          belowDiff = [belowCoord[0] - targetCoords[0], belowCoord[1] - targetCoords[1]];
        }
      }
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

    if (rightCoord[0] !== null && rightCoord[1] !== null) {
      const isRightSquare =
        currentRefreshCoords[0] === rightCoord[0] &&
        currentRefreshCoords[1] === rightCoord[1];

      if (isRightSquare) {
        console.log("isRightSquare", rightCoord);

        const rightNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        rightNodeElement.classList.add("right");

        rightNodeElement.style.backgroundColor = "red";
      }
    }

    console.log(
      "currCoords",
      currentRefreshCoords,
      "leftCoord",
      leftCoord,
      "selectedCoord",
      selectedCoords
    );
    if (leftCoord[0] !== null && leftCoord[1] !== null) {
      const isLeftSquare =
        currentRefreshCoords[0] === leftCoord[0] &&
        currentRefreshCoords[1] === leftCoord[1];

      if (isLeftSquare) {
        console.log("isLeftSquare", leftCoord);
        const leftNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        leftNodeElement.classList.add("left");

        leftNodeElement.style.backgroundColor = "grey";
      }
    }

    if (aboveCoord[0] !== null && aboveCoord[1] !== null) {
      const isAboveSquare =
        currentRefreshCoords[0] === aboveCoord[0] &&
        currentRefreshCoords[1] === aboveCoord[1];

      // console.log("currentRefreshCoords", currentRefreshCoords, "aboveCoord", aboveCoord)

      if (isAboveSquare) {
        console.log("isAboveSquare", aboveCoord);
        const aboveNodeElement = document.querySelector(
          `[data-coord-x="${currentRefreshCoords[0]}"][data-coord-y="${currentRefreshCoords[1]}"]`
        ) as HTMLButtonElement;

        aboveNodeElement.classList.add("above");

        aboveNodeElement.style.backgroundColor = "lightblue";
      }
    }

    if (belowCoord[0] !== null && belowCoord[1] !== null) {
      const isBelowSquare =
        currentRefreshCoords[0] === belowCoord[0] &&
        currentRefreshCoords[1] === belowCoord[1];

      if (isBelowSquare) {
        console.log("isBelowSquare", belowCoord);
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
    if (runIndex >= 99) console.log("inner loop (refreshGrid()) ran", runIndex);
  }
}
