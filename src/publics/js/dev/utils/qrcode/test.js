const size = 25;
const text = 'https://codewe.org/ckdl';

function int2bin(int, size=0){
    const str_bin = parseInt(int).toString(2);
    return '0'.repeat(Math.max(0, size-str_bin.length)) + str_bin;
}

/**
 * Convert String to binary string with given size
 * @param {string} str
 * @return {string}
 */
function str2bin(str){
    return str.split('').map(char => {
        const tb = char.charCodeAt(0).toString(2);
        return '0'.repeat(Math.max(0, 8-tb.length)) + tb;
    }).join('');
}

function bin2tab(bin, parser = a=>a){
    const bin_array = [];
    for(let i=0;i<bin.length;i+=2){
        bin_array.push([parser(bin[i]), parser(bin[i+1])]);
    }
    return bin_array;
}

// Mode : Bytes
//insert(matrix, [size-2, size-2], [[0, 0], [1, 0]]);
let codewords = '0100';

// length
const len = text.length;
const bin_len = int2bin(len, 8);
//const bin_array = bin2tab(bin_len, parseInt);
//insert(matrix, [size-6, size-2], bin_array);
codewords += bin_len;

// Content
const bin_text = str2bin(text);
codewords += bin_text;

// Terminator
codewords += '0000';

// Bit padding
codewords += '0'.repeat((8-(codewords.length % 8))%8);

// Byte padding
const padding_len = 224 - codewords.length;
codewords += '1110110000010001'.repeat(18).slice(0, padding_len);

/**************************************\
|   CALCULATE LOG AND ANTI-LOG TABLE   |
\**************************************/
// Based on https://www.thonky.com/qr-code-tutorial/log-antilog-table
// Log[x] = 2*Log[x-1] if result < 256 else result XOR 285
// Antilog is the reversed table of log. Example: Log[2] = 4, so Antilog[4] = 2

const log = [1];
const antilog = [NaN];

let last = 1;
for(let i=1;i<256;i++){
    last = 2 * last;
    if(last >= 256) last ^= 285;
    log[i] = last;
    antilog[last] = i;
}

/*************************************\
|      NUMERATORS AND DENOMINATORS    |
\*************************************/

// codewords are split into 8-bits blocks and convert in numbers
const split = codewords.match(/.{8}/g);
const numbers = split.map(x => parseInt(x,2));

// Based on https://www.thonky.com/qr-code-tutorial/error-correction-table
// Data get from 2-M line
const CORRECTOR_COUNT = 16;
// Data get from calculator https://www.thonky.com/qr-code-tutorial/generator-polynomial-tool?degree=16
const BASE_GENERATOR = [
    [0,16], [120, 15], [104,14], [107,13], [109,12], [102,11], [161,10], [76,9],
    [3,8], [91,7],[191,6], [147,5],[169,4], [182,3], [194,2], [225,1], [120, 0]
];

// Numerator is calculated according to codewords and CORRECTION_COUNT
let numerator = [];
for(let i=0;i<numbers.length;i++){
    numerator.push([numbers[i], numbers.length-i-1 + CORRECTOR_COUNT]);
}

// Denominator is calculated according to base and codewords 8-bits blocks numbers
const base_denominator = BASE_GENERATOR.map(e => [e[0], e[1]+numbers.length-1]);

/*************************************\
|          POLYNOMIAL DIVISION        |
\*************************************/

// log[NUM_ALPHA] is necessary
// log[(DEN_ALPHA + alpha_sup) % 255]

for(let i=0;i<numbers.length;i++){
    const alpha_sup = numerator[0][0];

    const denominator = base_denominator.map(e => [log[(e[0] + alpha_sup) % 255], e[1]-i]);

    const quotient = [];
    for(let i=0;i<Math.max(numerator.length, denominator.length);i++){
        let [num_a, num_x] = numerator[i] || [0, numerator[i-1][1]-1];
        let [den_n, den_x] = denominator[i] || [0, 0];

        const n = log[num_a] ^ den_n;

        if(i > 0 || n > 0) quotient.push([(antilog[n] || 0), num_x]);
    }
    numerator = quotient;
}

const error_correction = numerator.map(e => log[e[0]]);
const error_correction_bin = error_correction.map(x => int2bin(x)).join('');

/*************************************\
|             FINAL MESSAGE           |
\*************************************/

const final_message = codewords + error_correction_bin;
const final_message_array = final_message.split('');
console.log(final_message);

/*************************************\
|              BASE MATRIX            |
\*************************************/

const matrix = new Array(size);

for(let i=0;i<matrix.length;i++){
    matrix[i] = new Array(size).fill(0);
}

const reserved = [];

function insert(matrix, from, pattern){
    const [x, y] = from;
    for(let i=0;i<pattern.length;i++){
        for(let j=0;j<pattern[i].length;j++){
            matrix[x+i][y+j] = pattern[i][j];
            reserved.push((x+i)*size+y+j);
        }
    }
}

function insertMultiple(matrix, from, pattern){
    for(const el of from){
        insert(matrix, el, pattern);
    }
}

// Fixed part
insert(matrix, [0, 0], [
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
])
insert(matrix, [0, size-8], [
    [0,1,1,1,1,1,1,1],
    [0,1,0,0,0,0,0,1],
    [0,1,0,1,1,1,0,1],
    [0,1,0,1,1,1,0,1],
    [0,1,0,1,1,1,0,1],
    [0,1,0,0,0,0,0,1],
    [0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
])
insert(matrix, [size-8, 0], [
    [0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0],
])

for(let i=7;i<size-7;i++){
    matrix[i][6] = (i+1)%2;
    reserved.push(i*size+6);
}

for(let j=7;j<size-7;j++){
    matrix[6][j] = (j+1)%2;
    reserved.push(6*size+j);
}

matrix[size-8][8] = 1;
reserved.push((size-8)* size+8);

insert(matrix, [size-9, size-9], [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
]);

for(let line=(size-1)/2;line>0;line--){
    console.log(line);
    for(let col=size-1;col>=0;col--){
        let x = line < 4 ? line*2-1 : line*2;
        const y = line%2 === 0 ? col : size-col-1;
        if(!reserved.includes(y*size+x))  matrix[y][x] = parseInt(final_message_array.shift());
        x -= 1;
        if(!reserved.includes(y*size+x))  matrix[y][x] = parseInt(final_message_array.shift());
    }
}







// Create and insert
const container = document.getElementById('qrcode');
const canvas = document.createElement('canvas');

canvas.width = size;
canvas.height = size;

const ctx = canvas.getContext('2d');
ctx.createImageData(size, size);
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;
for (let i=0;i<matrix.length;i++) {
    for(let j=0;j<matrix[i].length;j++){
        data[4*(size*i+j)] = data[4*(size*i+j)+1] = data[4*(size*i+j)+2] = (matrix[i][j]+1)%2 * 255;
        /*if(!reserved.includes(i*size+j)){
            data[4*(size*i+j)] = data[4*(size*i+j)+1] = data[4*(size*i+j)+2] = 124;
        }*/
        data[4*(size*i+j)+3] = 255;
    }
}
ctx.putImageData(imageData, 0, 0);
ctx.imageSmoothingEnabled = false;

container.appendChild(canvas);


// https://codewe.org/AlfDk
