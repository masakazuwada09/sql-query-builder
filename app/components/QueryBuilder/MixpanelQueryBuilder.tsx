"use client";

import dynamic from "next/dynamic";
import { memo, useState } from "react";
import type { RuleType } from "react-querybuilder";
import { fieldDefinitions } from "@/data/dummyUsers";
import {
  CustomFieldSelector,
  CustomOperatorSelector,
  CustomValueEditor,
  CustomAddRuleAction,
  CustomRemoveRuleAction,
  CustomRemoveGroupAction,
  CustomDragHandle,
} from "./CustomActionButtons";

const QueryBuilder = dynamic(() => import("./QueryBuilderWrapper"), {
  ssr: false,
});

/* ─────────────────── Types ─────────────────── */
type Rule = RuleType & { id: string };

type Group = {
  id: string;
  combinator: "and" | "or";
  rules: Rule[];
};

type RootQuery = {
  combinator: "and";
  rules: Rule[];
  groups: Group[];
};

/* ─────────────────── Helpers ─────────────────── */
const createRule = (field: string): Rule => ({
  id: crypto.randomUUID(),
  field,
  operator: "=",
  value: "",
});

const createGroup = (): Group => ({
  id: crypto.randomUUID(),
  combinator: "and",
  rules: [],
});

/* ─────────────────── UI Components ─────────────────── */

const CombinatorToggle = ({
  value,
  onToggle,
  showConnector = false,
}: {
  value: "and" | "or";
  onToggle: (v: "and" | "or") => void;
  showConnector?: boolean;
}) => (
  <div className="flex justify-center -my-8 relative z-10">
    {showConnector && (
      <div
        className="absolute inset-x-0 top-0 mx-auto w-0.5 bg-border"
        style={{ height: "32px" }}
      />
    )}

    <button
      onClick={() => onToggle(value === "and" ? "or" : "and")}
      className={`
        relative px-5 py-1 text-xs font-semibold rounded-full transition
        ${value === "and"
          ? "bg-blue-600 text-white"
          : "bg-muted text-foreground"}
      `}
    >
      {value.toUpperCase()}
    </button>
  </div>
);

const GroupCard = ({
  joinTop,
  joinBottom,
  children,
}: {
  joinTop?: boolean;
  joinBottom?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={`
      w-full border border-border bg-card p-6 relative
      ${joinTop ? "rounded-t-none border-t-0" : "rounded-t-xl"}
      ${joinBottom ? "rounded-b-none border-b-0" : "rounded-b-xl"}
    `}
  >
    {children}
  </div>
);

/* ─────────────────── Main Component ─────────────────── */
export const MixpanelQueryBuilder = memo(
  ({
    query,
    onQueryChange,
  }: {
    query?: Partial<RootQuery>;
    onQueryChange: (q: RootQuery) => void;
  }) => {
    const [showSave, setShowSave] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    // Ultimate safe query - guarantees arrays even if query is undefined/malformed
    const safeQuery: RootQuery = {
      combinator: "and",
      rules: Array.isArray(query?.rules) ? query.rules : [],
      groups: Array.isArray(query?.groups) ? query.groups : [],
    };

    const fields = fieldDefinitions.map((f) => ({
      name: f.name,
      label: f.label,
      value: f.name,
      dataType: f.type,
    }));

    const addRuleToRoot = (field: string) => {
      const next = structuredClone(safeQuery);
      next.rules.push(createRule(field));
      onQueryChange(next);
    };

    const addRuleToGroup = (i: number, field: string) => {
      const next = structuredClone(safeQuery);
      if (next.groups[i]) {
        next.groups[i].rules.push(createRule(field));
      }
      onQueryChange(next);
    };

    const updateGroup = (i: number, g: Group) => {
      const next = structuredClone(safeQuery);
      next.groups[i] = g;
      onQueryChange(next);
    };

    return (
      <div className="flex flex-col gap-4">
        {/* ACTION BAR */}
        <div className="flex justify-between">
          <button
            onClick={() =>
              onQueryChange({ combinator: "and", rules: [], groups: [] })
            }
            className="border rounded-md px-4 py-2 text-sm"
          >
            Clear all
          </button>

          <button
            onClick={() => setShowSave(true)}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
          >
            Save as
          </button>
        </div>

        {/* ROOT GROUP */}
        <GroupCard
          joinTop={false}
          joinBottom={
            safeQuery.groups.length > 0 &&
            safeQuery.groups[0].combinator === "and"
          }
        >
          <QueryBuilder
            query={safeQuery}
            fields={fields}
            onQueryChange={onQueryChange}
            controlElements={{
              fieldSelector: CustomFieldSelector,
              operatorSelector: CustomOperatorSelector,
              valueEditor: CustomValueEditor,
              addRuleAction: () => null,
              addGroupAction: () => null,
              combinatorSelector: () => null,
              removeRuleAction: CustomRemoveRuleAction,
              removeGroupAction: CustomRemoveGroupAction,
              dragHandle: CustomDragHandle,
            }}
          />

          <div className="mt-4">
            <CustomAddRuleAction onSelectField={addRuleToRoot} />
          </div>
        </GroupCard>

        {/* ADDITIONAL GROUPS */}
        {safeQuery.groups.map((group, i) => {
          const prevCombinator =
            i === 0 ? "and" : safeQuery.groups[i - 1]?.combinator ?? "and";

          const nextCombinator =
            i === safeQuery.groups.length - 1
              ? null
              : safeQuery.groups[i + 1]?.combinator;

          const joinTop = prevCombinator === "and";
          const joinBottom = nextCombinator === "and";

          const showConnectorLine = joinTop;

          return (
            <div key={group.id} className="relative">
              <CombinatorToggle
                value={group.combinator}
                onToggle={(newCombinator) => {
                  const next = structuredClone(safeQuery);
                  next.groups[i].combinator = newCombinator;
                  onQueryChange(next);
                }}
                showConnector={showConnectorLine}
              />

              <GroupCard joinTop={joinTop} joinBottom={joinBottom}>
                <QueryBuilder
                  query={group}
                  fields={fields}
                  onQueryChange={(updatedGroup: Group) =>
                    updateGroup(i, updatedGroup)
                  }
                  controlElements={{
                    fieldSelector: CustomFieldSelector,
                    operatorSelector: CustomOperatorSelector,
                    valueEditor: CustomValueEditor,
                    addRuleAction: () => null,
                    addGroupAction: () => null,
                    combinatorSelector: () => null,
                    removeRuleAction: CustomRemoveRuleAction,
                    removeGroupAction: CustomRemoveGroupAction,
                    dragHandle: CustomDragHandle,
                  }}
                />

                {group.rules.length === 0 && (
                  <div className="mt-4">
                    <CustomAddRuleAction
                      onSelectField={(field) => addRuleToGroup(i, field)}
                    />
                  </div>
                )}
              </GroupCard>
            </div>
          );
        })}

        {/* ADD GROUP BUTTON */}
        <button
          onClick={() => {
            const next = structuredClone(safeQuery);
            next.groups.push(createGroup());
            onQueryChange(next);
          }}
          className="border rounded-md px-4 py-2 text-sm w-fit"
        >
          + Group
        </button>

        {/* SAVE MODAL */}
        {showSave && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold">Create New Cohort</h2>

              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSave(false)}>Cancel</button>
                <button
                  disabled={!name}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MixpanelQueryBuilder.displayName = "MixpanelQueryBuilder";