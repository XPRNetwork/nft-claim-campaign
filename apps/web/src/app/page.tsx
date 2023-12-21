import {fetchClaimables} from "@/services/chain/claimable";
import { ClaimablesList } from "@/components/claim/claimables-list";
import project from "./../project.json";

async function fetchClaimablesItems() {
  return fetchClaimables();
}

export default async function Home() {
  const claimables = await fetchClaimablesItems();

  return (
    <main className="items-center justify-between grid grid-cols-1 gap-4">
      <div className="hero h-96 bg-primary rounded-lg">
        <div className="hero-content text-center">
            <h1 className="text-9xl font-bold">{ project.title}</h1>
        </div>
      </div>
      <ClaimablesList
        claimables={claimables}
        className="grid grid-cols-3 gap-4"
      ></ClaimablesList>
    </main>
  );
}
