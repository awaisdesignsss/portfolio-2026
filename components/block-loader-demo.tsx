"use client";

import React from "react";
import BlockLoader from "@/components/ui/block-loader";

const BlockLoaderDemo = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <BlockLoader
        blockColor="bg-blue-500 dark:bg-blue-400"
        borderColor="border-blue-500 dark:border-blue-400"
        size={80}
        gap={6}
        speed={1.2}
      />
    </div>
  );
};

export default BlockLoaderDemo;
