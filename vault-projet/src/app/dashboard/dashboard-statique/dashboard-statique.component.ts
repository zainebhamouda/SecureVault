import { Component, OnInit } from '@angular/core';
import { registerables, Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { VaultService } from '../../services/vault.service';
import { HistoryService } from '../../services/history.service';
@Component({
  selector: 'app-dashboard-statique',
  templateUrl: './dashboard-statique.component.html',
  styleUrls: ['./dashboard-statique.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardStatiqueComponent implements OnInit {
scrollToHistory() {
  const historySection = document.querySelector('.activity-card');
  if (historySection) {
    historySection.scrollIntoView({ behavior: 'smooth' });
  }
}



  storageUsed = 2;
  storageTotal = 5;
  totalItems = 128;
  activeUsers = 12;
  totalOrgs = 4;

  // Exemple d'historique (déjà dans ton component)
  itemHistory = [
    { createdAt: '2025-08-21', orgName: 'Finance Org', itemTitle: 'MasterCard', userName: 'Ali', actionType: 'Created' },
    { createdAt: '2025-08-20', orgName: 'DevOps Org', itemTitle: 'SSH Key', userName: 'Sara', actionType: 'Updated' },
    { createdAt: '2025-08-19', orgName: 'Marketing Org', itemTitle: 'Gmail Login', userName: 'Zaineb', actionType: 'Deleted' }
];
 // dans DashboardStatiqueComponent
getActionClass(action: string): string {
  switch(action) {
    case 'Created': return 'Created';
    case 'Updated': return 'Updated';
    case 'Deleted': return 'Deleted';
    default: return '';
  }
}


  private storageChart?: Chart<'doughnut', number[], string>;
  private itemsChart?: Chart<'bar', number[], string>;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.initCharts();
  }

  initCharts() {
    // --- Doughnut Chart ---
    this.storageChart = new Chart<'doughnut', number[], string>('storageChart', {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Free'],
        datasets: [{
          data: [this.storageUsed, this.storageTotal - this.storageUsed],
          backgroundColor: ['rgba(3, 62, 179, 1)', 'rgba(164, 169, 177, 0.3)'],
          hoverOffset: 15,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // ✅ options Doughnut
        animation: { duration: 1400, easing: 'easeOutCubic' },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 15, padding: 15, font: { size: 14 } }
          },
          datalabels: {
            color: '#1e293b',
            font: { weight: 'bold' as const, size: 16 },
            formatter: (value, ctx) => {
              const dataset = ctx.chart.data.datasets[0].data as number[];
              const total = dataset.reduce((sum, val) => sum + (val ?? 0), 0);
              return total ? Math.round((value ?? 0) / total * 100) + '%' : '';
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed} GB`
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });

    // --- Bar Chart ---
    const createBarGradient = (ctx: any) => {
      const chart = ctx.chart;
      const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
      gradient.addColorStop(0, 'rgba(3, 62, 179, 0.9)');
      gradient.addColorStop(1, 'rgba(63, 81, 181, 0.7)');
      return gradient;
    };

    this.itemsChart = new Chart<'bar', number[], string>('itemsChart', {
      type: 'bar',
      data: {
        labels: ['Login', 'Card', 'Note', 'Payment Card'],
        datasets: [{
          data: [50, 20, 40, 18],
          backgroundColor: (ctx) => createBarGradient(ctx),
          borderRadius: 12,
          maxBarThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#1e293b',
            font: { weight: 'bold' as const, size: 13 }
          },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
  y: {
    beginAtZero: true,
    ticks: { stepSize: 10, font: { weight: 'bold' as const } },
    grid: {
      color: '#e5e7eb',
      borderDash: [5, 5] as unknown as number[] // ✅ cast pour TS
    } as any // ✅ cast complet pour éviter l'erreur TS
  },
  x: {
    ticks: { autoSkip: false, font: { weight: 'bold' as const, size: 13 } },
    grid: { display: false }
  }
}
,
        animation: { duration: 1600, easing: 'easeOutBounce' }
      },
      plugins: [ChartDataLabels]
    });
  }
}
