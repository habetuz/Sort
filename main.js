import {SVG} from './svg.js'

//================================================================================
// Event listener
//================================================================================
document.getElementById("button-random").addEventListener("click", function() {
    runMode = runRandom
    runAgain()
})
document.getElementById("button-reverse").addEventListener("click", function() {
    runMode = runReverse
    runAgain()
})
document.getElementById("button-addone").addEventListener("click", function() {
    itemCount ++
    runAgain()
})
document.getElementById("button-subtractone").addEventListener("click", function() {
    itemCount--
    runAgain()
})

//================================================================================
// Constants and values
//================================================================================

const MIN_CRICLE_SIZE = 8
const MAX_CRICLE_SIZE = 30

var itemCount = 5
var runMode = runRandom

//================================================================================
// Bubble-Sort
//================================================================================

var bubbleSort = {
    svg: SVG().addTo("#bubble-sort").size("100%","100%"),
    step: 0,
    items: [],
    idPrefix: "bubble"
}

function bubbleSortAlgorithm(values) {
    document.getElementById("bubble-sort").style.height = ((itemCount+1)*40+30) + "px"
    bubbleSort.svg.clear()
    bubbleSort.step = 0
    bubbleSort.items = []
    publish(copyArray(values), bubbleSort)
    for(let i = 0; i < values.length; i++) {
        for(let j = 0; j < values.length-1-i; j++) {
            if(values[j].value > values[j+1].value) {
                swap(values, j, j+1)
                
            }
            let copy = copyArray(values)
            copy[j].gotCompared = true
            copy[j+1].gotCompared = true
            bubbleSortDrawFinishedArea(i)
            publish(copy, bubbleSort)
        }
    }
    bubbleSortDrawFinishedArea(values.length)
    bubbleSort.svg.size((bubbleSort.items.length-1)*100+60, "100%")
}

function bubbleSortDrawFinishedArea(i) {
    if(i > 0) bubbleSort.svg.rect(100, (i)*40)
        .cx((bubbleSort.step-1)*100 + 30)
        .y(((itemCount+1)*40+30) - ((i+1.5)*40))
        .fill("#546653")
        .back()
}

//================================================================================
// Insert-Sort
//================================================================================

var insertSort = {
    svg: SVG().addTo("#insert-sort").size("100%","100%"),
    step: 0,
    items: [],
    idPrefix: "insert"
}

function insertSortAlgorithm(values) {
    document.getElementById("insert-sort").style.height = ((itemCount+1)*40+30) + "px"
    insertSort.svg.clear()
    insertSort.step = 0
    insertSort.items = []
    publish(copyArray(values), insertSort)
    for(let i = 1; i < values.length; i++) {
        for(let j = 0; j < i; j++) {
            let breakAfter = false
            if(values[j].value > values[i].value) {
                shift(values, i, j)
                breakAfter = true
            }
            let copy = copyArray(values)
            copy[i].gotCompared = true
            copy[j].gotCompared = true
            console.log("step: " + insertSort.step + " | i: " + i)
            insertSortDrawFinishedArea(i)
            publish(copy, insertSort)
            if(breakAfter) break
        }
    }
    insertSortDrawFinishedArea(values.length)
    insertSort.svg.size((insertSort.items.length-1)*100+60, "100%")
}

function insertSortDrawFinishedArea(i) {
    insertSort.svg.rect(100, (i)*40 +10)
        .cx((insertSort.step-1)*100 + 30)
        .y(0)
        .fill("#546653")
        .back()
}

//================================================================================
// Merge-Sort
//================================================================================

var mergeSort = {
    svg: SVG().addTo("#merge-sort").size("100%","100%"),
    step: 0,
    items: [],
    idPrefix: "merge"
}

