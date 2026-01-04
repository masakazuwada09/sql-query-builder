import { RuleGroupType, RuleType } from "react-querybuilder";
import { User } from "@/data/dummyUsers";

/**
 * Executes a react-querybuilder query against dummy user data.
 * Designed to mimic Mixpanel-style filtering behavior.
 */
export function executeQuery(query: RuleGroupType, data: User[]): User[] {
  if (!query.rules || query.rules.length === 0) {
    return data;
  }

  return data.filter((item) => evaluateGroup(query, item));
}

/* ───────────────── group evaluation ───────────────── */

function evaluateGroup(group: RuleGroupType, item: User): boolean {
  return group.rules.reduce<boolean>((acc, rule) => {
    const result =
      "rules" in rule
        ? evaluateGroup(rule, item)
        : evaluateRule(rule as RuleType, item);

    return group.combinator === "and" ? acc && result : acc || result;
  }, group.combinator === "and");
}

/* ───────────────── rule evaluation ───────────────── */

function evaluateRule(rule: RuleType, item: User): boolean {
  const fieldValue = (item as any)[rule.field];
  const ruleValue = rule.value;

  if (fieldValue == null || ruleValue == null) return false;

  // Normalize values (support multi-select)
  const values = Array.isArray(ruleValue)
    ? ruleValue.map(String)
    : [String(ruleValue)];

  const fieldStr = String(fieldValue).toLowerCase();

  switch (rule.operator) {
    case "=":
    case "==":
      return values.some((v) => fieldStr === v.toLowerCase());

    case "!=":
      return values.every((v) => fieldStr !== v.toLowerCase());

    case "contains":
      return values.some((v) =>
        fieldStr.includes(v.toLowerCase())
      );

    case "beginsWith":
      return values.some((v) =>
        fieldStr.startsWith(v.toLowerCase())
      );

    case "endsWith":
      return values.some((v) =>
        fieldStr.endsWith(v.toLowerCase())
      );

    case ">":
    case ">=":
    case "<":
    case "<=":
      return compareNumbersOrDates(fieldValue, ruleValue, rule.operator);

    default:
      console.warn("Unknown operator:", rule.operator);
      return true;
  }
}

/* ───────────── numeric & date comparison ───────────── */

function compareNumbersOrDates(
  fieldValue: any,
  ruleValue: any,
  operator: string
): boolean {
  const fieldComparable = toComparable(fieldValue);
  const ruleComparable = toComparable(ruleValue);

  if (fieldComparable == null || ruleComparable == null) return false;

  switch (operator) {
    case ">":
      return fieldComparable > ruleComparable;
    case ">=":
      return fieldComparable >= ruleComparable;
    case "<":
      return fieldComparable < ruleComparable;
    case "<=":
      return fieldComparable <= ruleComparable;
    default:
      return false;
  }
}

/**
 * Converts numbers or date strings into comparable numbers.
 */
function toComparable(value: any): number | null {
  if (typeof value === "number") return value;

  const date = Date.parse(value);
  if (!isNaN(date)) return date;

  const num = Number(value);
  return isNaN(num) ? null : num;
}

/* ───────────────── SQL preview ───────────────── */

/**
 * Converts a RuleGroupType query to a SQL string (Postgres-style).
 * Used only for preview/debugging.
 */
export function queryToSQL(query: RuleGroupType): string {
  if (!query.rules || query.rules.length === 0) {
    return "SELECT * FROM users;";
  }

  const buildSQL = (group: RuleGroupType): string =>
    group.rules
      .map((rule) => {
        if ("rules" in rule) return `(${buildSQL(rule)})`;

        if (Array.isArray(rule.value)) {
          return `${rule.field} IN (${rule.value
            .map((v) => `'${v}'`)
            .join(", ")})`;
        }

        const value =
          typeof rule.value === "string" ? `'${rule.value}'` : rule.value;

        return `${rule.field} ${rule.operator} ${value}`;
      })
      .join(` ${group.combinator.toUpperCase()} `);

  return `SELECT * FROM users WHERE ${buildSQL(query)};`;
}
