// chart-utils.ts - Helper file za Chart.js v2.7.1
// Kompatibilan sa starijim verzijama Chart.js

import * as Chart from 'chart.js';

export class ChartUtils {
  
  /**
   * Kreira pie/doughnut chart za distribuciju po kategorijama
   */
  static createCategoryChart(canvasId: string, labels: string[], values: number[], colors: string[]): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas element '${canvasId}' not found`);
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn(`Could not get 2D context for canvas '${canvasId}'`);
      return null;
    }

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverBorderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontColor: 'rgba(255, 255, 255, 0.9)',
            padding: 15,
            fontSize: 12,
            fontStyle: '600',
            usePointStyle: true
          }
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          cornerRadius: 8,
          titleFontSize: 14,
          titleFontStyle: 'bold',
          bodyFontSize: 13,
          xPadding: 12,
          yPadding: 12,
          callbacks: {
            label: function(tooltipItem: any, data: any) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
              const currentValue = dataset.data[tooltipItem.index];
              const percentage = ((currentValue / total) * 100).toFixed(1);
              const label = data.labels[tooltipItem.index];
              return `${label}: ${currentValue} (${percentage}%)`;
            }
          }
        }
      }
    } as any);
  }

  /**
   * Kreira bar chart za distribuciju po statusu
   */
  static createStatusChart(canvasId: string, labels: string[], values: number[], colors: string[]): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas element '${canvasId}' not found`);
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn(`Could not get 2D context for canvas '${canvasId}'`);
      return null;
    }

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Broj sredstava',
          data: values,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          cornerRadius: 8,
          titleFontSize: 14,
          titleFontStyle: 'bold',
          bodyFontSize: 13,
          xPadding: 12,
          yPadding: 12
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              fontSize: 11,
              fontStyle: '600'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: 'rgba(255, 255, 255, 0.7)',
              fontSize: 11,
              stepSize: 1
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1
            }
          }]
        }
      }
    } as any);
  }

  /**
   * Kreira horizontal bar chart za vrijednost po kategorijama
   */
  static createValueChart(canvasId: string, labels: string[], values: number[], colors: string[]): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas element '${canvasId}' not found`);
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn(`Could not get 2D context for canvas '${canvasId}'`);
      return null;
    }

    return new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vrijednost (KM)',
          data: values,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          cornerRadius: 8,
          titleFontSize: 14,
          titleFontStyle: 'bold',
          bodyFontSize: 13,
          xPadding: 12,
          yPadding: 12,
          callbacks: {
            label: function(tooltipItem: any) {
              const value = tooltipItem.xLabel || 0;
              return `Vrijednost: ${Number(value).toLocaleString('hr-HR', { minimumFractionDigits: 2 })} KM`;
            }
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: 'rgba(255, 255, 255, 0.7)',
              fontSize: 11,
              callback: function(value: any) {
                return Number(value).toLocaleString('hr-HR') + ' KM';
              }
            },
            gridLines: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.7)',
              fontSize: 11,
              fontStyle: '600'
            }
          }]
        }
      }
    } as any);
  }

  /**
   * Uništi postojeći chart ako postoji
   */
  static destroyChart(chart: Chart | null): void {
    if (chart) {
      try {
        chart.destroy();
      } catch (error) {
        console.warn('Error destroying chart:', error);
      }
    }
  }
}