import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProvider } from "@/hooks/useProviders";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

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

export default function CreateProviderTab() {
  const createMutation = useCreateProvider();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProviderForm>();

  const onSubmit = (data: ProviderForm) => {
    createMutation.mutate(data as any, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Provider
        </CardTitle>
        <CardDescription>
          Create a new service provider entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="providerName">Provider Name *</Label>
              <Input
                id="providerName"
                placeholder="e.g., د. أحمد محمد - عيادة الأسنان"
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
                placeholder="e.g., مستشفى, عيادة, مركز طبي"
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
                placeholder="e.g., طب وجراحة الفم والأسنان"
                {...register("specialization", { required: "Specialization is required" })}
              />
              {errors.specialization && (
                <p className="text-sm text-red-600">{errors.specialization.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="servicesProvided">Services Provided *</Label>
              <Textarea
                id="servicesProvided"
                placeholder="e.g., خدمات خارجية, عمليات جراحية, تشخيص"
                {...register("servicesProvided", { required: "Services are required" })}
                rows={3}
              />
              {errors.servicesProvided && (
                <p className="text-sm text-red-600">{errors.servicesProvided.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="e.g., 123 شارع الجامعة، الدور الثاني"
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
                placeholder="e.g., مدينة نصر"
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
                placeholder="e.g., القاهرة"
                {...register("province", { required: "Province is required" })}
              />
              {errors.province && (
                <p className="text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="e.g., 01234567890 (Optional)"
                {...register("phoneNumber")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset Form
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Provider"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

