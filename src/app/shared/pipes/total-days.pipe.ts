import { Pipe, PipeTransform } from "@angular/core";
import { CostCalculator } from "../services/cost-calculator.service";

@Pipe({
    name: 'totalDays'
})
export class TotalDaysPipe implements PipeTransform {
    constructor(private costCalculator: CostCalculator) {}

    transform(keyHandOverTime: Date, keyReceivingTime: Date) {
        return this.costCalculator.countDays(keyHandOverTime, keyReceivingTime);
    }
}