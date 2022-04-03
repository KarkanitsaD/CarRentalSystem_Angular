import { Component, forwardRef, Input, OnDestroy } from "@angular/core";
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-grade-input',
    templateUrl: 'grade-input.component.html',
    styleUrls: ['grade-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GradeInputComponent),
            multi: true
        },
        // {
        //     provide: NG_VALIDATORS,
        //     useExisting: forwardRef(() => GradeInputComponent),
        //     multi: true
        // }
    ]
})
export class GradeInputComponent implements ControlValueAccessor {
    
    @Input() countStarts: number = 5;
    @Input() grade: number = 0;

    @Input() disabled = false;

    onChange!: (value: number | null) => void;
    onTouched = () => {};

    touched = false;

    onGradeCancel(): void {
        if(!this.disabled) {
            this.grade = 0;
            this.onChange(null);
            this.onTouched();
        }
    }

    onGradeSelected(grade: number): void {
        if(!this.disabled) {
            this.grade = grade;
            this.onChange(grade);
            this.onTouched();
        }
    }

    writeValue(obj: number): void {
        this.grade = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;   
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    getArray() {
        return Array.from(Array(this.countStarts).keys());
    }
}
