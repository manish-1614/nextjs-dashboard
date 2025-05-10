import { Suspense } from "react";
import Heart from "../ui/heart";
import { HeartSkeleton } from "../ui/skeletons";

 
export default async function Page() {

  return (
    <main>
        <Suspense fallback={<HeartSkeleton/>}>
            <Heart/>
        </Suspense>
    </main>
  );
}