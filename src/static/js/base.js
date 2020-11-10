class Cookie{
    //TODO exist
    constructor(name) {
        this.name = name
    }

    setCookie(cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = this.name + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie() {
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(this.name + "=") === 0) {
                return c.substring((this.name + "=").length, c.length);
            }
        }
        return "";
    }
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

class Welcome{
    constructor() {
        if(new Cookie('welcome').getCookie() === ""){
            document.getElementById('main').classList.add('blur-background')
            document.getElementById("welcome").style.display = "block";
        }
    }

    get_it(){
        document.getElementById('main').classList.remove('blur-background')
        document.getElementById("welcome").style.display = "None";

        let cookie = new Cookie("welcome")
        cookie.setCookie("true", 30);
    }
}

let welcome = new Welcome();