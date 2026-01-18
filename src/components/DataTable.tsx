import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: { header: string; accessorKey: keyof T; className?: string }[];
  searchKeys: (keyof T)[];
  title?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  title,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filteredData = data.filter((item) =>
    searchKeys.some((key) =>
      String(item[key]).toLowerCase().includes(query.toLowerCase())
    )
  );

  const getBadgeColor = (val: string) => {
    const lower = val.toLowerCase();
    if (lower === "red") return "bg-red-500/20 text-red-400 border-red-500/50";
    if (lower === "blue") return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    if (lower === "yellow") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    if (lower === "purple") return "bg-purple-500/20 text-purple-400 border-purple-500/50";
    if (lower === "orange") return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    return "bg-muted text-muted-foreground border-border";
  };

  const getCategoryStyle = (val: string) => {
    const lower = val.toLowerCase();
    if (lower === "emergency") return "bg-red-500/15 text-red-300 border-red-500/40";
    if (lower === "status") return "bg-blue-500/15 text-blue-300 border-blue-500/40";
    if (lower === "traffic") return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    if (lower === "medical") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    if (lower === "tactical") return "bg-purple-500/15 text-purple-300 border-purple-500/40";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card p-4 rounded-lg border border-border/50 shadow-sm">
        {title && (
          <h2 className="text-xl font-bold font-mono tracking-tight text-primary uppercase">
            {title}
          </h2>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="SEARCH DATABASE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-lg bg-background/50 border-input focus-visible:ring-primary font-mono uppercase tracking-wider"
          />
        </div>
        <div className="text-sm font-mono text-muted-foreground whitespace-nowrap">
          {filteredData.length} RECORDS FOUND
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 flex-1 overflow-hidden flex flex-col shadow-inner">
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                {columns.map((col) => (
                  <TableHead
                    key={String(col.accessorKey)}
                    className={`text-primary font-bold tracking-wider uppercase h-12 px-4 ${col.className}`}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/30 border-b border-border/30"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.accessorKey)}
                        className={`py-4 px-4 ${col.className}`}
                      >
                        {col.accessorKey === "color" && row[col.accessorKey] ? (
                          <span className={`px-2 py-1 rounded text-xs font-bold border ${getBadgeColor(row[col.accessorKey])}`}>
                            {row[col.accessorKey]}
                          </span>
                        ) : col.accessorKey === "category" && row[col.accessorKey] ? (
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${getCategoryStyle(row[col.accessorKey])}`}>
                            {row[col.accessorKey]}
                          </span>
                        ) : (
                          row[col.accessorKey]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground font-mono"
                  >
                    NO RESULTS FOUND
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
