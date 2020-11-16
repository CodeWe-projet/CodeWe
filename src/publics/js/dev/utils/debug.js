/**
 * This module deals with debugging.
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 2.0.0
 */
import Config from "/js/dev/config.js";
import DateStyle from "/js/dev/utils/dateStyle.js";
import Stack from "/js/dev/utils/stack.js";

/**
 * Different level of debugging
 */
class DebugLevel{
    constructor(name, verbosity, ...fct) {
        this.name = name;
        this.verbosity = verbosity;
        this.fcts = fct;
    }
}

/**
 * The different levels of debugging
 * @type {{}}
 */
export const LEVEL = {
    DEBUG: new DebugLevel('DEBUG', 6, console.debug),
    INFO : new DebugLevel('INFO', 5, console.info),
    LOG: new DebugLevel('LOG', 4, console.log),
    WARN: new DebugLevel('WARN', 3, console.warn),
    ERROR: new DebugLevel('ERROR', 2, console.error),
    CRITICAL: new DebugLevel('CRITICAL', 1, console.error)
}

/*
class Track{
    constructor(date, level, where, data) {
        this.date = date;
        this.level = level;
        this.where = where;
        this.data = data;
    }
}*/

const _site = window.location.origin;
const history = new Stack(1000);

/**
 * Manage classic debugging
 */
export default class Debug{

    /**
     * Check if debugging is on
     * @return {boolean}
     */
    static has(){
        return Config.isDebug();
    }

    /**
     * Set a new debug entry
     * @param {DebugLevel} level
     * @param {Error} e
     * @param {*} data
     */
    static entry(level, e, ...data){
        let where = null
        if(e && e.stack) where = e.stack.toString().split(/\r\n|\n/)[1].replace(_site, '');

        const date = DateStyle.full();

        history.push([date, level, where, data]);
        if(Debug.has() || level.verbosity <= 2){
            for(const fct of level.fcts){
                fct(`${date} - ${level.name} - ${where} - `, ...data);
            }
        }
    }

    static debug(...data){
        Debug.entry(LEVEL.DEBUG, new Error(), ...data);
    }

    static info(...data){
        Debug.entry(LEVEL.INFO, new Error(), ...data);
    }

    static log(...data){
        Debug.entry(LEVEL.LOG, new Error(), ...data);
    }

    static warn(...data){
        Debug.entry(LEVEL.WARN, new Error(), ...data);
    }

    static error(...data){
        Debug.entry(LEVEL.ERROR, new Error(), ...data);
    }

    static critical(...data){
        Debug.entry(LEVEL.CRITICAL, new Error(), ...data);
    }
}
