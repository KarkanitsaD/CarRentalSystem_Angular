import { Injectable } from "@angular/core";

@Injectable()
export class CostCalculator {
    public getCost(keyHandOverTime: Date, keyReceivingTime: Date, pricePerDay: number): number {
        return this.countDays(keyHandOverTime, keyReceivingTime) * pricePerDay;
    }

    public countDays(keyHandOverTime: Date, keyReceivingTime: Date): number {
        return Math.ceil((new Date(keyHandOverTime).getTime() - new Date(keyReceivingTime).getTime())/(1000*60*60*24));
    }
}