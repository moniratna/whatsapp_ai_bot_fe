import type { Customer, CustomerPage, DashboardReport, DashboardSummary } from '@/lib/data';

export type ReviewTask = {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  status: string;
  reason: string;
  assignedTo: string | null;
  createdAt: string | null;
  latestCustomerMessage: string | null;
  requirements: Record<string, unknown>;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/dashboard/${path}`, { cache: 'no-store', ...init });
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
  reviewTasks: (status = 'OPEN', limit = 50) => request<{ items: ReviewTask[] }>(`review-tasks?status=${status}&limit=${limit}`),
  takeReviewTask: (id: string, assignedTo?: string) => request<{ status: string }>(`review-tasks/${encodeURIComponent(id)}/take`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ assigned_to: assignedTo || null }),
  }),
  sendHumanReply: (id: string, text: string) => request<{ status: string }>(`review-tasks/${encodeURIComponent(id)}/reply`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
  }),
  resumeAI: (id: string) => request<{ status: string }>(`review-tasks/${encodeURIComponent(id)}/resume-ai`, { method: 'POST' }),
};
