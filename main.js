import { SVG } from './svg.js'

//================================================================================
// Event listener
//================================================================================
document.getElementById("button-random").addEventListener("click", function () {
    arrayGenerator = getRandomArray
    run()
})
document.getElementById("button-reverse").addEventListener("click", function () {
    arrayGenerator = getReverseArray
    run()
})
document.getElementById("button-addone").addEventListener("click", function () {
    itemCount++
    run()
})
document.getElementById("button-subtractone").addEventListener("click", function () {
    itemCount--
    run()
})
document.getElementById("bubble-sort-switch").addEventListener("input", function () {
    toggleAlgorithm(bubbleSortAlgorithm, bubbleSort)
})
document.getElementById("insert-sort-switch").addEventListener("input", function () {
    toggleAlgorithm(insertSortAlgorithm, insertSort)
})
document.getElementById("merge-sort-switch").addEventListener("input", function () {
    toggleAlgorithm(mergeSortAlgorithm, mergeSort)
})
document.getElementById("quick-sort-switch").addEventListener("input", function () {
    toggleAlgorithm(quickSortAlgorithm, quickSort)
})
//================================================================================
// Constants and values
//================================================================================

const MIN_CRICLE_SIZE = 8
const MAX_CRICLE_SIZE = 30

var itemCount = 8
var arrayGenerator = getRandomArray
var latestValues
var algorithms = [
    bubbleSortAlgorithm,
    insertSortAlgorithm,
    mergeSortAlgorithm,
    quickSortAlgorithm
]

//================================================================================
// Bubble-Sort
//================================================================================

var bubbleSort = {
    svg: SVG().addTo("#bubble-sort").size("100%", "100%"),
    step: 0,
    items: [],
    idPrefix: "bubble"
}

function bubbleSortAlgorithm(values) {
    document.getElementById("bubble-sort").style.height = ((itemCount + 1) * 40 + 30) + "px"
    bubbleSort.svg.clear()
    bubbleSort.step = 0
    bubbleSort.items = []
    publish(copyArray(values), bubbleSort)
    for (let i = 0; i < values.length; i++) {
        let changed = false
        for (let j = 0; j < values.length - 1 - i; j++) {
            if (values[j].value > values[j + 1].value) {
                swap(values, j, j + 1)
                changed = true
            }
            let copy = copyArray(values)
            copy[j].gotCompared = true
            copy[j + 1].gotCompared = true
            bubbleSortDrawMarker(i)
            publish(copy, bubbleSort)
        }
        if(!changed) break
    }
    bubbleSortDrawMarker(values.length)
    bubbleSort.svg.size((bubbleSort.items.length - 1) * 100 + 60, "100%")
}

function bubbleSortDrawMarker(i) {
    let startID = itemCount-1
    let endID = itemCount -i
    if(startID-endID < 0) return
    let start = SVG(document.getElementById(bubbleSort.idPrefix + (bubbleSort.step - 1) + "-" + startID))
    let end = SVG(document.getElementById(bubbleSort.idPrefix + (bubbleSort.step - 1) + "-" + endID))
    bubbleSort.svg.line(start.cx(), start.cy(), end.cx(), end.cy()).stroke({ color: "#546653", width: 50, linecap: "round" }).back()
}

//================================================================================
// Insert-Sort
//================================================================================

var insertSort = {
    svg: SVG().addTo("#insert-sort").size("100%", "100%"),
    step: 0,
    items: [],
    idPrefix: "insert"
}

