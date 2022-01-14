import { Pipe, PipeTransform } from "@angular/core";
import { CostCalculator } from "../services/cost-calculator.service";

@Pipe({
    name: 'totalPrice'
})
export class TotalPricePipe implements PipeTransform {

    constructor(private constCalculator: CostCalculator) {}

    transform(keyHandOverTime: Date, keyReceivingTime: Date, pricePerDay: number) {
        return this.constCalculator.getCost(keyHandOverTime, keyReceivingTime, pricePerDay);
    }
}