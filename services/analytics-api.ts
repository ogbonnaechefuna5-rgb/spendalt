import { apiRequest } from './api';

export type CategoryBreakdown = {
  category: string;
  count: number;
  total: number;
};

export type Insights = {
  total_spending: number;
  total_income: number;
  categories: { category: string; amount: number }[];
};

export type WeeklyTrend = {
  date: string;
  amount: number;
};

export type HealthInsight = {
  category: string;
  status: string;
  score: number;
  description: string;
};

export type HealthScore = {
  score: number;
  grade: string;
  percentile: number;
  insights: HealthInsight[];
  recommendations: string[];
};

export async function getInsights(): Promise<Insights> {
  const data = await apiRequest<{ insights: Insights }>('/analytics/insights');
  return data.insights;
}

export async function getWeeklyTrend(): Promise<WeeklyTrend[]> {
  const data = await apiRequest<{ trend: WeeklyTrend[] }>('/analytics/weekly-trend');
  return data.trend ?? [];
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  const data = await apiRequest<{ breakdown: CategoryBreakdown[] }>('/categories/breakdown');
  return data.breakdown ?? [];
}

export async function getHealthScore(): Promise<HealthScore> {
  const data = await apiRequest<{ health: HealthScore }>('/health/score');
  return data.health;
}
