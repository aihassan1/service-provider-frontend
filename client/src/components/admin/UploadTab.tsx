import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUploadExcel, useClearAllProviders } from "@/hooks/useProviders";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UploadTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const uploadMutation = useUploadExcel();
  const clearMutation = useClearAllProviders();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile, {
        onSuccess: () => {
          setSelectedFile(null);
          // Reset file input
          const fileInput = document.getElementById("file-upload") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        },
      });
    }
  };

  const handleClearAll = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        setClearDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div className="grid gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Excel File
            </CardTitle>
            <CardDescription>
              Import service providers from an Excel file (.xlsx or .xls)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                <strong>Expected columns:</strong> المنطقة / المدينة (Province/City), التخصيص
                (Specialization), اسم مقدم الخدمة (Provider Name), العنوان (Address), الخدمات
                المقدمة (Services), رقم التليفون (Phone Number)
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Select Excel File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{selectedFile.name}</span>
                <span className="text-gray-400">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload File"}
            </Button>

            {uploadMutation.isSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  File uploaded successfully!
                </AlertDescription>
              </Alert>
            )}

            {uploadMutation.isError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {(uploadMutation.error as any)?.response?.data?.message ||
                    "Failed to upload file"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect all providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h4 className="font-semibold text-red-900">Clear All Providers</h4>
                <p className="text-sm text-red-700">
                  Delete all service providers from the database
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setClearDialogOpen(true)}
                disabled={clearMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear All Providers</DialogTitle>
            <DialogDescription>
              This will permanently delete ALL service providers from the database. This action
              cannot be undone. Are you absolutely sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={clearMutation.isPending}
            >
              {clearMutation.isPending ? "Clearing..." : "Yes, Clear All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

