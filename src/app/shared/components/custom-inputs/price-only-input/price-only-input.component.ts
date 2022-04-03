import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const priceRegulaExpression = '^(\\d+\\.?\\d{0,2})$';

@Component({
    selector: 'app-price-only-input',
    templateUrl: 'price-only-input.component.html',
    styleUrls: ['price-only-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PriceOnlyComponent),
            multi: true
        }
    ]
})
export class PriceOnlyComponent implements ControlValueAccessor, OnInit {

    valueToDisplay: string = '';
    @Input() initialValue: number | null = null;
    onChange!: (value: number | null) => void;
    onTouched!: () => void;

    @Input()
    disabled: boolean = false;
    @Input()
    placeholder: string = '';

    ngOnInit(): void {
        if(this.initialValue) {
            this.valueToDisplay = this.initialValue.toFixed(2);
        }
    }

    writeValue(obj: number | null): void {
        if(obj) {
            this.valueToDisplay = obj.toFixed(2);
        } else {
            this.valueToDisplay = '';
        }
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

    onKeyPress(event: KeyboardEvent): void {
        let value = (event.target as HTMLInputElement).value + event.key;
        let matches = value.match(priceRegulaExpression); 
        if(matches) {
            this.valueToDisplay = value;
            let valueToReturn = Number(value);
            this.onChange(valueToReturn);
            this.onTouched();
        }
        event.preventDefault();
    }

    onKeyUp(event: KeyboardEvent): void {
        if(event.key === 'Backspace' || event.key === 'Delete') {
            let value = (event.target as HTMLInputElement).value;
            if(value) {                
                this.onChange(Number(value));
            }
            else {
                this.onChange(null);
            }
            this.onTouched();
        }
    }
}