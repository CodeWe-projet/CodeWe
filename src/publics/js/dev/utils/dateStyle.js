export default class DateStyle{
    static full(){
        const now = new Date();
        return `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }

    static day(){
        const now = new Date();
        return `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`;
    }
}
