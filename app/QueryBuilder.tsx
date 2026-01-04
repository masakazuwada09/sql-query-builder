"use client";

import { useState, useMemo, useCallback } from "react";
import { RuleGroupType } from "react-querybuilder";
import { MixpanelQueryBuilder } from "@/components/QueryBuilder/MixpanelQueryBuilder";
import { ResultsTable } from "@/components/QueryBuilder/ResultsTable";
import { SQLPreview } from "@/components/QueryBuilder/SQLPreview";
import { dummyUsers } from "./data/dummyUsers";
import { executeQuery } from "@/lib/queryExecutor";

export default function QueryBuilderPage() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });

  const filteredUsers = useMemo(() => {
    return executeQuery(query, dummyUsers);
  }, [query]);

  const handleQueryChange = useCallback((newQuery: RuleGroupType) => {
    setQuery(newQuery);
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Segmentation Query Builder</h1>

      {/* Now passing BOTH required props */}
      <MixpanelQueryBuilder
        query={query}
        onQueryChange={handleQueryChange}
      />

      <SQLPreview query={query} />

      <ResultsTable users={filteredUsers} totalCount={dummyUsers.length} />
    </div>
  );
}