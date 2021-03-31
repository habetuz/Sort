import {SVG} from './svg.js'


const TEMPLATE = [
    {value: 9, compared: true},
    {value: 4, compared: true},
    {value: 6, compared: false},
    {value: 2, compared: false},
    {value: 1, compared: false},
    {value: 0, compared: false},
]

var max = getMax(TEMPLATE)

const MIN_CRICLE_SIZE = 5
const MAX_CRICLE_SIZE = 30
const ITEM_COUNT = 6



var bubbleSort = {
    svg: SVG().addTo("#bubble-sort").size("100%","100%"),
    step: 0,
    items: []
}
document.getElementById("bubble-sort").style.height = (6*40+30) + "px"

function bubbleSortAlgorithm(values) {
    console.log("BUBBLE SORT")
    for(var i = 0; i < values.length; i++) {
        for(var j = 0; j < values.length-1-i; j++) {
            if(values[j].value > values[j+1].value) {
                var swap = values[j]
                values[j] = values[j+1]
                values[j+1] = swap
                publish(values.slice(), bubbleSort)
            }
        }
    }
    bubbleSort.svg.size((bubbleSort.items.length-1)*100+60, "100%")
}

bubbleSortAlgorithm(TEMPLATE)

function map(value, min, max, localMax) {
    return ((max-min)/localMax) * value + min
}

function getMax(array) {
    var m = 0
    array.forEach(element => {
        if(element.value > m) m = element.value
    });
    return m
}

function publish(array, target, extras) {
    target.items.push(array)
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        target.svg.circle(map(element.value, MIN_CRICLE_SIZE, MAX_CRICLE_SIZE, getMax(array))).cx(target.step*100 + 30).cy(i*40 + 30).fill("#ffffff")
        if(target.step == 0) continue

        //Draw connection line
        var lastArray = target.items[target.step-1]
        for (let j = 0; j < lastArray.length; j++) {
            const lastElement = lastArray[j];
            if(lastElement.value != element.value) continue
            console.log("i: " + i + " | j: " + j + " | last: " + lastElement.value + " | current: " + element.value)
            target.svg.line((target.step-1)*100 + 30, j*40 + 30, target.step*100 + 30, i*40 + 30).stroke("#ffffff")
        }
    }
    target.step ++
}