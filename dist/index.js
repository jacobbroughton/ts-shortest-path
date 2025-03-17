const maxCoord = [9, 9];
const currCoords = [0, 0];
const targetCoords = [
    Math.floor(Math.random() * maxCoord[0]),
    Math.floor(Math.random() * maxCoord[1]),
];
let currAxisIndex = 0; // 0 = x, 1 = y
let selectedCoords = [null, null];
let aboveCoord = [null, null];
let belowCoord = [null, null];
let leftCoord = [null, null];
let rightCoord = [null, null];
let running = true;
let needsRefresh = false;
let surroundingsNeedRefresh = false;
let runIndex = 0;
let leastDiff = {
    value: null,
    direction: "",
};
const gridElement = document.querySelector(".grid");
gridElement.style.width = "300px";
gridElement.style.height = "300px";
gridElement.style.backgroundColor = "grey";
gridElement.style.position = "relative";
// render grid
while (running) {
    // both limits are reached, exit loop
    if (currCoords[0] > maxCoord[0] && currCoords[1] === maxCoord[1]) {
        running = false;
        break;
    }
    // failsafe
    if (runIndex >= (maxCoord[0] + 1) * (maxCoord[1] + 1)) {
        running = false;
        break;
    }
    const nodeElement = document.createElement("button");
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
    nodeElement.addEventListener("click", (e) => {
        const el = e.target;
        selectedCoords = [parseInt(el.dataset.coordX), parseInt(el.dataset.coordY)];
        if (selectedCoords[0] === null || selectedCoords[1] === null) {
            throw new Error("No selected coords found");
        }
        // determine surrounding coordinates (above, below, left, right)
        if (selectedCoords[1] - 1 === selectedCoords[1] - 1 &&
            selectedCoords[0] === selectedCoords[0]) {
            const aboveX = selectedCoords[0];
            const aboveY = selectedCoords[1] - 1;
            aboveCoord = [aboveX, aboveY];
        }
        if (selectedCoords[1] + 1 === selectedCoords[1] + 1 &&
            selectedCoords[0] === selectedCoords[0]) {
            const belowX = selectedCoords[0];
            const belowY = selectedCoords[1] + 1;
            belowCoord = [belowX, belowY];
        }
        if (selectedCoords[0] - 1 === selectedCoords[0] - 1 &&
            selectedCoords[1] === selectedCoords[1]) {
            const leftX = selectedCoords[0] - 1;
            const leftY = selectedCoords[1];
            leftCoord = [leftX, leftY];
        }
        if (selectedCoords[0] + 1 === selectedCoords[0] + 1 &&
            selectedCoords[1] === selectedCoords[1]) {
            const rightX = selectedCoords[0] + 1;
            const rightY = selectedCoords[1];
            rightCoord = [rightX, rightY];
        }
        if (selectedCoords[0] === targetCoords[0] && selectedCoords[1] === targetCoords[1])
            return;
        nodeElement.style.backgroundColor = "brown";
        selectedCoords[0] = selectedCoords[0];
        selectedCoords[1] = selectedCoords[1];
        needsRefresh = true;
        surroundingsNeedRefresh = true;
        refreshGrid();
    });
    gridElement.append(nodeElement);
    // max x reached, focus on y axis and reset x coord to 0
    if (currAxisIndex === 0 && currCoords[0] === maxCoord[0]) {
        currAxisIndex = 1;
        currCoords[0] = 0;
    }
    // increment coord on current axis
    currCoords[currAxisIndex] += 1;
    if (currCoords[0] === 0 && currCoords[1] <= maxCoord[1]) {
        currAxisIndex = 0;
    }
    runIndex++;
}
function refreshGrid() {
    const refreshCoord = [0, 0];
    let refreshAxis = 0;
    let runIndex = 0;
    console.log("before while loop");
    while (needsRefresh) {
        // console.log(refreshCoord);
        // if (refreshAxis === 1 && refreshCoord[1] >= maxCoord[1]) {
        //   needsRefresh = false;
        //   return;
        // }
        if (
        // runIndex >= maxCoord[0] * maxCoord[1] ||
        refreshCoord[0] > maxCoord[0] ||
            refreshCoord[1] > maxCoord[1]) {
            needsRefresh = false;
            console.log("SEE YA", runIndex, refreshCoord, maxCoord);
            return;
        }
        if (surroundingsNeedRefresh)
            surroundingsNeedRefresh = false;
        const isClickedSquare = refreshCoord[0] === selectedCoords[0] && refreshCoord[1] === selectedCoords[1];
        if (isClickedSquare) {
            // determine which closest (on the grid, not numerically)
            if (targetCoords[0] === null || !targetCoords[1] === null)
                throw new Error("Missing target coordinates");
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
            let leftTotalMoves = leftDiff.reduce((prevValue, currentValue) => (prevValue += Math.abs(currentValue)), 0);
            let rightTotalMoves = rightDiff.reduce((prevValue, currentValue) => (prevValue += Math.abs(currentValue)), 0);
            let aboveTotalMoves = aboveDiff.reduce((prevValue, currentValue) => (prevValue += Math.abs(currentValue)), 0);
            let belowTotalMoves = belowDiff.reduce((prevValue, currentValue) => (prevValue += Math.abs(currentValue)), 0);
            let directionArr = [
                leftTotalMoves || 0,
                rightTotalMoves || 0,
                aboveTotalMoves || 0,
                belowTotalMoves || 0,
            ];
            for (let i = 0; i < directionArr.length; i++) {
                let direction = i === 0
                    ? "left"
                    : i === 1
                        ? "right"
                        : i === 2
                            ? "above"
                            : i === 3
                                ? "below"
                                : "";
                if (leastDiff.value === null)
                    leastDiff = { value: directionArr[i], direction };
                if (leastDiff.value !== null && directionArr[i] < leastDiff.value) {
                    leastDiff.direction = direction;
                    leastDiff.value = directionArr[i];
                }
            }
            // console.log("leftDiff", leftDiff);
            // console.log("rightDiff", rightDiff);
            // console.log("aboveDiff", aboveDiff);
            // console.log("belowDiff", belowDiff);
            // console.log(leastDiff);
        }
        const nodeElement = document.querySelector(`[data-coord-x="${refreshCoord[0]}"][data-coord-y="${refreshCoord[1]}"]`);
        if (!nodeElement)
            throw new Error("Node element not found");
        if (!(refreshCoord[0] === selectedCoords[0] && refreshCoord[1] === selectedCoords[1]) &&
            !(refreshCoord[0] === targetCoords[0] && refreshCoord[1] === targetCoords[1])) {
            // console.log(
            //   "HERE YE HERE YE",
            //   "refreshCoord:",
            //   refreshCoord,
            //   "selectedCoord: ",
            //   selectedCoords,
            //   "targetCoord: ",
            //   targetCoords
            // );
            nodeElement.classList.add("default");
            nodeElement.style.backgroundColor = "green";
            nodeElement.classList.remove("right");
            nodeElement.classList.remove("left");
            nodeElement.classList.remove("above");
            nodeElement.classList.remove("below");
        }
        else {
            // console.log("NOPE", refreshCoord, targetCoords, selectedCoords);
        }
        if (rightCoord[0] !== null && rightCoord[1] !== null) {
            const isRightSquare = refreshCoord[0] === rightCoord[0] && refreshCoord[1] === rightCoord[1];
            if (isRightSquare) {
                if (rightCoord[0] === targetCoords[0] && rightCoord[1] === targetCoords[1])
                    return;
                const rightNodeElement = document.querySelector(`[data-coord-x="${refreshCoord[0]}"][data-coord-y="${refreshCoord[1]}"]`);
                if (leastDiff.direction === "right") {
                    rightNodeElement.classList.add("right");
                    rightNodeElement.style.backgroundColor = "red";
                }
            }
        }
        if (leftCoord[0] !== null && leftCoord[1] !== null) {
            const isLeftSquare = refreshCoord[0] === leftCoord[0] && refreshCoord[1] === leftCoord[1];
            if (isLeftSquare) {
                if (leftCoord[0] === targetCoords[0] && leftCoord[1] === targetCoords[1])
                    return;
                const leftNodeElement = document.querySelector(`[data-coord-x="${refreshCoord[0]}"][data-coord-y="${refreshCoord[1]}"]`);
                if (leastDiff.direction === "left") {
                    leftNodeElement.classList.add("left");
                    leftNodeElement.style.backgroundColor = "grey";
                }
            }
        }
        if (aboveCoord[0] !== null && aboveCoord[1] !== null) {
            const isAboveSquare = refreshCoord[0] === aboveCoord[0] && refreshCoord[1] === aboveCoord[1];
            // console.log("refreshCoord", refreshCoord, "aboveCoord", aboveCoord)
            if (isAboveSquare) {
                if (aboveCoord[0] === targetCoords[0] && aboveCoord[1] === targetCoords[1])
                    return;
                const aboveNodeElement = document.querySelector(`[data-coord-x="${refreshCoord[0]}"][data-coord-y="${refreshCoord[1]}"]`);
                if (leastDiff.direction === "above") {
                    aboveNodeElement.classList.add("above");
                    aboveNodeElement.style.backgroundColor = "lightblue";
                }
            }
        }
        if (belowCoord[0] !== null && belowCoord[1] !== null) {
            const isBelowSquare = refreshCoord[0] === belowCoord[0] && refreshCoord[1] === belowCoord[1];
            if (isBelowSquare) {
                if (belowCoord[0] === targetCoords[0] && belowCoord[1] === targetCoords[1])
                    return;
                const belowNodeElement = document.querySelector(`[data-coord-x="${refreshCoord[0]}"][data-coord-y="${refreshCoord[1]}"]`);
                if (leastDiff.direction === "below") {
                    belowNodeElement.classList.add("below");
                    belowNodeElement.style.backgroundColor = "blue";
                }
            }
        }
        // const endOfX = refreshAxis === 0 && refreshCoord[0] === maxCoord[0];
        // max x reached, focus on y axis and reset x coord to 0
        // if (endOfX) {
        //   refreshAxis = 1;
        //   // refreshCoord[0] = 0;
        // } else {
        //   // increment coord on current axis
        //   refreshCoord[refreshAxis] += 1;
        // }
        // if (refreshCoord[0] === 0 && refreshCoord[1] < maxCoord[1]) refreshAxis = 0;
        // if (
        //   (refreshCoord[0] === maxCoord[0] && refreshCoord[1] === maxCoord[1]) ||
        //   runIndex === (maxCoord[0] + 1) * (maxCoord[1] + 1)
        // ) {
        //   needsRefresh = false;
        // }
        // new below
        // if (endOfX) refreshAxis = 1;
        // if (
        //   refreshCoord[0] === maxCoord[0] &&
        //   refreshAxis === 1 &&
        //   refreshCoord[1] === maxCoord[1]
        // ) {
        //   needsRefresh = false;
        // }
        // if (refreshCoord)
        // if (refreshCoord[0] > maxCoord[0]) {
        //   needsRefresh = false;
        // }
        console.log(refreshAxis, refreshCoord, maxCoord);
        // // new above
        const endOfX = refreshAxis === 0 && refreshCoord[0] === maxCoord[0];
        // max x reached, focus on y axis and reset x coord to 0
        if (endOfX) {
            refreshAxis = 1;
            refreshCoord[0] = 0;
            refreshCoord[1] += 1;
        }
        else {
            // increment coord on current axis
            refreshAxis = 0;
            refreshCoord[0] += 1;
        }
        // if (refreshCoord[0] === 0 && refreshCoord[1] <= maxCoord[1]) {
        //   refreshAxis = 0;
        // }
        runIndex++;
    }
    console.log(runIndex);
}
export {};
//# sourceMappingURL=index.js.map