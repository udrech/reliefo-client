import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';

import { StatisticService } from '@/services/statistic.service';

registerLocaleData(localeDeCH);

@Component({
  selector: 'app-statistics',
  imports: [
    ChartModule,
    TabsModule,
    TableModule,
    DecimalPipe,
  ],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Statistics {
  private readonly statisticService = inject(StatisticService);

  private readonly currentYear = new Date().getFullYear();

  private readonly monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  private readonly appointmentsPerMonth = toSignal(
    this.statisticService.getAppointmentsPerMonth(this.currentYear),
    { initialValue: [] }
  );

  private readonly appointmentsPerCustomer = toSignal(
    this.statisticService.getAppointmentsPerCustomer(this.currentYear),
    { initialValue: [] }
  );

  private readonly incomePerMonth = toSignal(
    this.statisticService.getIncomePerMonth(this.currentYear),
    { initialValue: [] }
  );

  private readonly incomePerCustomer = toSignal(
    this.statisticService.getIncomePerCustomer(this.currentYear),
    { initialValue: [] }
  );

  protected readonly appointmentsPerMonthData = computed(() => {
    const stats = this.appointmentsPerMonth();
    return {
      labels: stats.map(s => this.monthNames[s.month - 1]),
      datasets: [
        {
          label: 'Anzahl Massagen',
          data: stats.map(s => s.appointmentCount),
          backgroundColor: '#36A2EB',
          hoverBackgroundColor: '#2993DC',
        },
      ],
    };
  });

  protected readonly appointmentsPerMonthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  protected readonly appointmentsPerCustomerData = computed(() => {
    const stats = this.appointmentsPerCustomer();
    return {
      labels: stats.map(s => `${s.firstName} ${s.lastName} (${s.appointmentCount})`),
      datasets: [
        {
          data: stats.map(s => s.appointmentCount),
          backgroundColor: [
            '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#FF6384',
          ],
          hoverBackgroundColor: [
            '#2993DC', '#FF4F75', '#FFBF43', '#3BB1B1',
            '#8A57F0', '#FF9031', '#BABCC0', '#FF4F75',
          ],
        },
      ],
    };
  });

  protected readonly appointmentsPerCustomerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  protected readonly incomePerMonthData = computed(() => {
    return this.incomePerMonth().map(stat => ({
      month: this.monthNames[stat.month - 1],
      income: stat.income || 0,
    }));
  });

  protected readonly incomeTotal = computed(() => {
    return this.incomePerMonth().reduce((sum, stat) => sum + (stat.income || 0), 0);
  });

  protected readonly incomePerCustomerData = computed(() => {
    return this.incomePerCustomer()
      .map(stat => ({
        name: `${stat.firstName} ${stat.lastName}`,
        income: stat.income || 0,
      }))
      .sort((a, b) => b.income - a.income);
  });

  protected readonly incomePerCustomerTotal = computed(() => {
    return this.incomePerCustomer().reduce((sum, stat) => sum + (stat.income || 0), 0);
  });
}

