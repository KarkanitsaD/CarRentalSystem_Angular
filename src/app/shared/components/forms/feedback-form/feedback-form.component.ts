import { Component, Input, OnDestroy } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

export interface FeedbackFormValues {
    comment: string;
    rating: string;
}

@Component({
    selector: 'app-feedback-form',
    templateUrl: 'feedback-form.component.html',
    styleUrls: ['feedback-form.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FeedBackFormComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: FeedBackFormComponent,
            multi: true
        }
    ]
})
export class FeedBackFormComponent implements ControlValueAccessor, OnDestroy {

    @Input()
    enable: boolean = false;

    onChange: any = () => {};
    onTouched: any = () => {};

    subscriptions: Subscription[] = [];

    form: FormGroup = this.formBuilder.group({
        rating: [, Validators.required],
        comment: [, [Validators.required, Validators.minLength(20)]]
    });

    get commentControl(): AbstractControl {
        return this.form.controls.comment;
    }

    get ratingControl(): AbstractControl {
        return this.form.controls.rating;
    }

    get value(): FeedbackFormValues {
        return this.form.value as FeedbackFormValues;
    }

    set value(value: FeedbackFormValues) {
        this.form.setValue(value);
        this.onChange(value);
        this.onTouched();
    }

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

    writeValue(obj: FeedbackFormValues): void {
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
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    validate(_: FormControl) {
        return this.form.valid ? null : { feedback: { valid: false } };
    }
}