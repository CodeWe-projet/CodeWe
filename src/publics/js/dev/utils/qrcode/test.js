const version = 2; // 1 or 2
const size = ((version-1)*4)+21;
const text = 'https://codewe.org/abcde';
const mode = 2; // 0 = Numeric, 1 = Alphanumeric, 2 = Binary
const correction_level = '00'; // https://www.thonky.com/qr-code-tutorial/format-version-information
const mask_pattern = int2bin(1, 3); // https://www.thonky.com/qr-code-tutorial/mask-patterns
const ie = '101000100100101'.split('').map(parseInt); // https://www.thonky.com/qr-code-tutorial/format-version-tables

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

const ALPHA_TABLE = {'0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'A': 10,'B': 11,'C': 12,'D': 13,'E': 14,'F': 15,'G': 16,'H': 17,'I': 18,'J': 19,'K': 20,'L': 21,'M': 22,'N': 23,'O': 24,'P': 25,'Q': 26,'R': 27,'S': 28,'T': 29,'U': 30,'V': 31,'W': 32,'X': 33,'Y': 34,'Z': 35,' ': 36,'$': 37,'%': 38,'*': 39,'+': 40,'-': 41,'.': 42,'/': 43,':': 44};
function alpha(char){
    return ALPHA_TABLE[char];
}

// Mode
let codewords = '';
switch (mode){
    case 0:
        codewords += '0001';
        break;
    case 1:
        codewords += '0010';
        break;
    case 2:
        codewords += '0100';
        break
    default:
        console.error(`Unknown mode ${mode}`);
}

// length
const len = text.length;
switch (mode){
    case 0:
        codewords += int2bin(len, 10);
        break;
    case 1:
        codewords += int2bin(len, 9);
        break;
    case 2:
        codewords += int2bin(len, 8);
        break;
}

// Content
switch (mode){
    case 0:
        codewords += text.match(/.{3}/g).map(x => int2bin(x, 10)).join('');
        if(text.length%3 === 1) codewords += int2bin(parseInt(text.slice(-1)), 4);
        if(text.length%3 === 2) codewords += int2bin(parseInt(text.slice(-2)), 7);
        break;
    case 1:
        codewords += text.match(/.{2}/g).map(function (x){
            if(x.length === 1) x = '0' + x;
            return int2bin(alpha(x[0])*45 + alpha(x[1]), 11);
        }).join('');
        if(text.length%2 === 1) codewords += int2bin(alpha(text.slice(-1)), 6);
        break;
    case 2:
        codewords += str2bin(text);
        break
    default:
        console.error(`Unknown mode ${mode}`);
}

// Terminator
codewords += '0000';

// Bit padding
codewords += '0'.repeat((8-(codewords.length % 8))%8);

// Byte padding
//TODO Calculate length programmatically
// M-1: 128
// M-2: 224
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
// Data get from calculator https://www.thonky.com/qr-code-tutorial/generator-polynomial-tool?degree=16
const BASE_GENERATOR = //[[0, 10], [251,9], [67,8], [46,7], [61,6], [118,5], [70,4], [64,3], [94,2], [32,1], [45, 0]];

// 2-M
[
    [0,16], [120, 15], [104,14], [107,13], [109,12], [102,11], [161,10], [76,9],
    [3,8], [91,7],[191,6], [147,5],[169,4], [182,3], [194,2], [225,1], [120, 0]
];
// 2-M : 16
// 1-M : 10
const CORRECTOR_COUNT = BASE_GENERATOR.length-1;

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

for(let i=0;i<numbers.length;i++){
    const alpha_sup = antilog[numerator[0][0]];

    const denominator = base_denominator.map(e => [log[(e[0] + alpha_sup) % 255], e[1]-i]);

    const quotient = [];
    for(let i=0;i<Math.max(numerator.length, denominator.length);i++){
        let [num_a, num_x] = numerator[i] || [0, numerator[i-1][1]-1];
        let [den_n, den_x] = denominator[i] || [0, 0];

        const n = num_a ^ den_n;

        if(i > 0 || n > 0) quotient.push([(n || 0), num_x]);
    }

    numerator = quotient;
}

const error_correction = numerator.map(e => e[0]);
const error_correction_bin = error_correction.map(x => int2bin(x, 8)).join('');

/*************************************\
|             FINAL MESSAGE           |
\*************************************/

const final_message = codewords + error_correction_bin;
const final_message_array = final_message.split('');

console.log(codewords.length, error_correction_bin.length);

console.log(codewords.match(/.{8}/g).map(x => parseInt(x, 2).toString(16).toUpperCase()).join(' '));
console.log(error_correction_bin.match(/.{8}/g).map(x => parseInt(x, 2).toString(16).toUpperCase()).join(' '));

/*************************************\
|              BASE MATRIX            |
\*************************************/

const matrix = new Array(size);

for(let i=0;i<matrix.length;i++){
    matrix[i] = new Array(size).fill(1.5);
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
    [1,1,1,1,1,1,1,0,ie[14]],
    [1,0,0,0,0,0,1,0,ie[13]],
    [1,0,1,1,1,0,1,0,ie[12]],
    [1,0,1,1,1,0,1,0,ie[11]],
    [1,0,1,1,1,0,1,0,ie[10]],
    [1,0,0,0,0,0,1,0,ie[9]],
    [1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,ie[8]],
    [ie[0], ie[1], ie[2], ie[3], ie[4], ie[5], ie[6], ie[7]],
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
    [ie[7], ie[8], ie[9], ie[10], ie[11], ie[12], ie[13], ie[14]],
])
insert(matrix, [size-8, 0], [
    [0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,ie[6]],
    [1,0,0,0,0,0,1,0,ie[5]],
    [1,0,1,1,1,0,1,0,ie[4]],
    [1,0,1,1,1,0,1,0,ie[3]],
    [1,0,1,1,1,0,1,0,ie[2]],
    [1,0,0,0,0,0,1,0,ie[1]],
    [1,1,1,1,1,1,1,0,ie[0]],
])

for(let i=7;i<size-7;i++){
    matrix[i][6] = (i+1)%2;
    reserved.push(i*size+6);
}

for(let j=7;j<size-7;j++){
    matrix[6][j] = (j+1)%2;
    reserved.push(6*size+j);
}

insert(matrix, [size-9, size-9], [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
]);

function reverse(number, mask) {
    if(mask) return (number+1)%2;
    else return number;
}

for(let line=(size-1)/2;line>0;line--){
    for(let col=size-1;col>=0;col--){
        let x = line < 4 ? line*2-1 : line*2;
        const y = line%2 === 0 ? col : size-col-1;
        const mask_reverse = !Boolean(y%2);
        if(!reserved.includes(y*size+x)){
            if(final_message_array.length) matrix[y][x] = reverse(parseInt(final_message_array.shift()), mask_reverse);
            else matrix[y][x] = reverse(0, mask_reverse);
        }
        x -= 1;
        if(!reserved.includes(y*size+x)){
            if(final_message_array.length) matrix[y][x] = reverse(parseInt(final_message_array.shift()), mask_reverse);
            else matrix[y][x] = reverse(0, mask_reverse);
        }
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
