import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

export class CheckBoxItem {
    value: any;
    label: string;
    checked: boolean;

    constructor(value: any, label: any, checked?: boolean) {
        this.value = value;
        this.label = label;
        this.checked = checked ? checked : false;
    }
}

@Component({
    selector: 'app-check-box-group',
    templateUrl: 'check-box-group.component.html',
    styleUrls: ['check-box-group.component.css']
}) export class CheckBoxGroupComponent implements OnInit {

    @Input() options = Array<CheckBoxItem>();
    @Output() toggle = new EventEmitter<any[]>();

    constructor() {}

    ngOnInit(): void {
        
    }

    onToggle() {
        const checkedOptions = this.options.filter(option => option.checked);
        this.toggle.emit(checkedOptions.map(option => option.value));
    }
}