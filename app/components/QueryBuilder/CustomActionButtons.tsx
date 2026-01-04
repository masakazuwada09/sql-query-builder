"use client";

import React, { forwardRef, useState, useMemo, useRef, useEffect } from "react";
import type { DragHandleProps } from "react-querybuilder";
import { fieldDefinitions } from "@/data/dummyUsers";
import { dummyUsers } from "@/data/dummyUsers";

// ── Clean props helper ───────────────────────────────────────
function cleanProps(props: any) {
  const {
    testID, level, path, schema, context, rule, ruleGroup,
    field, fieldData, operator, valueSource, inputType,
    listsAsArrays, parseNumbers, handleOnChange, value, options,
    ...rest
  } = props;
  return rest;
}

// ── Reusable styled select ───────────────────────────────────
const StyledSelect = (props: any) => (
  <select
    {...cleanProps(props)}
    className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {props.children}
  </select>
);

// ── Selectors ────────────────────────────────────────────────
export const CustomFieldSelector = (props: any) => (
  <StyledSelect {...props}>
    {props.options?.map((opt: any, idx: number) => {
      const key = typeof opt === "object" ? opt.name ?? idx : opt;
      const label = typeof opt === "object" ? opt.label ?? opt.name : opt;
      const val = typeof opt === "object" ? opt.name ?? opt : opt;
      return <option key={key} value={val}>{label}</option>;
    })}
  </StyledSelect>
);

export const CustomOperatorSelector = CustomFieldSelector;
export const CustomCombinatorSelector = CustomFieldSelector;

// ── Value Editor with Inline Dropdown Multi-Select ───────────
export const CustomValueEditor = (props: any) => {
  const { fieldData, value, handleOnChange, ...rest } = props;

  const fieldName = fieldData?.name as keyof typeof dummyUsers[0];

  const multiSelectFields = ["distinctId", "name", "country", "plan"] as const;
  const isMultiSelectField = multiSelectFields.includes(fieldName as any);

  if (isMultiSelectField) {
    const allValues = useMemo(() => {
      const set = new Set<string>();
      dummyUsers.forEach(user => {
        const val = user[fieldName];
        if (val != null) set.add(String(val));
      });
      return Array.from(set).sort();
    }, [fieldName]);

    const currentValues = Array.isArray(value)
      ? value.map(String)
      : value ? [String(value)] : [];

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(currentValues);
    const [search, setSearch] = useState("");

    const filteredValues = useMemo(() =>
      allValues.filter(v => v.toLowerCase().includes(search.toLowerCase())),
      [allValues, search]
    );

    const isAllChecked = selected.length === filteredValues.length && filteredValues.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < filteredValues.length;

    // Fix: Use useRef + useEffect for indeterminate
    const checkAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (checkAllRef.current) {
        checkAllRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    const toggleAll = () => {
      if (isAllChecked || isIndeterminate) {
        setSelected([]);
      } else {
        setSelected(filteredValues);
      }
    };

    const toggleValue = (val: string) => {
      setSelected(prev =>
        prev.includes(val)
          ? prev.filter(x => x !== val)
          : [...prev, val]
      );
    };

    const apply = () => {
      if (selected.length > 0) {
        handleOnChange(selected);
      } else {
        handleOnChange(undefined);
      }
      setIsOpen(false);
      setSearch("");
    };

    const displayText = selected.length === 0
      ? "Select values..."
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

    return (
      <div className="relative inline-block w-full">
        {/* Inline Trigger – Perfectly aligned with other inputs */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          <span className="truncate pr-2">{displayText}</span>
          <svg
            className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-popover shadow-xl ring-1 ring-black/5 overflow-hidden">
              {/* Search */}
              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Check All */}
              {filteredValues.length > 0 && (
                <div className="border-b border-border px-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      ref={checkAllRef}
                      checked={isAllChecked}
                      onChange={toggleAll}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground">
                      {isAllChecked ? "Uncheck all" : "Check all"}
                    </span>
                  </label>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredValues.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No options found
                  </div>
                ) : (
                  filteredValues.map((val) => (
                    <label
                      key={val}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent/50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(val)}
                        onChange={() => toggleValue(val)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="truncate">{val || "(empty)"}</span>
                    </label>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-3 flex justify-between items-center bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  {selected.length} selected
                </span>
                <button
                  onClick={apply}
                  className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Default Simple Editors ─────────────────────────────────
  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleOnChange?.(e.target.value || undefined);
  };

  if (fieldData?.dataType === "boolean") {
    return (
      <StyledSelect {...rest} value={value ?? ""} onChange={handleSimpleChange}>
        <option value="">- any -</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </StyledSelect>
    );
  }

  if (fieldData?.dataType === "date") {
    return (
      <input
        {...cleanProps(rest)}
        type="date"
        value={value ?? ""}
        onChange={handleSimpleChange}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    );
  }

  return (
    <input
      {...cleanProps(rest)}
      type={fieldData?.inputType || "text"}
      value={value ?? ""}
      onChange={handleSimpleChange}
      placeholder="Enter value..."
      className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

// ── Add Filter Button with Flyout (Mixpanel-Style) ─────────────
export const CustomAddRuleAction = ({ handleOnClick, context }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const setPendingField = context?.setPendingField || (() => {});

  const filteredFields = fieldDefinitions.filter((f) =>
    f.label.toLowerCase().includes(search.toLowerCase()) ||
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectField = (fieldName: string) => {
    setPendingField(fieldName);
    handleOnClick();
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Filter
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-3 w-96 rounded-xl border border-border bg-popover shadow-2xl ring-1 ring-black/5">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base font-medium"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {filteredFields.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No properties found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFields.map((field) => (
                    <button
                      key={field.name}
                      type="button"
                      onClick={() => handleSelectField(field.name)}
                      className="w-full px-6 py-3 text-left hover:bg-accent/50 transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-medium text-foreground group-hover:text-foreground">
                          {field.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {field.type}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ── Other Buttons ────────────────────────────────────────────
export const CustomAddGroupAction = ({ handleOnClick }: any) => (
  <button
    onClick={handleOnClick}
    className="rounded-md border border-border px-4 py-1.5 text-sm font-medium hover:bg-muted transition"
  >
    + Group
  </button>
);

export const CustomRemoveRuleAction = ({ handleOnClick }: any) => (
  <button onClick={handleOnClick} className="text-sm text-destructive hover:underline">
    Remove
  </button>
);

export const CustomRemoveGroupAction = CustomRemoveRuleAction;

export const CustomDragHandle = forwardRef<HTMLSpanElement, DragHandleProps>((props, ref) => (
  <span
    ref={ref}
    className="cursor-move select-none px-1 text-muted-foreground hover:text-foreground transition opacity-60 hover:opacity-100"
  >
    ⋮⋮
  </span>
));
CustomDragHandle.displayName = "CustomDragHandle";