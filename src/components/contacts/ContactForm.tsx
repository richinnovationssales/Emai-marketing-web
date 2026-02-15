"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { AppDispatch } from "@/store";
import {
  createContact,
  updateContact,
  selectContactLoading,
  selectCustomFieldConfig,
  fetchCustomFields,
} from "@/store/slices/contact.slice";
import { fetchGroups, selectGroups } from "@/store/slices/group.slice";
import { Contact, CreateContactDTO } from "@/types/entities/contact.types";
import { CustomFieldType } from "@/types/enums/custom-field-type.enum";

interface ContactFormProps {
  initialData?: Contact;
  isEditMode?: boolean;
}

export function ContactForm({
  initialData,
  isEditMode = false,
}: ContactFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isLoading = useSelector(selectContactLoading);
  const customFields = useSelector(selectCustomFieldConfig);
  const groups = useSelector(selectGroups);

  useEffect(() => {
    if (customFields.length === 0) {
      dispatch(fetchCustomFields({ includeInactive: false }));
    }
  }, [dispatch, customFields.length]);

  // Fetch groups if not available
  useEffect(() => {
    if (groups.length === 0) {
      dispatch(fetchGroups());
    }
  }, [dispatch, groups.length]);

  // Normalize initial custom fields
  const defaultCustomFields = useMemo(() => {
    const mapped: Record<string, any> = {};

    // 1. Prioritize 'customFieldValues' array (from detailed GET /:id) because it links values to field IDs.
    if (
      Array.isArray(initialData?.customFieldValues) &&
      initialData.customFieldValues.length > 0
    ) {
      initialData.customFieldValues.forEach((item: any) => {
        // Find matching config to get the fieldKey (e.g., 'firstName')
        const config = customFields.find((cf) => cf.id === item.customFieldId);
        if (config) {
          mapped[config.fieldKey] = item.value;
        }
      });
      return mapped;
    }

    // 2. Fallback to 'customFields' object or simple 'customFieldValues' object if array is empty or missing.
    const source =
      initialData?.customFields || initialData?.customFieldValues || {};

    // Handle complex object from GET /:id which uses UUID keys and contains metadata
    // vs simple object { key: value }
    Object.entries(source).forEach(([key, val]: [string, any]) => {
      if (
        val &&
        typeof val === "object" &&
        "value" in val &&
        "fieldKey" in val
      ) {
        // Complex format: key is UUID, val has value and fieldKey
        mapped[val.fieldKey] = val.value;
      } else if (val && typeof val === "object" && "customFieldId" in val) {
        // Format like in the log but maybe as object values? Unusual but safe to check.
        const config = customFields.find((cf) => cf.id === val.customFieldId);
        if (config) mapped[config.fieldKey] = val.value;
      } else {
        // Simple format or standard key
        mapped[key] = val;
      }
    });

    return mapped;
  }, [initialData, customFields]);

  // specific schema for standard fields
  const baseSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    groupId: z.string().optional(),
  });

  // Generate dynamic schema
  const schema = useMemo(() => {
    const customFieldSchema: Record<string, z.ZodTypeAny> = {};

    customFields.forEach((field) => {
      let validator: z.ZodTypeAny = z.any();

      switch (field.type) {
        case CustomFieldType.NUMBER:
          validator = z.coerce.number();
          break;
        case CustomFieldType.BOOLEAN:
          validator = z.boolean();
          break;
        case CustomFieldType.DATE:
          validator = z.string();
          break;
        default:
          validator = z.string();
      }

      if (field.isRequired) {
        if (field.type === CustomFieldType.TEXT) {
          validator = (validator as z.ZodString).min(
            1,
            `${field.name} is required`,
          );
        }
      } else {
        validator = validator.optional().or(z.literal(""));
      }

      customFieldSchema[field.fieldKey] = validator;
    });

    return baseSchema.extend({
      customFields: z.object(customFieldSchema).optional(),
    });
  }, [customFields, baseSchema]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: initialData?.email || "",
      groupId: initialData?.groupId || "",
      customFields: defaultCustomFields,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      if (isEditMode && initialData) {
        // console.log("editing started !!")
        await dispatch(
          updateContact({
            id: initialData.id,
            data: {
              ...data,
              customFields: data.customFields,
            },
          }),
        ).unwrap();
        router.push("/client/contacts");
        // console.log("edited successsfully !!")
        toast.success("Contact updated successfully");
      } else {
        await dispatch(
          createContact({
            ...data,
            customFields: data.customFields,
          } as CreateContactDTO),
        ).unwrap();
        toast.success("Contact created successfully");
        router.push("/client/contacts");
      }
    } catch (error: any) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);

      //  toast.error(error || 'Something went wrong');
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-muted/40 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {isEditMode ? "Edit Contact" : "Create New Contact"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Standard Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
              {/* <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Group (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {/* Custom Fields Section */}
            {customFields.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground/80 border-b pb-2">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customFields.map((cf) => (
                    <FormField
                      key={cf.id}
                      control={form.control}
                      name={`customFields.${cf.fieldKey}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {cf.name}
                            {cf.isRequired && (
                              <span className="text-destructive"> *</span>
                            )}
                          </FormLabel>
                          <FormControl>
                            {cf.type === CustomFieldType.BOOLEAN ? (
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {cf.helpText || "Yes/No"}
                                </span>
                              </div>
                            ) : cf.type === CustomFieldType.SELECT ? (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(cf.options) &&
                                    cf.options.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={
                                  cf.type === CustomFieldType.NUMBER
                                    ? "number"
                                    : cf.type === CustomFieldType.DATE
                                      ? "date"
                                      : "text"
                                }
                                placeholder={cf.helpText || ""}
                                {...field}
                                value={field.value || ""}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Contact"
                ) : (
                  "Create Contact"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
