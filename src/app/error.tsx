"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="absolute h-[80%] w-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl text-destructive-foreground">{error.message}</h2>
      <Button
        variant={"destructive"}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Réessayer
      </Button>
    </div>
  );
}
