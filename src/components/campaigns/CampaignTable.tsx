"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignStatus } from "@/types/enums/campaign-status.enum";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  updatedAt: string;
  groups?: { id: string; name: string }[];
}

interface CampaignTableProps {
  data: Campaign[];
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function CampaignTable({
  data,
  onDelete,
  emptyMessage = "No campaigns found.",
}: CampaignTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Groups</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>

                <TableCell>{campaign.subject}</TableCell>

                <TableCell>
                  <span
                    className={`text-sm font-medium ${
                      campaign.status === "SENT"
                        ? "text-green-600"
                        : campaign.status === "APPROVED"
                          ? "text-blue-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </TableCell>

                <TableCell>
                  {campaign.groups && campaign.groups.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {campaign.groups.map((g) => (
                        <Badge
                          key={g.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {g.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {new Date(campaign.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </TableCell>

                {/* <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/client/campaigns/${campaign.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Edit2, Trash2, Eye } from "lucide-react";
// import Link from "next/link";
// import { CampaignStatus } from "@/types/enums/campaign-status.enum";

// export interface Campaign {
//   id: string;
//   name: string;
//   subject: string;
//   status: CampaignStatus;
//   updatedAt: string;
//   groups?: { id: string; name: string }[];
// }

// interface CampaignTableProps {
//   data: Campaign[];
//   onDelete: (id: string) => void;
// }

// export function CampaignTable({ data, onDelete }: CampaignTableProps) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Subject</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Groups</TableHead>
//             <TableHead>Last Updated</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={6} className="h-24 text-center">
//                 No campaigns found.
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((campaign) => (
//               <TableRow key={campaign.id}>
//                 <TableCell className="font-medium">{campaign.name}</TableCell>

//                 <TableCell>{campaign.subject}</TableCell>

//                 <TableCell>
//                   <span
//                     className={`text-sm font-medium ${
//                       campaign.status === "SENT"
//                         ? "text-green-600"
//                         : campaign.status === "APPROVED"
//                           ? "text-blue-600"
//                           : "text-muted-foreground"
//                     }`}
//                   >
//                     {campaign.status}
//                   </span>
//                 </TableCell>

//                 <TableCell>
//                   {campaign.groups && campaign.groups.length > 0 ? (
//                     <div className="flex flex-wrap gap-1">
//                       {campaign.groups.map((g) => (
//                         <Badge key={g.id} variant="secondary" className="text-xs">
//                           {g.name}
//                         </Badge>
//                       ))}
//                     </div>
//                   ) : (
//                     <span className="text-muted-foreground">—</span>
//                   )}
//                 </TableCell>

//                 <TableCell className="text-muted-foreground">
//                   {new Date(campaign.updatedAt).toLocaleString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     hour12: false,
//                   })}
//                 </TableCell>

//                 <TableCell className="text-right space-x-2">
//                   {/* <Link href={`/client/campaigns/${campaign.id}`}>
//                     <Button variant="ghost" size="icon" className="h-8 w-8">
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </Link>

//                   {/* <Link href={`/client/campaigns/${campaign.id}/edit`}>
//                     <Button variant="ghost" size="icon" className="h-8 w-8">
//                       <Edit2 className="h-4 w-4" />
//                     </Button>
//                   </Link> */}

//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-destructive hover:text-destructive"
//                     onClick={() => onDelete(campaign.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
