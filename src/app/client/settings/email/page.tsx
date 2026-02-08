"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/auth.slice";
import {
  useDomainConfig,
  useUpdateDomain,
  useRemoveDomain,
} from "@/lib/api/hooks/useDomain";
import { UserRole } from "@/types/enums/user-role.enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Mail,
  Shield,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import {
  mailgunDomainField,
  mailgunFromEmailField,
  mailgunDomainMatchRefinement,
  MAILGUN_DOMAIN_MATCH_MESSAGE,
} from "@/lib/validations/domain.schemas";

const domainFormSchema = z
  .object({
    mailgunDomain: mailgunDomainField,
    mailgunFromEmail: mailgunFromEmailField,
    mailgunFromName: z.string().optional(),
  })
  .refine(mailgunDomainMatchRefinement, {
    message: MAILGUN_DOMAIN_MATCH_MESSAGE,
    path: ["mailgunFromEmail"],
  });

type DomainFormValues = z.infer<typeof domainFormSchema>;

export default function EmailSettingsPage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: domainConfig, isLoading, refetch } = useDomainConfig();
  const updateDomain = useUpdateDomain();
  const removeDomain = useRemoveDomain();

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      mailgunDomain: "",
      mailgunFromEmail: "",
      mailgunFromName: "",
    },
  });

  // Populate form when domain config loads
  useEffect(() => {
    if (domainConfig) {
      form.reset({
        mailgunDomain: domainConfig.mailgunDomain || "",
        mailgunFromEmail: domainConfig.mailgunFromEmail || "",
        mailgunFromName: domainConfig.mailgunFromName || "",
      });
    }
  }, [domainConfig, form]);

  // Check if user has permission
  const hasPermission = currentUser?.role === UserRole.CLIENT_SUPER_ADMIN;

  if (!hasPermission) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              Only Client Super Admins can configure email domain settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const handleSubmit = (values: DomainFormValues) => {
    updateDomain.mutate({
      mailgunDomain: values.mailgunDomain || undefined,
      mailgunFromEmail: values.mailgunFromEmail || undefined,
      mailgunFromName: values.mailgunFromName || undefined,
    });
  };

  const handleRemove = () => {
    removeDomain.mutate();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your email sender domain and settings
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Default Sender Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Default Sender
              </CardTitle>
              <CardDescription>
                This email was set during registration and is used as the
                fallback sender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Registration Email
                  </p>
                  <p className="font-medium">
                    {domainConfig?.registrationEmail || "Not set"}
                  </p>
                </div>
                <Badge variant="secondary">Read-only</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Domain Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Configuration</CardTitle>
              <CardDescription>
                Configure a custom domain for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="mailgunDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="mail.yourdomain.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your verified Mailgun sending domain. Public email
                          providers are not allowed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailgunFromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="noreply@yourdomain.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The email address that will appear in the "From"
                          field. The domain must match the domain above.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailgunFromName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The display name that will appear alongside the sender
                          email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-4">
                    <Button type="submit" disabled={updateDomain.isPending}>
                      {updateDomain.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Configuration"
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={
                            removeDomain.isPending ||
                            !domainConfig?.mailgunDomain
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Domain
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Remove Domain Configuration?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove your custom domain settings. Emails
                            will be sent using the default sender email instead.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRemove}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {domainConfig?.mailgunVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">
                    {domainConfig?.mailgunVerified
                      ? "Verified"
                      : "Not Verified"}
                  </p>
                  {domainConfig?.mailgunVerifiedAt && (
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(domainConfig.mailgunVerifiedAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  )}
                </div>
              </div>
              {!domainConfig?.mailgunVerified &&
                domainConfig?.mailgunDomain && (
                  <p className="text-sm text-muted-foreground">
                    Domain verification is pending. Please configure your DNS
                    records in Mailgun.
                  </p>
                )}
            </CardContent>
          </Card> */}

        </div>
      </div>
    </div>
  );
}