function insertSortAlgorithm(values) {
    document.getElementById("insert-sort").style.height = ((itemCount + 1) * 40 + 30) + "px"
    insertSort.svg.clear()
    insertSort.step = 0
    insertSort.items = []
    publish(copyArray(values), insertSort)
    for (let i = 1; i < values.length; i++) {
        for (let j = 0; j < i; j++) {
            let breakAfter = false
            if (values[j].value > values[i].value) {
                shift(values, i, j)
                breakAfter = true
            }
            let copy = copyArray(values)
            copy[i].gotCompared = true
            copy[j].gotCompared = true
            //console.log("step: " + insertSort.step + " | i: " + i)
            insertSortDrawMarker(i)
            publish(copy, insertSort)
            if (breakAfter) break
        }
    }
    insertSortDrawMarker(values.length)
    insertSort.svg.size((insertSort.items.length - 1) * 100 + 60, "100%")
}

function insertSortDrawMarker(i) {
    let startID = 0
    let endID = i-1
    let start = SVG(document.getElementById(insertSort.idPrefix + (insertSort.step - 1) + "-" + startID))
    let end = SVG(document.getElementById(insertSort.idPrefix + (insertSort.step - 1) + "-" + endID))
    insertSort.svg.line(start.cx(), start.cy(), end.cx(), end.cy()).stroke({ color: "#546653", width: 50, linecap: "round" }).back()
}

//================================================================================
// Merge-Sort
//================================================================================

var mergeSort = {
    svg: SVG().addTo("#merge-sort").size("100%", "100%"),
    step: 0,
    items: [],
    idPrefix: "merge"
}

function mergeSortAlgorithm(values) {
    document.getElementById("merge-sort").style.height = ((itemCount + 1) * 40 + 30) + "px"
    mergeSort.svg.clear()
    mergeSort.step = 0
    mergeSort.items = []
    publish(copyArray(values), mergeSort)
    for (let i = 2; i < values.length * 2; i *= 2) {
        for (let j = 0; j <= Math.floor((values.length) / i); j++) {
            let a = j * i
            let b = j * i + i / 2
            for (let k = j * i; b < j * i + i && b < values.length && a < b; k++) {
                //console.log("i: " + i + " | j: " + j + " | k: " + k + " | a: " + a + " | b: " + b)
                let originalA = a
                let originalB = b
                if (values[a].value < values[b].value) {
                    a++
                } else {
                    shift(values, b, a)
                    a++
                    b++
                    //console.log(values)

                }
                let copy = copyArray(values)
                copy[originalA].gotCompared = true
                copy[originalB].gotCompared = true
                mergeSortDrawMarker(i, j, a)
                publish(copy, mergeSort)
            }
        }
    }
    mergeSortDrawMarker(itemCount, 0, itemCount)
    mergeSort.svg.size((mergeSort.items.length - 1) * 100 + 60, "100%")
}

function mergeSortDrawMarker(i, j, a) {
    if(a < itemCount) {
        let unsortedStartID = a-1
        let unsortedEndID = i * (j + 1) - 1
        if (unsortedEndID >= itemCount) unsortedEndID = itemCount - 1
        let unsortedStart = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step - 1) + "-" + unsortedStartID))
        let unsortedEnd = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step - 1) + "-" + unsortedEndID))
        mergeSort.svg.line(unsortedStart.cx(), unsortedStart.cy(), unsortedEnd.cx(), unsortedEnd.cy()).stroke({ color: "#4d4d4d", width: 50, linecap: "round" }).back()
    }
    let sortedStartID = i * j
    let sortedEndID = a-1
    if(sortedEndID-sortedStartID <= 0) return
    let sortedStart = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step - 1) + "-" + sortedStartID))
    let sortedEnd = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step - 1) + "-" + sortedEndID))
    mergeSort.svg.line(sortedStart.cx(), sortedStart.cy(), sortedEnd.cx(), sortedEnd.cy()).stroke({ color: "#546653", width: 50, linecap: "round" }).back()
}

//================================================================================
// Quick-Sort
//================================================================================

var quickSort = {
    svg: SVG().addTo("#quick-sort").size("100%", "100%"),
    step: 0,
    items: [],
    idPrefix: "quick"
}

