"use client";

import { RuleGroupType } from "react-querybuilder";
import { queryToSQL } from "@/lib/queryExecutor";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SQLPreviewProps {
  query: RuleGroupType;
}

export function SQLPreview({ query }: SQLPreviewProps) {
  const [copied, setCopied] = useState(false);
  const sqlString = queryToSQL(query);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sqlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Generated SQL Query</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs gap-1.5">
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* SQL Content */}
      <div className="p-4 bg-foreground/[0.02]">
        <pre className="text-sm font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-words">
          <code>
            {sqlString.split(/\b(SELECT|FROM|WHERE|AND|OR)\b/g).map((part, i) => {
              if (["SELECT", "FROM", "WHERE", "AND", "OR"].includes(part)) {
                return <span key={i} className="text-primary font-semibold">{part}</span>;
              }
              return part;
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
