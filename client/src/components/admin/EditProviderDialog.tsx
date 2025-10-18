import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProvider } from "@/hooks/useProviders";
import { useForm } from "react-hook-form";
import type { ServiceProvider } from "@/lib/api";

interface EditProviderDialogProps {
  provider: ServiceProvider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProviderForm {
  providerName: string;
  providerType: string;
  servicesProvided: string;
  specialization: string;
  address: string;
  city: string;
  province: string;
  phoneNumber?: string;
}

export default function EditProviderDialog({
  provider,
  open,
  onOpenChange,
}: EditProviderDialogProps) {
  const updateMutation = useUpdateProvider();
  const { register, handleSubmit, formState: { errors } } = useForm<ProviderForm>({
    defaultValues: {
      providerName: provider.providerName,
      providerType: provider.providerType,
      servicesProvided: provider.servicesProvided,
      specialization: provider.specialization,
      address: provider.address,
      city: provider.city,
      province: provider.province,
      phoneNumber: provider.phoneNumber || "",
    },
  });

  const onSubmit = (data: ProviderForm) => {
    updateMutation.mutate(
      { id: provider.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
          <DialogDescription>
            Update provider information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="providerName">Provider Name *</Label>
              <Input
                id="providerName"
                {...register("providerName", { required: "Provider name is required" })}
              />
              {errors.providerName && (
                <p className="text-sm text-red-600">{errors.providerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerType">Provider Type *</Label>
              <Input
                id="providerType"
                {...register("providerType", { required: "Provider type is required" })}
              />
              {errors.providerType && (
                <p className="text-sm text-red-600">{errors.providerType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Input
                id="specialization"
                {...register("specialization", { required: "Specialization is required" })}
              />
              {errors.specialization && (
                <p className="text-sm text-red-600">{errors.specialization.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="servicesProvided">Services Provided *</Label>
              <Textarea
                id="servicesProvided"
                {...register("servicesProvided", { required: "Services are required" })}
                rows={3}
              />
              {errors.servicesProvided && (
                <p className="text-sm text-red-600">{errors.servicesProvided.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                rows={2}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Input
                id="province"
                {...register("province", { required: "Province is required" })}
              />
              {errors.province && (
                <p className="text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

