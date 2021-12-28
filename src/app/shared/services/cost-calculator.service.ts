import { Injectable } from "@angular/core";

@Injectable()
export class CostCalculator {
    public getCost(keyHandOverTime: Date, keyReceivingTime: Date, pricePerDay: number): number {
        return this.countDays(keyHandOverTime, keyReceivingTime) * pricePerDay;
    }

    public countDays(keyHandOverTime: Date, keyReceivingTime: Date): number {
        return Math.ceil((keyHandOverTime.getTime() - keyReceivingTime.getTime())/(1000*60*60*24));
    }
}