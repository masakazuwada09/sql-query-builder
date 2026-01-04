"use client";

import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import { QueryBuilder } from "react-querybuilder";
import type { QueryBuilderProps } from "react-querybuilder";

const QueryBuilderWrapper = (props: any) => {
  return (
    <QueryBuilderDnD>
      <QueryBuilder {...props} />
    </QueryBuilderDnD>
  );
};

export default QueryBuilderWrapper;