import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatistics } from "@/hooks/useProviders";
import { BarChart3, MapPin, Stethoscope } from "lucide-react";

export default function StatisticsTab() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          No statistics available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overview
          </CardTitle>
          <CardDescription>
            Total providers and distribution across Egypt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Providers</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Provinces</p>
              <p className="text-3xl font-bold text-green-600">{stats.byProvince.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Specializations</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.bySpecialization.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Provinces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Top Provinces
          </CardTitle>
          <CardDescription>
            Provinces with the most service providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.byProvince.slice(0, 10).map((item, index) => (
              <div key={item.province} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{item.province}</span>
                    <span className="text-sm text-gray-600">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Specializations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Top Specializations
          </CardTitle>
          <CardDescription>
            Most common medical specializations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.bySpecialization.slice(0, 10).map((item, index) => (
              <div key={item.specialization} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-semibold text-purple-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{item.specialization}</span>
                    <span className="text-sm text-gray-600">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

