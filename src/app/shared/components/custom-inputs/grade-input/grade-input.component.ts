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
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => GradeInputComponent),
            multi: true
        }
    ]
})
export class GradeInputComponent implements ControlValueAccessor {
    
    @Input() countStarts: number = 5;
    grade: number = 0;

    onChange = (grade: number) => {};
    onTouched = () => {};

    disabled = false;
    touched = false;

    onGradeCancel(): void {
        this.grade = 0;
        this.onChange(this.grade);
    }

    onGradeSelected(grade: number): void {
        this.grade = grade;
        this.onChange(grade);
    }

    writeValue(obj: number): void {
        if(obj >= 0 && obj <= this.countStarts) {
            this.grade = obj;
            this.onChange(obj);
        } else {
            this.grade = 0;
        }
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
