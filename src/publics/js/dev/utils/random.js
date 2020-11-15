/**
 * This module deals with random values.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 14/11/2020
 * @version 1.0.0
 */

export default class Random{
    /**
     * Return random string based on chars
     * @param length
     * @param randomChars
     * @returns {string}
     */
    static string(
        length,
        randomChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    ) {
        let result = '';
        for(let i=0;i<length;i++){
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    /**
     * Generate randomized integer between min and max
     * @param min
     * @param max
     * @param count
     * @return {number|[]}
     */
    static randInt(min, max, count=1){
        if(count === 1) return Math.round(min+Math.random()*(max-min));
        let array = [];
        for(let i=0;i<count;i++){
            array.push(Random.randInt(min, max, 1));
        }
        return array;
    }
}
