import { CommonModule } from '@angular/common';
import { NgModule, Provider } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';

import { CashFlowComponent, CashFlowRoutingModule } from '#cash-flow/.';
import {
  AddFormComponent,
  DetailsComponent,
  DetailsBoxComponent,
  DetailsListComponent,
  HeadingComponent,
  PanelComponent,
  UpdateFormComponent,
} from '#cash-flow/components';
import { CashFlowFacade } from '#cash-flow/data-access';
import { CategoryLabelPipe, IconPipe } from '#cash-flow/pipes';
import { TimestampPipe } from '#shared/pipes';

const declarations = [
  DetailsComponent,
  DetailsBoxComponent,
  DetailsListComponent,
  AddFormComponent,
  HeadingComponent,
  PanelComponent,
  UpdateFormComponent,
  CashFlowComponent,
];
const imports = [
  CashFlowRoutingModule,
  CommonModule,
  CardModule,
  InputTextareaModule,
  InputTextModule,
  InputNumberModule,
  TranslateModule,
  DropdownModule,
  CalendarModule,
  ReactiveFormsModule,
  DataViewModule,
  ProgressSpinnerModule,
  DividerModule,
  IconPipe,
  CategoryLabelPipe,
  TabViewModule,
  TimestampPipe,
];
const providers: Provider[] = [CashFlowFacade];

@NgModule({ declarations, imports, providers })
export default class CashFlowModule {}
