"use client";

import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/auth.slice";
import { useDomainHistory } from "@/lib/api/hooks/useDomain";
import { UserRole } from "@/types/enums/user-role.enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Shield,
  RefreshCw,
  ScrollText,
  Globe,
  PenLine,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { DomainActivityType } from "@/types/entities/domain.types";

/**
 * UI-safe activity configuration
 * Internal provider names (Mailgun, SES, etc.) never leak to the UI
 */
const activityConfig: Record<
  DomainActivityType,
  {
    label: string;
    description: string;
    variant: "default" | "secondary" | "destructive";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  MAILGUN_DOMAIN_CONFIGURED: {
    label: "Configured",
    description: "Email sending domain configured",
    variant: "default",
    icon: Globe,
  },
  MAILGUN_DOMAIN_UPDATED: {
    label: "Updated",
    description: "Email sending domain updated",
    variant: "secondary",
    icon: PenLine,
  },
  MAILGUN_DOMAIN_REMOVED: {
    label: "Removed",
    description: "Email sending domain removed",
    variant: "destructive",
    icon: Trash2,
  },
};

export default function DomainLogsPage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: historyData, isLoading, refetch } = useDomainHistory();

  const hasPermission = currentUser?.role === UserRole.CLIENT_SUPER_ADMIN;

  if (!hasPermission) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              Only Client Super Admins can view domain logs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const history = historyData?.history || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Domain Logs</h3>
          <p className="text-sm text-muted-foreground">
            View the history of all changes made to your domain configuration.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Change History
          </CardTitle>
          <CardDescription>
            A complete log of domain configuration changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => {
                const config = activityConfig[item.activityType];
                const IconComponent = config.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="mt-0.5 rounded-full bg-muted p-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {config.description}
                        </p>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>

                      {item.metadata && (
                        <div className="text-sm text-muted-foreground space-y-1 mt-2">
                          {item.metadata.previousDomain !== undefined &&
                            item.metadata.newDomain !== undefined && (
                              <p>
                                Domain:{" "}
                                <span className="line-through">
                                  {item.metadata.previousDomain || "none"}
                                </span>
                                {" → "}
                                <span className="font-medium text-foreground">
                                  {item.metadata.newDomain || "none"}
                                </span>
                              </p>
                            )}

                          {item.metadata.previousFromEmail !== undefined &&
                            item.metadata.newFromEmail !== undefined && (
                              <p>
                                From Email:{" "}
                                <span className="line-through">
                                  {item.metadata.previousFromEmail || "none"}
                                </span>
                                {" → "}
                                <span className="font-medium text-foreground">
                                  {item.metadata.newFromEmail || "none"}
                                </span>
                              </p>
                            )}

                          {item.metadata.previousFromName !== undefined &&
                            item.metadata.newFromName !== undefined && (
                              <p>
                                From Name:{" "}
                                <span className="line-through">
                                  {item.metadata.previousFromName || "none"}
                                </span>
                                {" → "}
                                <span className="font-medium text-foreground">
                                  {item.metadata.newFromName || "none"}
                                </span>
                              </p>
                            )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span>
                          {format(
                            new Date(item.createdAt),
                            "MMM d, yyyy 'at' HH:mm"
                          )}
                        </span>
                        <span>By: {item.performedByRole}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No Logs Yet</h3>
              <p className="text-sm text-muted-foreground">
                Domain configuration changes will appear here once you make your
                first update.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


// "use client";

// import { useAppSelector } from "@/store/hooks";
// import { selectCurrentUser } from "@/store/slices/auth.slice";
// import { useDomainHistory } from "@/lib/api/hooks/useDomain";
// import { UserRole } from "@/types/enums/user-role.enum";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Loader2,
//   Shield,
//   RefreshCw,
//   ScrollText,
//   Globe,
//   PenLine,
//   Trash2,
// } from "lucide-react";
// import { format } from "date-fns";
// import { DomainActivityType } from "@/types/entities/domain.types";

// const activityConfig: Record<
//   DomainActivityType,
//   { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ComponentType<{ className?: string }> }
// > = {
//   MAILGUN_DOMAIN_CONFIGURED: {
//     label: "Configured",
//     variant: "default",
//     icon: Globe,
//   },
//   MAILGUN_DOMAIN_UPDATED: {
//     label: "Updated",
//     variant: "secondary",
//     icon: PenLine,
//   },
//   MAILGUN_DOMAIN_REMOVED: {
//     label: "Removed",
//     variant: "destructive",
//     icon: Trash2,
//   },
// };

// export default function DomainLogsPage() {
//   const currentUser = useAppSelector(selectCurrentUser);
//   const { data: historyData, isLoading, refetch } = useDomainHistory();

//   const hasPermission = currentUser?.role === UserRole.CLIENT_SUPER_ADMIN;

//   if (!hasPermission) {
//     return (
//       <div className="space-y-6">
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <Shield className="h-12 w-12 text-muted-foreground mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
//             <p className="text-muted-foreground text-center">
//               Only Client Super Admins can view domain logs.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//         </div>
//       </div>
//     );
//   }

//   const history = historyData?.history || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-medium">Domain Logs</h3>
//           <p className="text-sm text-muted-foreground">
//             View the history of all changes made to your domain configuration.
//           </p>
//         </div>
//         <Button variant="outline" size="sm" onClick={() => refetch()}>
//           <RefreshCw className="mr-2 h-4 w-4" />
//           Refresh
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <ScrollText className="h-5 w-5" />
//             Change History
//           </CardTitle>
//           <CardDescription>
//             A complete log of domain configuration changes
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {history.length > 0 ? (
//             <div className="space-y-4">
//               {history.map((item) => {
//                 const config = activityConfig[item.activityType];
//                 const IconComponent = config.icon;

//                 return (
//                   <div
//                     key={item.id}
//                     className="flex items-start gap-4 p-4 border rounded-lg"
//                   >
//                     <div className="mt-0.5 rounded-full bg-muted p-2">
//                       <IconComponent className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div className="flex-1 space-y-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p className="font-medium text-sm">
//                           {item.description}
//                         </p>
//                         <Badge variant={config.variant}>{config.label}</Badge>
//                       </div>

//                       {item.metadata && (
//                         <div className="text-sm text-muted-foreground space-y-1 mt-2">
//                           {item.metadata.previousDomain !== undefined &&
//                             item.metadata.newDomain !== undefined && (
//                               <p>
//                                 Domain:{" "}
//                                 <span className="line-through">
//                                   {item.metadata.previousDomain || "none"}
//                                 </span>
//                                 {" → "}
//                                 <span className="font-medium text-foreground">
//                                   {item.metadata.newDomain || "none"}
//                                 </span>
//                               </p>
//                             )}
//                           {item.metadata.previousFromEmail !== undefined &&
//                             item.metadata.newFromEmail !== undefined && (
//                               <p>
//                                 From Email:{" "}
//                                 <span className="line-through">
//                                   {item.metadata.previousFromEmail || "none"}
//                                 </span>
//                                 {" → "}
//                                 <span className="font-medium text-foreground">
//                                   {item.metadata.newFromEmail || "none"}
//                                 </span>
//                               </p>
//                             )}
//                           {item.metadata.previousFromName !== undefined &&
//                             item.metadata.newFromName !== undefined && (
//                               <p>
//                                 From Name:{" "}
//                                 <span className="line-through">
//                                   {item.metadata.previousFromName || "none"}
//                                 </span>
//                                 {" → "}
//                                 <span className="font-medium text-foreground">
//                                   {item.metadata.newFromName || "none"}
//                                 </span>
//                               </p>
//                             )}
//                         </div>
//                       )}

//                       <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
//                         <span>
//                           {format(
//                             new Date(item.createdAt),
//                             "MMM d, yyyy 'at' HH:mm"
//                           )}
//                         </span>
//                         <span>By: {item.performedByRole}</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <ScrollText className="h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-1">No Logs Yet</h3>
//               <p className="text-sm text-muted-foreground">
//                 Domain configuration changes will appear here once you make your
//                 first update.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
