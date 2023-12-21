import {TimedTemplate} from "@/interfaces/timed-template";
import {isActiveRightNow, isIncoming, isPast} from "@/utils/timed-template";
import classNames from "classnames";
import dayjs from "dayjs";
import Link from "next/link";
import { HTMLAttributes, useMemo } from "react";
import project from "./../../project.json";

type ClaimableItemRendererProps = HTMLAttributes<HTMLDivElement> & {
  claimable: TimedTemplate;
};
export const ClaimableItemRenderer: React.FunctionComponent<
  ClaimableItemRendererProps
> = ({claimable, className, ...rest}) => {
  
  const cssClasses = classNames({
    "bg-base-200": !isActiveRightNow(
      parseInt(claimable.activeStartTime),
      parseInt(claimable.activeEndTime)
    ),
    "text-neutral-content": !isActiveRightNow(
      parseInt(claimable.activeStartTime),
      parseInt(claimable.activeEndTime)
    ),
    "bg-primary": isActiveRightNow(
      parseInt(claimable.activeStartTime),
      parseInt(claimable.activeEndTime)
    ),
    "text-white": isActiveRightNow(
      parseInt(claimable.activeStartTime),
      parseInt(claimable.activeEndTime)
    ),
    "opacity-30": isPast(parseInt(claimable.activeEndTime)),
  });

  return (
    <div className={`card rounded-lg  ${cssClasses} ${className}`} {...rest}>
      <div className="card-body items-start p-4">
        <h2 className="card-title text-base-content">{claimable.immutable_data.name}</h2>
        <p className="text-base-content">{claimable?.immutable_data.description}</p>
        {isActiveRightNow(parseInt(claimable.activeStartTime),parseInt(claimable.activeEndTime)) && (
          <Link href={`/${claimable.template_id}`} className="card-actions w-full">
            <button className="btn bg-base-100 w-full">{ project.claimable.list["active-claim-button-label"] }</button>
          </Link>
        )}
        {isIncoming(parseInt(claimable.activeStartTime)) && (
          <div className="card-actions w-full flex justify-center items-center h-12">
            <p className="text-sm text-center text-base-content">
              { project.claimable.list["incoming-claim-button-label"] }{" "}
              {dayjs(parseInt(claimable.activeStartTime)).format(project['date-format'])}
            </p>
          </div>
        )}
        {isPast(parseInt(claimable.activeEndTime)) && (
          <div className="card-actions w-full flex justify-center items-center h-12">
            <p className="text-sm text-center text-base-content">
              {project.claimable.list["missed-claim-label"]}
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
};
