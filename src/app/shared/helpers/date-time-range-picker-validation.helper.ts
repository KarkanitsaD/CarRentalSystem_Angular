import { Injectable } from "@angular/core";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class DateTimeRangePickerValidationHelper {
    constructor() {

    }

    public addMinutesAndHoursInputValidators(): void {
        setTimeout(() => {
            let elements = document.getElementsByClassName("owl-dt-timer-input");
            let hoursInput = elements[0] as HTMLInputElement;
            let minutesInput = elements[1] as HTMLInputElement;
            
            fromEvent(hoursInput, 'keypress').pipe(map(event => event as KeyboardEvent)).subscribe(event => {
                this.handleHoursKeyPress(event);
            }); // hoursInput.addEventListener('keypress', this.handleHoursKeyPress);

            fromEvent(minutesInput, 'keypress').pipe(map(event => event as KeyboardEvent)).subscribe(event => {
                this.handleMinutesKeyPress(event);
            }); // minutesInput.addEventListener('keypress', this.handleMinutesKeyPress);
        } , 0)
    }

    private handleHoursKeyPress(event: KeyboardEvent): void {
        let target = event.target as HTMLInputElement;
        let newValue = target.value + event.key;
        let numberValue = Number(newValue);
        if(!(numberValue >= 0 && numberValue <= 23))
            event.preventDefault();
    }

    private handleMinutesKeyPress(event: KeyboardEvent): void {
        let target = event.target as HTMLInputElement;
        let newValue = target.value + event.key;
        let numberValue = Number(newValue);
        if(!(numberValue >= 0 && numberValue <= 59))
            event.preventDefault();
    }
}