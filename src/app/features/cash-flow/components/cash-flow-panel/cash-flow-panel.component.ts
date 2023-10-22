import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CashFlow } from '#features/cash-flow/models';

@Component({
  selector: 'ctrl-cash-flow-panel',
  templateUrl: './cash-flow-panel.component.html',
  styleUrls: ['./cash-flow-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashFlowPanelComponent {
  @Input() public cashFlowData!: CashFlow[];
  @Input() public isIncomeMode!: boolean;
  @Input() public isLoading!: boolean;
  @Input() public totalCashFlowAmount = 0;

  @Output() public cashFlowToRemoveId: EventEmitter<string> = new EventEmitter<string>();
  @Output() public cashFlowToUpdate: EventEmitter<CashFlow> = new EventEmitter<CashFlow>();
  @Output() public cashFlowSubmitData: EventEmitter<CashFlow> = new EventEmitter<CashFlow>();

  public emitCashFlowSubmitData(cashFlowSubmitData: CashFlow): void {
    this.cashFlowSubmitData.emit(cashFlowSubmitData);
  }

  public emitCashFlowIdToRemove(cashFlowId: string): void {
    this.cashFlowToRemoveId.emit(cashFlowId);
  }

  public emitCashFlowToUpdate(cashFlow: CashFlow): void {
    this.cashFlowToUpdate.emit(cashFlow);
  }
}
