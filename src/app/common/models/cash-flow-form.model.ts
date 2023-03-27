import { FormControl } from '@angular/forms';

export interface CashFlowForm {
  name: FormControl<string>;
  amount: FormControl<0>;
  date: FormControl<Date | null>;
  categoryCode: FormControl<number>;
  description: FormControl<string>;
}
