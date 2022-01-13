import { Component, forwardRef, Input, OnDestroy } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { Subscription } from "rxjs";


export interface RentalPointFormValues {
    title: string;
    country: string;
    city: string;
    address: string;
    locationX: number;
    locationY: number;
}

@Component({
    selector:'app-rental-point-form',
    templateUrl: 'rental-point-form.component.html',
    styleUrls: ['rental-point-form.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RentalPointFormComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RentalPointFormComponent),
            multi: true
        }
    ]
})
export class RentalPointFormComponent implements ControlValueAccessor, OnDestroy {

    @Input() titleDisabled!: boolean;
    @Input() countryDisabled!: boolean;
    @Input() cityDisabled!: boolean;
    @Input() addressDisabled!: boolean;

    get titleControl(): AbstractControl {
        return this.form.controls.title;
    }

    get countryControl(): AbstractControl {
        return this.form.controls.country;
    }

    get cityControl(): AbstractControl {
        return this.form.controls.city;
    }

    get addressControl(): AbstractControl {
        return this.form.controls.address;
    }

    get locationXControl(): AbstractControl {
        return this.form.controls.locationX;
    }

    get locationYControl(): AbstractControl {
        return this.form.controls.locationY;
    }

    get value(): RentalPointFormValues {
        return this.form.value;
    }

    set value(value: RentalPointFormValues) {
        this.form.setValue(value);
        this.onChange(value);
        this.onTouched();
    }

    onChange: any = () => {};
    onTouched: any = () => {};

    subscriptions: Subscription[] = [];

    form: FormGroup = this.formBuilder.group({
        title: [, [Validators.required]],
        country: [, [Validators.required]],
        city: [, [Validators.required]],
        address: [, [Validators.required]],
        locationX: [, [Validators.required]],
        locationY: [, [Validators.required]]
    });

    constructor
    (
        private formBuilder: FormBuilder
    ) {
        this.subscriptions.push(
            this.form.valueChanges.subscribe(value => {
                    this.onChange(value);
                    this.onTouched();
            })
        )
    }

    writeValue(obj: RentalPointFormValues): void {
        if(obj) {
            this.value = obj;
        } else {
            this.form.reset();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    validate(_: FormControl) {
        return this.form.valid ? null : { rentalPoint: { valid: false } };
    }
}