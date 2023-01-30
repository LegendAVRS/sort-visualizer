const canvas_width = 1536, canvas_height = 864;
var array_size = 100;
var rect_arr = new Array();

let rect_width;


class Rectangle {

    constructor(x, value, width) {
        this.x = x;
        this.value = value;
        this.width = width;
        this.height = this.getHeightValue();
        this.y = canvas_height - this.height;
    }

    getHeightValue() {
        return map(this.value, 1, 100, canvas_height * 20 / 100, canvas_height * 80 / 100);
    }

    Draw() {
        rect(this.x, this.y, this.width, this.height);
    }

}

function initArray() {
    reset_flag = true;
    array_size = temp_array_size;
    rect_arr = new Array();
    rect_width = canvas_width / array_size;
    for (let i = 0;i < array_size;++i) {
        let x = i * rect_width;
        let value = random(1, 100);
        rect_arr.push(new Rectangle(x, value, rect_width));
    }
}

let reset_button, start_button, radio;
let reset_flag = false;
let temp_array_size = array_size;
let current_algorithm = "Not selected";

let time1;
let t = 0;

let sound;
let playSoundFlag = false;

async function startSort() {
    if (isSorted()) return;
    time1 = performance.now();
    reset_flag = false;
    current_algorithm = radio.value();
    let algorithm = radio.value();
    switch (algorithm) {
        case "Quicksort":
            quickSort(0, array_size - 1);
            break;
        case "Bubblesort":
            bubbleSort();
            break;
    }
    // bubbleSort();
}

// let soundName = "a.mp3"

function setFinishedTime() {
    t = performance.now() - time1;
}

function resetSort() {
    initArray();
}

// function preload() {
//     sound = loadSound(soundName);
//     sound.amp(1);
// }

function initUI() {
    reset_button = createButton('Reset');
    reset_button.position(0, 0);
    reset_button.mousePressed(resetSort);

    start_button = createButton('Start');
    start_button.position(50, 0);
    start_button.mousePressed(startSort);

    radio = createRadio();
    radio.option('Quicksort');
    radio.option('Bubblesort');
    radio.selected('Quicksort');
    radio.style('color', 'white');
    radio.position(100, 0);

    inp = createInput('100');
    inp.position(0, 0);
    inp.size(30);
    inp.input(setArraySize);
    inp.position(585, 5);
    // inp.value = 100;

    slider = createSlider(1, 50, 25);
    slider.position(960, 5);
    slider.style('width', '80px');

    checkbox = createCheckbox('Play sound', false);
    checkbox.changed(myCheckedEvent);
    checkbox.position(1200, 5);
    checkbox.style('color', 'white');

}

function myCheckedEvent() {
    if (checkbox.checked()) playSoundFlag = true;
    else playSoundFlag = false;
}

function setArraySize() {
    temp_array_size = this.value();
}

function setup() {
    createCanvas(canvas_width, canvas_height);
    initArray();
    initUI();
}

async function bubbleSort() {
    for (let i = 0;i < array_size;++i) {
        for (let j = i + 1;j < array_size;++j) {
            if (reset_flag) return;
            if (rect_arr[i].value > rect_arr[j].value) {
                 await swap(rect_arr[i], rect_arr[j]);
            }
        }
    }
    setFinishedTime();
}

function isSorted() {
    for (let i = 0;i < array_size - 1;++i) {
        if (rect_arr[i].value > rect_arr[i + 1].value) return false;
    }
    return true;
}

function draw() {
    background(0);
    for (let i = 0;i < array_size;++i) {
        rect_arr[i].Draw();
    }    

    textSize(18);
    fill(255,255,255);
    text("Current algorithm: " + current_algorithm, 0, 50);
    text("Time completed: " + (t / 1000).toString() + "s", 0, 100);
    text("Size of array: ", 470, 20);
    text("Speed: ", 900, 20);
    text(slider.value().toString() + "ms", 1050, 20);
}

async function swap(rect1, rect2) {
    // if (playSoundFlag) {
    //     sound.play();
    // }
    await sleep(slider.value());
    
    [rect1.height, rect2.height] = [rect2.height, rect1.height];
    [rect1.y, rect2.y] = [rect2.y, rect1.y];
    [rect1.value, rect2.value] = [rect2.value, rect1.value];

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function quickSort(start, end) {
    if (start > end || reset_flag) {  
      return;
    }
    let index = await partition(start, end);
    await Promise.all(
      [quickSort(start, index - 1), 
       quickSort(index + 1, end)
      ]);   
    if (start == 0 && end == array_size - 1) setFinishedTime();
  }

  async function partition(start, end) {
    let pivotIndex = start;
    let pivotElement = rect_arr[end];
    for (let i = start; i < end; i++) {
        if (reset_flag) return;
      if (rect_arr[i].value < pivotElement.value) {
        await swap(rect_arr[i], rect_arr[pivotIndex]);
        pivotIndex++;
      }
    }
    await swap(rect_arr[end], rect_arr[pivotIndex]);
    return pivotIndex;
  }
      


