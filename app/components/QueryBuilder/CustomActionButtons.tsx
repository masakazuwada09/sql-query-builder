"use client";

import React, { forwardRef, useState, useMemo } from "react";
import type { DragHandleProps } from "react-querybuilder";
import { fieldDefinitions, dummyUsers } from "@/data/dummyUsers";

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

const StyledSelect = (props: any) => (
  <select
    {...cleanProps(props)}
    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {props.children}
  </select>
);

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

export const CustomValueEditor = (props: any) => {
  const { fieldData, value, handleOnChange, ...rest } = props;
  const fieldName = fieldData?.name as keyof typeof dummyUsers[0];

  const multiSelectFields = ["distinctId", "name", "country", "plan"] as const;
  const isMulti = multiSelectFields.includes(fieldName as any);

  if (fieldData?.dataType === "boolean") {
    return (
      <StyledSelect
        {...rest}
        value={value ?? ""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleOnChange(e.target.value || undefined)
        }
      >
        <option value="">- any -</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </StyledSelect>
    );
  }

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
      () => allValues.filter((v) => v.toLowerCase().includes(search.toLowerCase())),
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
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 w-full px-3 rounded-md border border-border bg-background text-sm flex items-center justify-between hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          <span className="truncate">{displayText}</span>
          <span className="ml-2 text-muted-foreground">▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border-b border-border text-sm focus:outline-none"
            />
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No options</div>
              ) : (
                filtered.map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent/50 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(val)}
                      onChange={() => toggleValue(val)}
                      className="rounded border-border"
                    />
                    <span className="truncate">{val}</span>
                  </label>
                ))
              )}
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {selected.length} selected
              </span>
              <button
                onClick={apply}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      {...cleanProps(rest)}
      value={value ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleOnChange(e.target.value || undefined)
      }
      className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Enter value..."
    />
  );
};

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