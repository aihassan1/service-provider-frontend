import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProviderSearch, useDeleteProvider } from "@/hooks/useProviders";
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { SearchParams, ServiceProvider } from "@/lib/api";
import EditProviderDialog from "./EditProviderDialog";

export default function ProvidersListTab() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    limit: 20,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<ServiceProvider | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<ServiceProvider | null>(null);

  const { data: searchResults, isLoading } = useProviderSearch(searchParams);
  const deleteMutation = useDeleteProvider();

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({ ...prev, q: value || undefined, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleDeleteClick = (provider: ServiceProvider) => {
    setProviderToDelete(provider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (providerToDelete) {
      deleteMutation.mutate(providerToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProviderToDelete(null);
        },
      });
    }
  };

  const handleEditClick = (provider: ServiceProvider) => {
    setProviderToEdit(provider);
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Providers</CardTitle>
          <CardDescription>
            View, edit, and delete service providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search providers..."
              className="pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Results count */}
          {searchResults && (
            <p className="text-sm text-gray-600">
              Showing {((searchResults.page - 1) * searchResults.limit) + 1} -{" "}
              {Math.min(searchResults.page * searchResults.limit, searchResults.total)} of{" "}
              {searchResults.total} providers
            </p>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : searchResults && searchResults.data.length > 0 ? (
                  searchResults.data.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.providerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{provider.providerType}</Badge>
                      </TableCell>
                      <TableCell>{provider.specialization}</TableCell>
                      <TableCell>{provider.city}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/provider/${provider.id}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(provider)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(provider)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No providers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {searchResults && searchResults.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{providerToDelete?.providerName}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {providerToEdit && (
        <EditProviderDialog
          provider={providerToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}

