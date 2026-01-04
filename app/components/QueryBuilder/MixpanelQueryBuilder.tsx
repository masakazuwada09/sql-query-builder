"use client";

import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCallback, memo } from "react";
import {
  RuleGroupType,
  RuleType,
  FullField,
  FullOperator,
  FullCombinator,
  QueryBuilderProps,
} from "react-querybuilder";

import { fieldDefinitions } from "@/data/dummyUsers";
import {
  CustomFieldSelector,
  CustomOperatorSelector,
  CustomCombinatorSelector,
  CustomValueEditor,
  CustomAddRuleAction,
  CustomAddGroupAction,
  CustomRemoveRuleAction,
  CustomRemoveGroupAction,
  CustomDragHandle,
} from "./CustomActionButtons";

type UserRule = RuleType<string, string, any, string>;
type UserRuleGroup = RuleGroupType<UserRule>;
type UserField = FullField & { name: string; label: string };
type UserOperator = FullOperator;
type UserCombinator = FullCombinator;

// Dynamically import QueryBuilder to avoid SSR issues with react-dnd
const QueryBuilder = dynamic<
  Partial<QueryBuilderProps<UserRuleGroup, UserField, UserOperator, UserCombinator>>
>(
  () => import("react-querybuilder").then((mod) => mod.default),
  { ssr: false }
);

interface MixpanelQueryBuilderProps {
  query: UserRuleGroup;
  onQueryChange: (query: UserRuleGroup) => void;
}

// Make it a controlled component — query comes from parent
export const MixpanelQueryBuilder = memo(function MixpanelQueryBuilder({
  query,
  onQueryChange,
}: MixpanelQueryBuilderProps) {
  const handleQueryChange = useCallback(
    (newQuery: UserRuleGroup) => {
      onQueryChange(newQuery);
    },
    [onQueryChange]
  );

  const fields: UserField[] = fieldDefinitions.map((f) => ({
    name: f.name,
    label: f.label,
    value: f.name,
    inputType:
      f.type === "number" ? "number" : f.type === "date" ? "date" : "text",
    dataType: f.type,
  }));

  const getOperators = useCallback((fieldName: string) => {
    const field = fieldDefinitions.find((f) => f.name === fieldName);
    switch (field?.type) {
      case "number":
      case "date":
        return ["=", "!=", ">", ">=", "<", "<="];
      case "boolean":
        return ["=", "!="];
      default:
        return ["=", "!=", "contains", "beginsWith", "endsWith"];
    }
  }, []);

  const hasRules = query.rules.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <DndProvider backend={HTML5Backend}>
        <QueryBuilder
          query={query}
          onQueryChange={handleQueryChange}
          fields={fields}
          getOperators={getOperators}
          controlElements={{
            fieldSelector: CustomFieldSelector,
            operatorSelector: CustomOperatorSelector,
            combinatorSelector: CustomCombinatorSelector,
            valueEditor: CustomValueEditor,
            addRuleAction: CustomAddRuleAction,
            addGroupAction: CustomAddGroupAction,
            removeRuleAction: CustomRemoveRuleAction,
            removeGroupAction: CustomRemoveGroupAction,
            dragHandle: CustomDragHandle,
          }}
          // Optional: nicer default styling
          showCloneButtons={false}
          showNotToggle={false}
        />
      </DndProvider>

      {!hasRules && (
        <div className="mt-8 rounded-lg border-2 border-dashed border-border py-12 text-center">
          <p className="text-lg font-medium text-foreground mb-2">
            No filters applied yet
          </p>
          <p className="text-sm text-muted-foreground">
            Click <strong className="text-foreground">+ Rule</strong> or{" "}
            <strong className="text-foreground">+ Group</strong> to add your first condition
          </p>
        </div>
      )}
    </div>
  );
});

MixpanelQueryBuilder.displayName = "MixpanelQueryBuilder";