// app/components/ui/table.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils"; // optional utility for merging classNames

// ------------------------------
// Table wrapper
// ------------------------------
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <table
      className={cn(
        "w-full border-collapse text-sm", // default Tailwind styles
        className
      )}
      {...props}
    >
      {children}
    </table>
  );
};

// ------------------------------
// Table Header
// ------------------------------
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return (
    <thead className={cn("bg-muted text-left", className)} {...props}>
      {children}
    </thead>
  );
};

// ------------------------------
// Table Body
// ------------------------------
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

// ------------------------------
// Table Row
// ------------------------------
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr className={cn("border-b last:border-0", className)} {...props}>
      {children}
    </tr>
  );
};

// ------------------------------
// Table Head (th)
// ------------------------------
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th
      scope="col"
      className={cn("px-4 py-2 font-medium text-left text-muted-foreground", className)}
      {...props}
    >
      {children}
    </th>
  );
};

// ------------------------------
// Table Cell (td)
// ------------------------------
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td className={cn("px-4 py-2", className)} {...props}>
      {children}
    </td>
  );
};
