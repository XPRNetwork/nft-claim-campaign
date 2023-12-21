import {Api, JsonRpc} from "@proton/js";
import {TimedTemplate} from "@/interfaces/timed-template";
import {Claimable} from "@/interfaces/claimable";
import { ExplorerApi } from "atomicassets";
import { ITemplate } from "atomicassets/build/API/Explorer/Objects";

const json = new JsonRpc(
  process.env.NEXT_PUBLIC_CHAIN_ENDPOINTS?.split(",")!
);

const api = new Api({
  rpc: json,
});

export async function fetchClaimables(): Promise<
  TimedTemplate[] |  undefined
> {

  const aaApi = new ExplorerApi(process.env.ATOMIC_ENDPOINT!, "atomicassets", { fetch: fetch as any, });

  const apiResult = await api.rpc.get_table_rows({
    json: true,
    code: "12daysb4xmas",
    scope: "12daysb4xmas",
    table: "claimables",
    limit: 100,
  });

  const templateIds = apiResult.rows.map(row => {
    return row.templateId;
  });

  const claimables = apiResult.rows.map(row => {
    return row as Claimable;
  });

  const templates = await aaApi.getTemplates({ids: templateIds.join(",")});
  const timedTemplates: TimedTemplate[] = templates.reduce(
    (prev: TimedTemplate[], current: ITemplate) => {
      const foundClaimable = claimables.find(
        claimable => claimable.templateId.toString() == current.template_id
      );
      if (foundClaimable)
        prev.push({
          ...current,
          activeStartTime: foundClaimable.activeStartTime,
          activeEndTime: foundClaimable.activeEndTime,
        });
      return prev;
    },
    []
  );

  return timedTemplates.sort((a,b)=>parseInt(a.activeStartTime) - parseInt(b.activeStartTime));
}

export async function fetchClaimable(templateId:string): Promise<
  TimedTemplate |  undefined
> {
  

  const aaApi = new ExplorerApi(process.env.ATOMIC_ENDPOINT!, "atomicassets", { fetch: fetch as any, });

  const apiResult = await api.rpc.get_table_rows({
    json: true,
    code: "12daysb4xmas",
    scope: "12daysb4xmas",
    table: "claimables",
    upper_bound:templateId,
    lower_bound:templateId,
    limit: 100,
  });

  const templateIds = apiResult.rows.map(row => {
    return row.templateId;
  });

  const claimables = apiResult.rows.map(row => {
    return row as Claimable;
  });

  const templates = await aaApi.getTemplates({ids: templateId});
  const timedTemplates: TimedTemplate[] = templates.reduce(
    (prev: TimedTemplate[], current: ITemplate) => {
      const foundClaimable = claimables.find(
        claimable => claimable.templateId.toString() == current.template_id
      );
      if (foundClaimable)
        prev.push({
          ...current,
          activeStartTime: foundClaimable.activeStartTime,
          activeEndTime: foundClaimable.activeEndTime,
        });
      return prev;
    },
    []
  );

  return timedTemplates[0] || undefined;
}
