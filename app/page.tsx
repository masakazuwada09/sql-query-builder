"use client";

import { useState, useMemo } from "react";
import { RuleGroupType } from "react-querybuilder";
import { MixpanelQueryBuilder } from "@/components/QueryBuilder/MixpanelQueryBuilder";
import { SQLPreview } from "@/components/QueryBuilder/SQLPreview";
import { ResultsTable } from "@/components/QueryBuilder/ResultsTable";
import { dummyUsers } from "@/data/dummyUsers";
import { executeQuery } from "@/lib/queryExecutor";

export default function QueryBuilderPage() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  const filteredUsers = useMemo(() => executeQuery(query, dummyUsers), [query]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">User Segmentation</h1>
          <p className="mt-3 text-muted-foreground">
            a Task by Masakazu
          </p>
          <p className="mt-3 text-muted-foreground">
            Build filters like in Mixpanel • See live SQL and results
          </p>
        </header>

        <MixpanelQueryBuilder query={query} onQueryChange={setQuery} />

        <SQLPreview query={query} />

        <ResultsTable users={filteredUsers} totalCount={dummyUsers.length} />
      </div>
    </div>
  );
}