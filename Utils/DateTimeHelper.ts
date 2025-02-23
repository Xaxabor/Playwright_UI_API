const {DateTime} = require("luxon");
exports.DateTimeHelper = class DateTimeHelper {
    getMonthNumberFromNumber(monthName: string) {
        switch (monthName) {
            case 'January': return '01';
            case 'February': return '02';
            case 'March': return '03';
            case 'April': return '04';
            case 'May': return '05';
            case 'June': return '06';
            case 'July': return '07';
            case 'August': return '08';
            case 'September': return '09';
            case 'October': return '10';
            case 'November': return '11';
            case 'December': return '12';
            default: return '';
        }
    }

    getMonthShortNameFromNumber(monthNumber: string) {
        switch (monthNumber) {
            case '01' : return 'Jan';
            case '1' : return 'Jan';
            case '02': return 'Feb';
            case '2': return 'Feb';
            case '03': return 'Mar';
            case '3': return 'Mar';
            case '04': return 'Apr';
            case '4': return 'Apr';
            case '05': return 'May';
            case '5': return 'May';
            case '06': return 'Jun';
            case '6': return 'Jun';
            case '07': return 'Jul';
            case '7': return 'Jul';
            case '08': return 'Aug';
            case '8': return 'Aug';
            case '09': return 'Sep';
            case '9': return 'Sep';
            case '10': return 'Oct';
            case '11': return 'Nov';
            case '12': return 'Dec';
            default: return '';
        }
    }
    
    getMonthNameFromNumber(monthNumber: string){
        switch (monthNumber) {
            case '01': return 'January';
            case '02': return 'February';
            case '03': return 'March';
            case '04': return 'April';
            case '05': return 'May';
            case '06': return 'June';
            case '07': return 'July';
            case '08': return 'August';
            case '09': return 'September';
            case '1': return 'January';
            case '2': return 'February';
            case '3': return 'March';
            case '4': return 'April';
            case '5': return 'May';
            case '6': return 'June';
            case '7': return 'July';
            case '8': return 'August';
            case '9': return 'September';
            case '10': return 'October';
            case '11': return 'November';
            case '12': return 'December';
            default: return '';
        }
    }    
    
    getDayFromDate(date: string) {
        return (date.split('-')[1]).replace(/^0+/, '');
    }

    getMonthFromDate(date: string) {
        return date.split('-')[0];
    }

    getYearFromDate(date: string) {
        return date.split('-')[2];
    }

    getAmPmFromTime(time: string){
        return time.split(' ')[1];
    }

    getHourFromTime(time: string){
        return time.split(/:| /)[0];
    }

    getMinFromTime(time: string){
        return time.split(/:| /)[1];
    }

    getCurrentDate(format: string = "MM-dd-yyyy"){
        return DateTime.now().toFormat(format);
    }

    getFutureDateAfterAddingXdays(days: number=7, format: string = "MM-dd-yyyy"){
        return DateTime.now().plus({days}).toFormat(format);
    }

    addingXminWithTime(time: string, min: number =1){
        let splitedTime = time.split(/:| /);
        let addedMin = Number(splitedTime[1])+min;
        let newMin;
        if (addedMin < 10){
            newMin = `0${addedMin}`
        }
        else{
            newMin = `${addedMin}`
        }
        return `${splitedTime[0]}:${newMin} ${splitedTime[2]}`;
    }

    getDateInISOFormat(date: string, time: string){
        const datetime = `${date} ${time}`;
        const parsedDate = DateTime.fromFormat(datetime, "MM-dd-yyyy hh:mm a");
        const isoDate = parsedDate.toUTC().toISO();
        return isoDate;
    }
}
