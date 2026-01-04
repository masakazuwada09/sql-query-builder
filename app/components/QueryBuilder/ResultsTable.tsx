// @/components/QueryBuilder/ResultsTable.tsx

"use client";

import { User } from "@/data/dummyUsers";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  users: User[];
  totalCount: number;
}

function formatCurrency(value: number | undefined): string {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function ResultsTable({ users, totalCount }: ResultsTableProps) {
  const filteredCount = users.length;
  const isFiltered = filteredCount !== totalCount;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold text-foreground">Users</h3>
        <div className="flex items-center gap-2">
          {isFiltered && <Badge variant="secondary" className="text-xs">Filtered</Badge>}
          <span className="text-sm text-muted-foreground">{filteredCount} of {totalCount} users</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Distinct ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Age</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Premium</TableHead>
              <TableHead className="text-right">Sessions</TableHead>
              <TableHead className="text-right">LTV</TableHead>
              <TableHead>Signup</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                  No users match the current filters
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.distinctId} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user.distinctId}
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-right tabular-nums">{user.age}</TableCell>
                  <TableCell>{user.country ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs font-medium",
                      user.plan === "Enterprise" && "border-primary text-primary",
                      user.plan === "Pro" && "border-blue-500 text-blue-600",
                      user.plan === "Basic" && "border-amber-500 text-amber-600",
                      user.plan === "Free" && "border-muted-foreground text-muted-foreground"
                    )}>
                      {user.plan ?? "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.isPremium ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">–</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{user.sessions ?? "-"}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{formatCurrency(user.lifetimeValue)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(user.signupDate)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(user.lastActive)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}