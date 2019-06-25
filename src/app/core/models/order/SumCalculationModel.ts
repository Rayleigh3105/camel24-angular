import {CalculationModel} from "./calculation-model";

export class SumCalculationModel {
  calculatedFields: CalculationModel[];
  sum: number;

  constructor(sum: number) {
    this.sum = sum;
    this.calculatedFields = [];
  }
}
