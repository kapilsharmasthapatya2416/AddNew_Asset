import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Table } from '@/components/common';
import { TableColumn } from '@/types/common.types';

/**
 * Dashboard Page - Server Component with SSR
 * Fetches data server-side and renders on the server
 */

interface DashboardData {
  id: string;
  route: string;
  status: 'Active' | 'Delayed' | 'Completed';
  vehicles: number;
  lastUpdate: string;
}

// Simulated server-side data fetch
async function getDashboardData(): Promise<DashboardData[]> {
  // In a real application, this would be an API call
  // For now, we return mock data
  return [
    {
      id: '1',
      route: 'North Route A',
      status: 'Active',
      vehicles: 12,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: '2',
      route: 'South Route B',
      status: 'Delayed',
      vehicles: 8,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: '3',
      route: 'East Route C',
      status: 'Active',
      vehicles: 15,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: '4',
      route: 'West Route D',
      status: 'Completed',
      vehicles: 10,
      lastUpdate: new Date().toISOString(),
    },
  ];
}

export default async function DashboardPage() {
  // Server-side data fetching
  const dashboardData = await getDashboardData();

  const columns: TableColumn<DashboardData>[] = [
    { key: 'route', label: 'Route' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : value === 'Delayed'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: 'vehicles', label: 'Vehicles' },
    {
      key: 'lastUpdate',
      label: 'Last Update',
      render: (value: string) => new Date(value).toLocaleTimeString(),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of operations and real-time status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Total Routes</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.length}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Active Vehicles</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.reduce((sum, item) => sum + item.vehicles, 0)}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Active Routes</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {dashboardData.filter((item) => item.status === 'Active').length}
            </div>
          </Card>
          <Card variant="elevated" padding="md">
            <div className="text-sm text-gray-600">Delayed</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">
              {dashboardData.filter((item) => item.status === 'Delayed').length}
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <Card variant="bordered" padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table data={dashboardData} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
