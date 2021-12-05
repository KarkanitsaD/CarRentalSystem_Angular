import { Injectable } from "@angular/core";

@Injectable()
export class DateFormatter {
    getTimeString(inputDate: Date){
        let date = new Date(inputDate);
        return this.getDateElement(date.getDay())
        + ':'
        + this.getDateElement(date.getMonth())
        +':'
        + this.getDateElement(date.getFullYear())
        + ', '
        + this.getDateElement(date.getHours())
        + ':'
        + this.getDateElement(date.getMinutes());
    }

    getDateElement(element: number){
        return element.toString().length > 1 ? element.toString() : '0' + element.toString();
    }
}