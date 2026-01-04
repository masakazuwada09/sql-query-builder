"use client";

import dynamic from "next/dynamic";
import type { QueryBuilderProps, RuleGroupTypeAny, FullField, FullOperator, FullCombinator } from "react-querybuilder";

// Dynamically import QueryBuilder for Next.js SSR
const DynamicQueryBuilder = dynamic<
  Partial<QueryBuilderProps<RuleGroupTypeAny, FullField, FullOperator, FullCombinator>>
>(
  () => import("react-querybuilder").then((mod) => mod.QueryBuilder || mod.default),
  { ssr: false }
);

export default DynamicQueryBuilder;
