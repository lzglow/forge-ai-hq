import { Suspense } from "react";
import { ResultsClient } from "./results-client";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your results…</div>}>
      <ResultsClient />
    </Suspense>
  );
}