function mergeSortAlgorithm(values) {
    document.getElementById("merge-sort").style.height = ((itemCount+1)*40+30) + "px"
    mergeSort.svg.clear()
    mergeSort.step = 0
    mergeSort.items = []
    publish(copyArray(values), mergeSort)
    for (let i = 2; i < values.length*2; i*=2) {
        for (let j = 0; j <= Math.floor((values.length)/i); j++) {
            let a = j*i
            let b = j*i +i/2
            for(let k = j*i; b < j*i+i && b < values.length && a < b; k++) {
                //console.log("i: " + i + " | j: " + j + " | k: " + k + " | a: " + a + " | b: " + b)
                let originalA = a
                let originalB = b
                if(values[a].value<values[b].value) {
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
                mergeSortDrawComparisonArea(i, j)
                publish(copy, mergeSort)
            }
        }
    }
    mergeSort.svg.size((mergeSort.items.length-1)*100+60, "100%")
}

function mergeSortDrawComparisonArea(i, j) {
    let startID = i*j
    let endID = i*(j+1) -1
    if(endID >= itemCount) endID = itemCount-1
    let start = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step-1) + "-" + startID))
    let end = SVG(document.getElementById(mergeSort.idPrefix + (mergeSort.step-1) + "-" + endID))
    mergeSort.svg.line(start.cx(), start.cy(), end.cx(), end.cy()).stroke({color: "#4d4d4d", width: 50, linecap: "round"}).back()
}

//================================================================================
// Quick-Sort
//================================================================================

var quickSort = {
    svg: SVG().addTo("#quick-sort").size("100%","100%"),
    step: 0,
    items: [],
    idPrefix: "quick"
}

function quickSortAlgorithm(array) {
    
}


//================================================================================
// Execution
//================================================================================

runAgain()

function runAgain() {
    runMode()
}

function runRandom() {
    let array = new Array(itemCount)
    for (let i = 0; i < itemCount; i++) {
        let index
        do {
            index = getRandom(itemCount)
        } while(array[index] != null)
        array[index] = {value: i}
    }
    runAlgorithms(array)
}

function runReverse() {
    let array = new Array(itemCount)
    for (let i = 0; i < itemCount; i++) {
        array[i] = {value: itemCount-i-1}
    }
    runAlgorithms(array)
}

function runAlgorithms(array) {
    bubbleSortAlgorithm(copyArray(array))
    insertSortAlgorithm(copyArray(array))
    mergeSortAlgorithm(copyArray(array))
}

//================================================================================
// Helper functions
//================================================================================

function swap(array, a, b) {
    let swap = array[a]
    array[a] = array[b]
    array[b] = swap
    return array
}

function shift(array, from, to) {
    let swap = array[from]
    if(from > to) {
        for(let i = from; i > to; i--) {
            array[i] = array[i-1]
        }
    } else {
        for(let i = from; i < to; i++) {
            array[i] = array[i+1]
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
    return ((max-min)/localMax) * value + min
}

function getMax(array) {
    let m = 0
    array.forEach(element => {
        if(element.value > m) m = element.value
    });
    return m
}

function mapColor(value, localMax) {
    let rValue = map(value, 0, 255, localMax)
    let gValue = 70
    let bValue = 255-rValue
    return new SVG.Color({r: rValue, g: gValue, b: bValue})
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
            .cx(target.step*100 + 30)
            .cy(i*40 + 30)
            .fill("#F5F6F7"/*mapColor(element.value, getMax(array))*/)
            .id(target.idPrefix + target.step + "-" + i)
        if(target.step == 0) continue
        if(element.gotCompared) {
            SVG(document.getElementById(target.idPrefix + (target.step-1) + "-" + i)).stroke({ color: "#E8911A", width: 4})
        }
        //Draw connection line
        let lastArray = target.items[target.step-1]
        for (let j = 0; j < lastArray.length; j++) {
            const lastElement = lastArray[j];
            if(lastElement.value != element.value) continue
            //console.log("i: " + i + " | j: " + j + " | last: " + lastElement.value + " | current: " + element.value)
            target.svg
                .line(
                    (target.step-1)*100 + 30,   j*40 + 30, 
                    target.step*100 + 30,       i*40 + 30)
                .stroke({color: "#F5F6F7", width: 2}/*mapColor(element.value, getMax(array))*/)
                .id(target.idPrefix + (target.step -1) + "-" + j + "---" + target.step + "-" + i)
        }
    }
    target.svg
        .text(target.step+"")
        .cx(target.step*100 + 30)
        .cy(itemCount*40+30)
        .font("family","Montserrat")
        .fill("#F5F6F7")
    target.step ++
}