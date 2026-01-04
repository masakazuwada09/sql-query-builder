"use client";

import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { RuleType, FullField } from "react-querybuilder";
import { fieldDefinitions } from "@/data/dummyUsers";
import {
  CustomFieldSelector,
  CustomOperatorSelector,
  CustomValueEditor,
  CustomAddRuleAction,
  CustomRemoveRuleAction,
  CustomRemoveGroupAction,
  CustomDragHandle,
  CustomAddGroupAction,
} from "./CustomActionButtons";

type UserRule = RuleType<string, string, any, string>;
type UserField = FullField & { name: string; label: string };

// Dynamically import QueryBuilder for client-side
const QueryBuilder = dynamic(() => import("./QueryBuilderWrapper"), {
  ssr: false,
});

export const MixpanelQueryBuilder = memo(({ query, onQueryChange }: any) => {
  const [pendingField, setPendingField] = useState<string | null>(null);

  const fields: UserField[] = fieldDefinitions.map((f) => ({
    name: f.name,
    label: f.label,
    value: f.name,
    dataType: f.type,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Main Query Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <QueryBuilder
          query={query}
          onQueryChange={onQueryChange}
          fields={fields}
          combinators={[
            { name: "and", label: "AND" },
            { name: "or", label: "OR" },
          ]}
          controlElements={{
            fieldSelector: CustomFieldSelector,
            operatorSelector: CustomOperatorSelector,
            valueEditor: CustomValueEditor,
            addRuleAction: () => null,
            removeRuleAction: CustomRemoveRuleAction,
            removeGroupAction: CustomRemoveGroupAction,
            dragHandle: CustomDragHandle,
            combinatorSelector: () => null,
            addGroupAction: () => null,
          }}
          controlClassnames={{
            rule: `flex items-center gap-2 rounded-lg px-2 py-2 transition-all duration-200 hover:bg-accent/40 [&.dndDragging]:bg-primary/10 [&.dndDragging]:ring-2 [&.dndDragging]:ring-primary [&.dndDragging]:shadow-lg [&.dndDragging]:scale-[1.02]`,
            field: "min-w-[160px]",
            operator: "min-w-[140px]",
            value: "flex-1",
          }}
          context={{ setPendingField }}
        />

        {/* + Filter Flyout */}
        <div className="mt-4">
          <CustomAddRuleAction
            onSelectField={(fieldName: string) => {
              const newRule: UserRule = {
                field: fieldName,
                operator: "=",
                value: "",
              };
              onQueryChange({
                ...query,
                rules: [...query.rules, newRule],
              });
            }}
          />
        </div>
      </div>

      {/* + Add Group Card */}
      <div className="flex flex-col gap-4">
        {query.groups?.map((group: any, i: number) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
          >
            {/* Group AND/OR Switch */}
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold">Combinator:</span>
              <select
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                value={group.combinator}
                onChange={(e) => {
                  const newGroups = [...query.groups];
                  newGroups[i].combinator = e.target.value;
                  onQueryChange({ ...query, groups: newGroups });
                }}
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
              </select>
            </div>

            {/* Group Rules */}
            <QueryBuilder
              query={group}
              onQueryChange={(newGroup: any) => {
                const newGroups = [...query.groups];
                newGroups[i] = newGroup;
                onQueryChange({ ...query, groups: newGroups });
              }}
              fields={fields}
              combinators={[
                { name: "and", label: "AND" },
                { name: "or", label: "OR" },
              ]}
              controlElements={{
                fieldSelector: CustomFieldSelector,
                operatorSelector: CustomOperatorSelector,
                valueEditor: CustomValueEditor,
                addRuleAction: () => null,
                removeRuleAction: CustomRemoveRuleAction,
                removeGroupAction: CustomRemoveGroupAction,
                dragHandle: CustomDragHandle,
                combinatorSelector: () => null,
                addGroupAction: () => null,
              }}
            />
          </div>
        ))}
      </div>

      {/* + Add Group Action */}
      <div>
        <CustomAddGroupAction
          handleOnClick={() => {
            const newGroup = { combinator: "and", rules: [] };
            onQueryChange({
              ...query,
              groups: [...(query.groups || []), newGroup],
            });
          }}
        />
      </div>
    </div>
  );
});

MixpanelQueryBuilder.displayName = "MixpanelQueryBuilder";
