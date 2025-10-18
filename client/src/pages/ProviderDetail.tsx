import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProvider } from "@/hooks/useProviders";
import { ArrowLeft, MapPin, Building2, Stethoscope, Phone, Calendar } from "lucide-react";
import { Link, useParams } from "wouter";
import { format } from "date-fns";

export default function ProviderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: provider, isLoading } = useProvider(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Provider not found</p>
              <p className="text-sm text-gray-600 mb-4">
                The provider you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>Return to Search</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-4">{provider.providerName}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {provider.providerType}
                  </Badge>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {provider.specialization}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Services */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Services Provided</h3>
              </div>
              <p className="text-gray-700 pl-7">{provider.servicesProvided}</p>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Location</h3>
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-gray-700">{provider.address}</p>
                <p className="text-gray-600">
                  {provider.city}, {provider.province}
                </p>
              </div>
            </div>

            {/* Contact */}
            {provider.phoneNumber && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Contact</h3>
                </div>
                <p className="text-gray-700 pl-7" dir="ltr">
                  {provider.phoneNumber}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Added on {format(new Date(provider.createdAt), "MMMM d, yyyy")}
                </span>
                {provider.updatedAt !== provider.createdAt && (
                  <span>
                    • Updated on {format(new Date(provider.updatedAt), "MMMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

