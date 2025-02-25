const gridElement = document.querySelector(".grid");
gridElement.style.width = "300px";
gridElement.style.height = "300px";
gridElement.style.backgroundColor = "grey";
gridElement.style.position = "relative";
const maxDimensions = [10, 10];
let currCoords = [0, 0];
let currAxisIndex = 0; // 0 = x, 1 = y
let running = true;
// render grid
while (running) {
    // both limits are reached, exit
    if (currAxisIndex === 1 &&
        currCoords[currAxisIndex] >= maxDimensions[currAxisIndex]) {
        running = false;
        break;
    }
    const nodeElement = document.createElement("div");
    nodeElement.title = `[${currCoords[0]}, ${currCoords[1]}]`;
    nodeElement.style.position = "absolute";
    nodeElement.style.backgroundColor = "green";
    nodeElement.style.border = "1px solid lightgreen";
    nodeElement.style.width = "28px";
    nodeElement.style.height = "28px";
    nodeElement.style.marginLeft = `${currCoords[0] * 10 || 0}%`;
    nodeElement.style.marginTop = `${currCoords[1] * 10 || 0}%`;
    gridElement.appendChild(nodeElement);
    if (currAxisIndex === 0 &&
        currCoords[currAxisIndex] === maxDimensions[currAxisIndex] - 1) {
        currAxisIndex = 1;
        currCoords[0] = 0;
    }
    // increment coord on current axis
    currCoords[currAxisIndex] += 1;
    if (currCoords[0] === 0 && currCoords[1] < maxDimensions[1])
        currAxisIndex = 0;
}
console.log("Grid finished");
export {};
//# sourceMappingURL=index.js.map