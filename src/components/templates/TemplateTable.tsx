"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { TemplateView } from "@/types/entities/template.types";
import { format } from "date-fns";

interface TemplateTableProps {
  data: TemplateView[];
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function TemplateTable({
  data,
  onDelete,
  onDuplicate,
}: TemplateTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No templates found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">
                  {template.name}
                </TableCell>

                <TableCell>{template.subject || "-"}</TableCell>

                <TableCell>
                  <span
                    className={`text-sm font-medium ${
                      template.isActive
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {template.isActive ? "ACTIVE" : "DRAFT"}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {formatDate(template.updatedAt)}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Link href={`/client/templates/${template.id}/edit`}>
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button> */}
                  </Link>

                  {/* {onDuplicate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDuplicate(template.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )} */}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