function quickSortAlgorithm(values) {
    document.getElementById("quick-sort").style.height = ((itemCount + 1) * 40 + 30) + "px"
    quickSort.svg.clear()
    quickSort.step = 0
    quickSort.items = []
    let stack = []
    let finished = []
    stack.push({start: 0, end: values.length-1})
    publish(copyArray(values), quickSort)
    while(stack.length > 0) {
        let element = stack.pop()
        let offset = 0
        for(let i = element.start; i < element.end-offset; i++) {
            let shifted = false
            if(values[i].value > values[element.end-offset].value) {
                shift(values, i, element.end-offset)
                shifted = true
            } else {

            }
            let copy = copyArray(values)
            copy[i].gotCompared = true
            copy[element.end-offset].gotCompared = true
            publish(copy, quickSort)
            quickSortDrawMarker(element, offset, finished)
            if(shifted) {
                i--
                offset++
            }
        }
        let a = {start: element.start, end: element.end-offset-1}
        let b = {start: element.end-offset+1, end: element.end}
        if(a.end-a.start > 0)       stack.push(a) 
        else if(a.end-a.start == 0) finished.push(a.end) 
        if(b.end-b.start > 0)       stack.push(b) 
        else                        finished.push(b.end) 
        finished.push(element.end-offset)
    }
    let start = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-1) + "-" + 0))
    let end = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-1) + "-" + (itemCount-1)))
    quickSort.svg.line(start.cx(), start.cy(), end.cx(), end.cy()).stroke({color: "#546653", width: 50, linecap:  "round"}).back()
    quickSort.svg.size((quickSort.items.length - 1) * 100 + 60, "100%")
}

function quickSortDrawMarker(element, offset, finished) {
    let pivotID = element.end - offset
    let pivot = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-2) + "-" + pivotID))
    quickSort.svg.circle(50).fill("#383838").cx(pivot.cx()).cy(pivot.cy()).back()
    
    let start = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-2) + "-" + element.start))
    let end = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-2) + "-" + element.end))
    quickSort.svg.line(start.cx(), start.cy(), end.cx(), end.cy()).stroke({color: "#4d4d4d", width: 50, linecap:  "round"}).back()

    finished.forEach(item => {
        let finishedStartID = (item-1 >= 0 && item == element.end+1) || finished.includes(item-1) ? item-1 : item
        let finishedEndID = (item+1 < itemCount && item == element.start-1) || finished.includes(item+1) ? item+1 : item
        //console.log("start id: " + finishedStartID + " | end id: " + finishedEndID + " | item: " + item)
        let finishedStart = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-2) + "-" + finishedStartID))
        let finishedEnd = SVG(document.getElementById(quickSort.idPrefix + (quickSort.step-2) + "-" + finishedEndID))
        quickSort.svg.line(finishedStart.cx(), finishedStart.cy(), finishedEnd.cx(), finishedEnd.cy()).stroke({color: "#546653", width: 50, linecap:  "round"}).back()
    });
}

//================================================================================
// Execution
//================================================================================

document.getElementsByTagName("input").forEach(element => {element.checked = true})
run()

function run() {
    console.info("---running again---")
    let {time, value} = measureExecutionTime(arrayGenerator)
    latestValues = value
    console.info("* Array generation took about " + time + "ms")
    runAlgorithms(value)

}

function getRandomArray() {
    let array = new Array(itemCount)
    for (let i = 0; i < itemCount; i++) {
        /*
        let index = getRandom(itemCount)
        while (array[index] != null) {
            index ++
            if(index >= array.length) index = 0
        }
        */
       let index
       do {
           index = getRandom(itemCount)
       } while(array[index] != null)
        array[index] = { value: i }
    }
    return array
}

function getReverseArray() {
    let array = new Array(itemCount)
    for (let i = 0; i < itemCount; i++) {
        array[i] = { value: itemCount - i - 1 }
    }
    return array
}

