"use client";

import React, { forwardRef, useState, useMemo } from "react";
import type { DragHandleProps } from "react-querybuilder";
import { fieldDefinitions, dummyUsers } from "@/data/dummyUsers";

/* ─────────── Helpers ─────────── */
function cleanProps(props: any) {
  const {
    testID,
    level,
    path,
    schema,
    context,
    rule,
    ruleGroup,
    field,
    fieldData,
    operator,
    valueSource,
    inputType,
    listsAsArrays,
    parseNumbers,
    handleOnChange,
    value,
    options,
    ...rest
  } = props;
  return rest;
}

/* ─────────── Styled Select ─────────── */
const StyledSelect = (props: any) => (
  <select
    {...cleanProps(props)}
    className="
      h-9 rounded-md border border-border bg-background px-3 text-sm
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary
      group-[.dndDragging]:border-primary
      group-[.dndDragging]:bg-primary/5
      group-[.dndDragging]:shadow-sm
    "
  >
    {props.children}
  </select>
);

/* ─────────── Field / Operator / Combinator Selectors ─────────── */
export const CustomFieldSelector = (props: any) => (
  <StyledSelect {...props}>
    {props.options?.map((opt: any, idx: number) => {
      const key = typeof opt === "object" ? opt.name ?? idx : opt;
      const label = typeof opt === "object" ? opt.label ?? opt.name : opt;
      const val = typeof opt === "object" ? opt.name ?? opt : opt;
      return (
        <option key={key} value={val}>
          {label}
        </option>
      );
    })}
  </StyledSelect>
);

export const CustomOperatorSelector = CustomFieldSelector;
export const CustomCombinatorSelector = CustomFieldSelector;

/* ─────────── Value Editor ─────────── */
export const CustomValueEditor = (props: any) => {
  const { fieldData, value, handleOnChange, ...rest } = props;
  const fieldName = fieldData?.name as keyof typeof dummyUsers[0];

  const multiSelectFields = ["distinctId", "name", "country", "plan"] as const;
  const isMulti = multiSelectFields.includes(fieldName as any);

  if (isMulti) {
    const allValues = useMemo(() => {
      const set = new Set<string>();
      dummyUsers.forEach((u) => {
        if (u[fieldName] != null) set.add(String(u[fieldName]));
      });
      return [...set].sort();
    }, [fieldName]);

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(
      Array.isArray(value) ? value : value ? [String(value)] : []
    );
    const [search, setSearch] = useState("");

    const filtered = useMemo(
      () =>
        allValues.filter((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        ),
      [allValues, search]
    );

    const toggleValue = (val: string) => {
      setSelected((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
      );
    };

    const apply = () => {
      handleOnChange(selected.length ? selected : undefined);
      setIsOpen(false);
      setSearch("");
    };

    const displayText =
      selected.length === 0
        ? "Select values..."
        : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

    return (
      <div className="relative flex flex-col gap-2 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 px-3 rounded-md border border-border text-sm bg-background flex justify-between items-center"
        >
          {displayText}
          <span className="ml-2">▼</span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded shadow-lg">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border-b border-border focus:outline-none"
            />
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(val)}
                    onChange={() => toggleValue(val)}
                  />
                  {val}
                </label>
              ))}
            </div>
            <div className="flex justify-between px-3 py-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
              <button
                onClick={apply}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleChange = (e: any) => handleOnChange?.(e.target.value || undefined);

  if (fieldData?.dataType === "boolean") {
    return (
      <StyledSelect {...rest} value={value ?? ""} onChange={handleChange}>
        <option value="">- any -</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </StyledSelect>
    );
  }

  return (
    <input
      {...cleanProps(rest)}
      value={value ?? ""}
      onChange={handleChange}
      className="h-9 rounded-md border border-border bg-background px-3 text-sm"
    />
  );
};

/* ─────────── Actions ─────────── */
export const CustomAddRuleAction = ({
  onSelectField,
}: {
  onSelectField: (field: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground rounded px-5 py-2 text-sm font-semibold hover:bg-primary/90 transition"
      >
        + Filter
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-background border border-border rounded shadow-lg">
          {fieldDefinitions.map((f) => (
            <button
              key={f.name}
              onClick={() => {
                onSelectField(f.name);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-accent/40 transition"
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomAddGroupAction = ({ handleOnClick }: any) => (
  <button
    onClick={handleOnClick}
    className="rounded-md border border-border px-4 py-1.5 text-sm"
  >
    + Group
  </button>
);

export const CustomRemoveRuleAction = ({ handleOnClick }: any) => (
  <button onClick={handleOnClick} className="text-sm text-destructive">
    Remove
  </button>
);

export const CustomRemoveGroupAction = CustomRemoveRuleAction;

export const CustomDragHandle = forwardRef<HTMLSpanElement, DragHandleProps>(
  (_, ref) => (
    <span ref={ref} className="cursor-move px-1 text-muted-foreground">
      ⋮⋮
    </span>
  )
);
CustomDragHandle.displayName = "CustomDragHandle";
