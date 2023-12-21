import {TimedTemplate} from "@/interfaces/timed-template";
import {HTMLAttributes} from "react";
import {ClaimableItemRenderer} from "./claimable-item-renderer";

type ClaimablesListProps = HTMLAttributes<HTMLDivElement> & {
  claimables?: TimedTemplate[];
};

export const ClaimablesList: React.FunctionComponent<ClaimablesListProps> = ({
  claimables,
  ...rest
}) => {
  if (!claimables) return <>No Claimable asset</>;
  return (
    <div {...rest}>
      {claimables.map((claimable, index) => {
        return <ClaimableItemRenderer claimable={claimable} key={index} />;
      })}
    </div>
  );
};
