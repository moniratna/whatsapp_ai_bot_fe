import type { Customer, CustomerPage, DashboardReport, DashboardSummary } from '@/lib/data';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`/api/dashboard/${path}`, { cache: 'no-store' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail ?? `Dashboard request failed (${response.status})`);
  return payload as T;
}

export const dashboardApi = {
  summary: (days = 30) => request<DashboardSummary>(`summary?days=${days}`),
  reports: (days = 30) => request<DashboardReport>(`reports?days=${days}`),
  customers: (params: { q?: string; intent?: string; skip?: number; limit?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.q) search.set('q', params.q);
    if (params.intent && params.intent !== 'all') search.set('intent', params.intent);
    search.set('skip', String(params.skip ?? 0));
    search.set('limit', String(params.limit ?? 25));
    return request<CustomerPage>(`customers?${search.toString()}`);
  },
  customer: (id: string) => request<Customer>(`customers/${encodeURIComponent(id)}`),
};
