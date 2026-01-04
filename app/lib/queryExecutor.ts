// app/lib/queryExecutor.ts
import { RuleGroupType } from "react-querybuilder";
import { User } from "@/data/dummyUsers";

/**
 * Simple executor that evaluates RuleGroupType queries
 * against dummy user data
 */
// app/lib/queryExecutor.ts
export function executeQuery(query: RuleGroupType, data: User[]): User[] {
  console.log("Executing query:", JSON.stringify(query, null, 2));
  console.log("Original data count:", data.length);

  if (!query.rules || query.rules.length === 0) {
    console.log("No rules -> returning all users");
    return data;
  }

  const evaluateGroup = (group: RuleGroupType, item: User): boolean => {
    return group.rules.reduce((acc, rule) => {
      if ("rules" in rule) {
        const res = evaluateGroup(rule, item);
        return group.combinator === "and" ? acc && res : acc || res;
      } else {
        const fieldValue = (item as any)[rule.field];
        const value = rule.value;
        let result = true;

        switch (rule.operator) {
          case "=":
          case "==":
            result = fieldValue == value; break;
          case "!=":
            result = fieldValue != value; break;
          case ">":
            result = fieldValue > value; break;
          case "<":
            result = fieldValue < value; break;
          case ">=":
            result = fieldValue >= value; break;
          case "<=":
            result = fieldValue <= value; break;
          case "contains":
            result = String(fieldValue).includes(String(value)); break;
          case "beginsWith":
            result = String(fieldValue).startsWith(String(value)); break;
          case "endsWith":
            result = String(fieldValue).endsWith(String(value)); break;
          default:
            console.warn("Unknown operator:", rule.operator);
            result = true;
        }

        console.log(`Evaluating rule: ${rule.field} ${rule.operator} ${rule.value}`, "=>", result);
        return group.combinator === "and" ? acc && result : acc || result;
      }
    }, group.combinator === "and" ? true : false);
  };

  const filtered = data.filter((item) => evaluateGroup(query, item));
  console.log("Filtered users:", filtered.map(u => u.name));
  return filtered;
}


/**
 * Converts a query to SQL string
 */
export function queryToSQL(query: RuleGroupType): string {
  if (!query.rules || query.rules.length === 0) return "SELECT * FROM users";

  const buildSQL = (group: RuleGroupType): string => {
    return group.rules
      .map((rule) => {
        if ("rules" in rule) return `(${buildSQL(rule)})`;
        const value = typeof rule.value === "string" ? `'${rule.value}'` : rule.value;
        return `${rule.field} ${rule.operator} ${value}`;
      })
      .join(` ${group.combinator.toUpperCase()} `);
  };

  return `SELECT * FROM users WHERE ${buildSQL(query)};`;
}
