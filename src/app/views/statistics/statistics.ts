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

  private readonly stats = toSignal(
    this.statisticService.getAppointmentsPerCustomer(this.currentYear),
    { initialValue: [] }
  );

  protected readonly chartData = computed(() => {
    const stats = this.stats();
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

  protected readonly chartOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
}

