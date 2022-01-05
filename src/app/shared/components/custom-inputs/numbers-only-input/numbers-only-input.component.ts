import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-numbers-only-input',
    templateUrl: 'numbers-only-input.component.html',
    styleUrls: ['numbers-only-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumbersOnlyInputComponent),
            multi: true
        }
    ]
})
export class NumbersOnlyInputComponent implements ControlValueAccessor {

    value!: number;
    onChange!: (value: number) => void;
    onTouched!: () => void;

    @Input()
    disabled: boolean = false;
    @Input()
    placeholder: string = '';

    constructor() {}

    writeValue(obj: number): void {
        this.value = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onKeyUp(event: KeyboardEvent) {
        if(!(event.key >= "0" && event.key <= "9"))
            event.preventDefault();
        else {
            debugger
            let value = (event.target as HTMLInputElement).value + event.key;
            this.value = Number(value);
            this.onChange(this.value);
            this.onTouched();
        }
    }
}