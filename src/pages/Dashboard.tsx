
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assetService } from "@/services/assetService";
import { DashboardStats, Asset } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Database, Plus, ArrowRight } from "lucide-react";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardStats = await assetService.getDashboardStats();
        const assets = await assetService.getAssets();
        setStats(dashboardStats);
        
        // Get 5 most recent assets
        const sortedAssets = [...assets].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentAssets(sortedAssets.slice(0, 5));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading dashboard data",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Prepare data for pie chart
  const pieChartData = stats
    ? [
        { name: "Available", value: stats.availableAssets },
        { name: "In Use", value: stats.inUseAssets },
        { name: "Maintenance", value: stats.maintenanceAssets },
        { name: "Retired", value: stats.retiredAssets },
      ]
    : [];

  // Sample data for area chart (asset acquisition over time)
  const assetAcquisitionData = [
    { month: "Jan", assets: 5 },
    { month: "Feb", assets: 8 },
    { month: "Mar", assets: 12 },
    { month: "Apr", assets: 10 },
    { month: "May", assets: 15 },
    { month: "Jun", assets: 20 },
    { month: "Jul", assets: 25 },
    { month: "Aug", assets: 30 },
    { month: "Sep", assets: 35 },
    { month: "Oct", assets: 32 },
    { month: "Nov", assets: 40 },
    { month: "Dec", assets: 45 },
  ];

  // Sample data for bar chart (maintenance costs)
  const maintenanceCostData = [
    { month: "Jan", cost: 200 },
    { month: "Feb", cost: 300 },
    { month: "Mar", cost: 100 },
    { month: "Apr", cost: 500 },
    { month: "May", cost: 250 },
    { month: "Jun", cost: 320 },
  ];

  const StatusCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">assets</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/assets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Asset
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Total Assets" value={stats?.totalAssets || 0} color="#2563EB" />
        <StatusCard title="Available Assets" value={stats?.availableAssets || 0} color="#10B981" />
        <StatusCard title="In-Use Assets" value={stats?.inUseAssets || 0} color="#F59E0B" />
        <StatusCard title="Maintenance Required" value={stats?.maintenanceAssets || 0} color="#EF4444" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Asset Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Asset Acquisition Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={assetAcquisitionData}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="assets"
                  stroke="#2563EB"
                  fillOpacity={1}
                  fill="url(#colorAssets)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Assets</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/assets" className="flex items-center text-sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.length > 0 ? (
                recentAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.type} • {asset.serialNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'available' 
                          ? 'bg-success-light text-success'
                          : asset.status === 'in-use'
                          ? 'bg-warning-light text-warning' 
                          : asset.status === 'maintenance'
                          ? 'bg-danger-light text-danger'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/assets/${asset.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No assets found</p>
                  <Button variant="outline" className="mt-2" asChild>
                    <Link to="/assets/new">Add your first asset</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
