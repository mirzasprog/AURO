export interface DashboardTrendPoint {
  date: string;
  label: string;
  value: number;
}

export interface DashboardKpi {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  trend: DashboardTrendPoint[];
}

export interface DashboardCategoryShare {
  category: string;
  share: number;
  amount: number;
}

export interface DashboardCategoryShareSummary {
  vipShare: number;
  categories: DashboardCategoryShare[];
}

export interface DashboardComparisonChart {
  currentLabel: string;
  previousLabel: string;
  current: DashboardTrendPoint[];
  previous: DashboardTrendPoint[];
}

export interface DashboardSummary {
  visitors: DashboardKpi;
  turnover: DashboardKpi;
  shrinkage: DashboardKpi;
  averageBasket: DashboardKpi;
  categoryShare: DashboardCategoryShareSummary;
  dayOnDay: DashboardComparisonChart;
  monthOnMonth: DashboardComparisonChart;
}
