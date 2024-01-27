import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ChartData } from 'chart.js';
import { Observable, combineLatest, map, tap } from 'rxjs';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthSelectors } from '#auth/store';
import { CashFlow, Category } from '#cash-flow/models';
import { CashFlowSelectors } from '#cash-flow/store';
import { BaseDialogStyles } from '#core/constants';
import { AppPaths } from '#core/enums';
import { LabeledData } from '#core/models';
import { getRandomNumber } from '#core/utils';
import { DashobardPaths } from '#dashboard/enums';
import { ChartColor, TaskerData } from '#overview/models';
import { NoteFormComponent } from '#tasker/components';
import { Note } from '#tasker/models';
import { TaskerService } from '#tasker/services';
import { TaskerActions, TaskerSelectors } from '#tasker/store';

@Injectable()
export class OverviewService {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly taskerService = inject(TaskerService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);

  get isLoading$(): Observable<boolean> {
    return this.store.select(CashFlowSelectors.isLoading);
  }

  get incomesChartData$(): Observable<ChartData | undefined> {
    return combineLatest({
      incomes: this.store.select(CashFlowSelectors.incomes),
      categories: this.store.select(AuthSelectors.categories),
    }).pipe(map(({ incomes, categories }) => this.generateCashFlowChartData(incomes, categories.incomes, 'green')));
  }

  get expensesChartData$(): Observable<ChartData | undefined> {
    return combineLatest({
      expenses: this.store.select(CashFlowSelectors.expenses),
      categories: this.store.select(AuthSelectors.categories),
    }).pipe(map(({ expenses, categories }) => this.generateCashFlowChartData(expenses, categories.expenses, 'pink')));
  }

  get taskerData$(): Observable<TaskerData> {
    return combineLatest({
      tasks: this.store.select(TaskerSelectors.tasks),
      notes: this.store.select(TaskerSelectors.notes),
    }).pipe(
      map(({ tasks, notes }) => ({
        totalTasksLength: tasks?.length,
        completedTasksLength: tasks?.filter(({ isComplete }) => isComplete).length,
        notesLength: notes?.length,
      }))
    );
  }

  get cashFlowData$(): Observable<LabeledData<number>[]> {
    return combineLatest({
      totalBalance: this.totalBalance$,
      totalIncome: this.store.select(CashFlowSelectors.totalIncomes),
      totalExpense: this.store.select(CashFlowSelectors.totalExpenses),
      transactionAmount: this.transactionAmount$,
    }).pipe(
      map((data) => [
        { label: 'totalIncome', data: data.totalIncome },
        { label: 'totalExpense', data: data.totalExpense },
        { label: 'totalBalance', data: data.totalBalance },
        { label: 'transactionAmount', data: data.transactionAmount },
      ])
    );
  }

  addQuickNote$(): Observable<Note | undefined> {
    const dialogRef: DynamicDialogRef = this.dialogService.open(NoteFormComponent, {
      header: this.translateService.instant('tasker.addNote'),
      style: BaseDialogStyles,
    });

    return dialogRef.onClose.pipe(
      tap((note?: Note) => {
        if (note) {
          this.store.dispatch(TaskerActions.addNote({ note }));
          this.taskerService.setActiveTabIndex(1);
          void this.router.navigate([AppPaths.DASHBOARD, DashobardPaths.TASKER]);
        }
      })
    );
  }

  private get totalBalance$(): Observable<number> {
    return combineLatest({
      totalIncomes: this.store.select(CashFlowSelectors.totalIncomes),
      totalExpenses: this.store.select(CashFlowSelectors.totalExpenses),
    }).pipe(map(({ totalIncomes, totalExpenses }) => totalIncomes - totalExpenses));
  }

  private get transactionAmount$(): Observable<number> {
    return combineLatest({
      incomesLength: this.store.select(CashFlowSelectors.incomes).pipe(map((incomes) => incomes.length)),
      expensesLength: this.store.select(CashFlowSelectors.expenses).pipe(map((expenses) => expenses.length)),
    }).pipe(map(({ incomesLength, expensesLength }): number => incomesLength + expensesLength));
  }

  private generateCashFlowChartData(
    cashFlowList: CashFlow[],
    categories: Category[],
    chartColorPalette: ChartColor
  ): ChartData | undefined {
    if (!cashFlowList.length) return undefined;

    const data: number[] = this.calculateCashflow(cashFlowList, categories);
    const { backgroundColor, hoverBackgroundColor } = this.generateBgColors(data.length, chartColorPalette);

    return {
      labels: categories.map(({ name }: Category) => name),
      datasets: [{ data, backgroundColor, hoverBackgroundColor }],
    };
  }

  private calculateCashflow(cashFlowList: CashFlow[], categories: Category[]): number[] {
    return categories.map((category: Category) => {
      return cashFlowList.reduce((total: number, cashFlow: CashFlow) => {
        return cashFlow.categoryId === category.id ? total + cashFlow.amount : total;
      }, 0);
    });
  }

  private generateBgColors(amountOfColors: number, color: ChartColor) {
    const getClr = (clr: string): string => {
      return getComputedStyle(document.documentElement).getPropertyValue(clr);
    };

    return {
      backgroundColor: Array.from({ length: amountOfColors }, () => {
        const colorScale = getRandomNumber(4, 9);
        return getClr(`--${color}-${colorScale}00`);
      }),
      hoverBackgroundColor: Array.from({ length: amountOfColors }, () => {
        const colorScale = getRandomNumber(4, 9);
        return getClr(`--${color}-${colorScale - 2}00`);
      }),
    };
  }
}
