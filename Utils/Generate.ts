exports.Generate = class Generate{

    getRandomNumber(min, max){
        return String(Math.floor(Math.random()*(max-min+1)+min));
    }

    generateRandomString(len: number=8){
        let text='';
        let choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for(let i=0; i<len; i++){
            text += choices.charAt(Math.floor(Math.random()*26));
        }
        return text;
    }
}