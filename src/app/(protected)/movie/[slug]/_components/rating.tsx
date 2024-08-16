"use client";

import { Icons } from "@/components/icons";

export function Rating() {
  return (
    <div className="flex grow items-center justify-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Icons.star
          key={index + 1}
          strokeWidth={1}
          onClick={}
          className={`${true ? "fill-primary/25" : "fill-primary"} cursor-pointer hover:scale-110`}
          size={40}
        />
      ))}
    </div>
  );
}
