import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics, useProviderSearch } from "@/hooks/useProviders";
import { Building2, LogOut, BarChart3, Upload, List, Plus } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useEffect } from "react";
import ProvidersListTab from "@/components/admin/ProvidersListTab";
import UploadTab from "@/components/admin/UploadTab";
import StatisticsTab from "@/components/admin/StatisticsTab";
import CreateProviderTab from "@/components/admin/CreateProviderTab";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { tab } = useParams<{ tab?: string }>();
  const activeTab = tab || "list";

  const { data: stats } = useStatistics();
  const { data: providers } = useProviderSearch({ limit: 10 });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleTabChange = (value: string) => {
    setLocation(`/admin/${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600">Service Provider Management</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Providers</CardDescription>
                <CardTitle className="text-3xl">{stats.total.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Provinces</CardDescription>
                <CardTitle className="text-3xl">{stats.byProvince.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Specializations</CardDescription>
                <CardTitle className="text-3xl">{stats.bySpecialization.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Recent Providers</CardDescription>
                <CardTitle className="text-3xl">{providers?.data.length || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Excel
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ProvidersListTab />
          </TabsContent>

          <TabsContent value="create">
            <CreateProviderTab />
          </TabsContent>

          <TabsContent value="upload">
            <UploadTab />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

