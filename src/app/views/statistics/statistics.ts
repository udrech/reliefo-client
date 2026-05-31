import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { TabsModule } from 'primeng/tabs';

import { StatisticService } from '@/services/statistic.service';

@Component({
  selector: 'app-statistics',
  imports: [
    ChartModule,
    TabsModule,
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
}

