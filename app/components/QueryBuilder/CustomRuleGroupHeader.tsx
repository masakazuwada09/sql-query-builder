"use client";

import React from "react";

const CustomRuleGroupHeader = ({ path }: { path: number[] }) => {
  // Hide header completely for the root group (path.length === 1)
  if (path.length === 1) {
    return null;
  }

  // For nested groups, you can show minimal header if desired
  return <div className="flex items-center gap-2 py-1"></div>;
};

export default CustomRuleGroupHeader;