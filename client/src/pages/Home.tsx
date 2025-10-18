import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderSearch, useFilterOptions, useStatistics } from "@/hooks/useProviders";
import { useState, useMemo } from "react";
import { Search, MapPin, Building2, Stethoscope, Phone, ChevronLeft, ChevronRight, BarChart3, Lock } from "lucide-react";
import { Link } from "wouter";
import type { SearchParams } from "@/lib/api";

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    limit: 20,
  });

  const { data: searchResults, isLoading: isSearching } = useProviderSearch(searchParams);
  const { data: filters, isLoading: isLoadingFilters } = useFilterOptions();
  const { data: stats } = useStatistics();

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, q: value || undefined, page: 1 }));
  };

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchParams.q) count++;
    if (searchParams.province) count++;
    if (searchParams.city) count++;
    if (searchParams.specialization) count++;
    if (searchParams.providerType) count++;
    return count;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Provider Search</h1>
                <p className="text-sm text-gray-600">Healthcare providers across Egypt</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Providers</CardDescription>
                <CardTitle className="text-3xl">{stats.total.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Provinces Covered</CardDescription>
                <CardTitle className="text-3xl">{stats.byProvince.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Specializations</CardDescription>
                <CardTitle className="text-3xl">{stats.bySpecialization.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Service Providers
            </CardTitle>
            <CardDescription>
              Find healthcare providers by name, specialization, or location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by provider name, specialization, services..."
                className="pl-10"
                defaultValue={searchParams.q || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                value={searchParams.province || "all"}
                onValueChange={(value) => handleFilterChange("province", value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {filters?.provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={searchParams.city || "all"}
                onValueChange={(value) => handleFilterChange("city", value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {filters?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={searchParams.specialization || "all"}
                onValueChange={(value) => handleFilterChange("specialization", value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {filters?.specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={searchParams.providerType || "all"}
                onValueChange={(value) => handleFilterChange("providerType", value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Provider Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {filters?.providerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 className="h-4 w-4" />
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchParams({ page: 1, limit: 20 })}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {isSearching ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : searchResults && searchResults.data.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing {((searchResults.page - 1) * searchResults.limit) + 1} -{" "}
                  {Math.min(searchResults.page * searchResults.limit, searchResults.total)} of{" "}
                  {searchResults.total} results
                </p>
              </div>

              {searchResults.data.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{provider.providerName}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{provider.providerType}</Badge>
                          <Badge variant="outline">{provider.specialization}</Badge>
                        </div>
                      </div>
                      <Link href={`/provider/${provider.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Stethoscope className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{provider.servicesProvided}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {provider.address}, {provider.city}, {provider.province}
                      </span>
                    </div>
                    {provider.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span dir="ltr">{provider.phoneNumber}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {searchResults.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(searchResults.page - 1)}
                    disabled={searchResults.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {searchResults.page} of {searchResults.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(searchResults.page + 1)}
                    disabled={searchResults.page === searchResults.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No providers found</p>
                <p className="text-sm text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Service Provider Search - Healthcare providers across Egypt</p>
          <p className="mt-2">
            {stats?.total.toLocaleString()} providers • {stats?.byProvince.length} provinces •{" "}
            {stats?.bySpecialization.length} specializations
          </p>
        </div>
      </footer>
    </div>
  );
}