function runAlgorithms(array) {
    algorithms.forEach(algorithm => {
        algorithm(copyArray(array))
    });
    /*
    console.info("* Bubble-Sort took about " + measureExecutionTime(bubbleSortAlgorithm, copyArray(array)).time + "ms")
    console.info("* Insert-Sort took about " + measureExecutionTime(insertSortAlgorithm, copyArray(array)).time + "ms")
    console.info("*  Merge-Sort took about " + measureExecutionTime(mergeSortAlgorithm , copyArray(array)).time + "ms")
    console.info("*  Quick-Sort took about " + measureExecutionTime(quickSortAlgorithm , copyArray(array)).time + "ms")
    */
}

//================================================================================
// Helper functions
//================================================================================

function toggleAlgorithm(algorithm, item) {
    if(algorithms.includes(algorithm)) {
        removeItem(algorithms, algorithm)
        item.svg.rect(item.svg.width(), item.svg.height()).fill("#00000080")

    }
    else {
        algorithms.push(algorithm)
        algorithm(latestValues)
    }
}

function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

function measureExecutionTime(fun, parameters) {
    let start = window.performance.now()
    let returnValue = fun(parameters)
    let end = window.performance.now()
    return {time: end-start, value: returnValue}
}

function swap(array, a, b) {
    let swap = array[a]
    array[a] = array[b]
    array[b] = swap
    return array
}

function shift(array, from, to) {
    let swap = array[from]
    if (from > to) {
        for (let i = from; i > to; i--) {
            array[i] = array[i - 1]
        }
    } else {
        for (let i = from; i < to; i++) {
            array[i] = array[i + 1]
        }
    }
    array[to] = swap
}

function copyArray(array) {
    let copy = array.slice()
    for (let i = 0; i < copy.length; i++) {
        copy[i] = Object.assign({}, array[i])

    }
    return copy
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function map(value, min, max, localMax) {
    return ((max - min) / localMax) * value + min
}

function getMax(array) {
    let m = 0
    array.forEach(element => {
        if (element.value > m) m = element.value
    });
    return m
}

function mapColor(value, localMax) {
    let rValue = map(value, 0, 255, localMax)
    let gValue = 70
    let bValue = 255 - rValue
    return new SVG.Color({ r: rValue, g: gValue, b: bValue })
    //return "rgb(" + rValue + ", " + gValue + ", " + bValue + ")"
}

function publish(array, target) {
    target.items.push(array)
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        target.svg
            .circle(
                map(
                    element.value,
                    MIN_CRICLE_SIZE,
                    MAX_CRICLE_SIZE,
                    getMax(array)))
            .cx(target.step * 100 + 30)
            .cy(i * 40 + 30)
            .fill("#F5F6F7"/*mapColor(element.value, getMax(array))*/)
            .id(target.idPrefix + target.step + "-" + i)
        if (target.step == 0) continue
        if (element.gotCompared) {
            SVG(document.getElementById(target.idPrefix + (target.step - 1) + "-" + i)).stroke({ color: "#E8911A", width: 4 })
        }
        //Draw connection line
        let lastArray = target.items[target.step - 1]
        for (let j = 0; j < lastArray.length; j++) {
            const lastElement = lastArray[j];
            if (lastElement.value != element.value) continue
            //console.log("i: " + i + " | j: " + j + " | last: " + lastElement.value + " | current: " + element.value)
            target.svg
                .line(
                    (target.step - 1) * 100 + 30, j * 40 + 30,
                    target.step * 100 + 30, i * 40 + 30)
                .stroke({ color: "#F5F6F7", width: 2 }/*mapColor(element.value, getMax(array))*/)
                .id(target.idPrefix + (target.step - 1) + "-" + j + "---" + target.step + "-" + i)
        }
    }
    target.svg
        .text(target.step + "")
        .cx(target.step * 100 + 30)
        .cy(itemCount * 40 + 30)
        .font("family", "Montserrat")
        .fill("#F5F6F7")
    target.step++
}