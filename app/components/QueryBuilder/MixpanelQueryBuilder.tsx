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

type Rule = RuleType & { id: string };
type Group = {
  id: string;
  combinator: "and" | "or";
  rules: Rule[];
};

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

const GroupCard = ({ joined, children }: any) => (
  <div
    className={`w-full border border-border bg-card p-6
      ${joined ? "rounded-none border-t-0" : "rounded-xl"}
    `}
  >
    {children}
  </div>
);

const CombinatorSwitch = ({ value, onChange }: any) => (
  <div className="flex justify-center -my-3 relative z-10">
    <div className="flex bg-background border rounded-full p-1 gap-1">
      {["and", "or"].map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-4 py-1 text-xs rounded-full transition
            ${value === c ? "bg-primary text-primary-foreground" : ""}
          `}
        >
          {c.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

export const MixpanelQueryBuilder = memo(({ query, onQueryChange }: any) => {
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const fields = fieldDefinitions.map((f) => ({
    name: f.name,
    label: f.label,
    value: f.name,
    dataType: f.type,
  }));

  const addRuleToRoot = (field: string) => {
    const next = structuredClone(query);
    next.rules.push(createRule(field));
    onQueryChange(next);
  };

  const addRuleToGroup = (index: number, field: string) => {
    const next = structuredClone(query);
    next.groups[index].rules.push(createRule(field));
    onQueryChange(next);
  };

  const updateGroup = (i: number, group: Group) => {
    const next = structuredClone(query);
    next.groups[i] = group;
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
      <GroupCard joined={false}>
        <QueryBuilder
          query={query}
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

      {/* GROUPS */}
      {query.groups?.map((group: Group, i: number) => (
        <div key={group.id}>
          <CombinatorSwitch
            value={group.combinator}
            onChange={(c: "and" | "or") => {
              const next = structuredClone(query);
              next.groups[i].combinator = c;
              onQueryChange(next);
            }}

          />

          <GroupCard joined={group.combinator === "and"}>
            <QueryBuilder
              query={group}
              fields={fields}
              onQueryChange={(g: Group) => updateGroup(i, g)}
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
                  onSelectField={(f) => addRuleToGroup(i, f)}
                />
              </div>
            )}
          </GroupCard>
        </div>
      ))}

      {/* ADD GROUP */}
      <button
        onClick={() =>
          onQueryChange({
            ...query,
            groups: [...(query.groups || []), createGroup()],
          })
        }
        className="border rounded-md px-4 py-2 text-sm w-fit"
      >
        + Group
      </button>

      {/* SAVE MODAL */}
      {showSave && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Create New Cohort</h2>

            <p className="text-sm text-muted-foreground">
              This cohort will be private due to your project role (Consumer)
            </p>

            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
              {!name && (
                <p className="text-xs text-destructive mt-1">
                  Name is required for saving
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="mt-1 w-full border rounded-md px-3 py-2"
                placeholder="optional"
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
});

MixpanelQueryBuilder.displayName = "MixpanelQueryBuilder";
