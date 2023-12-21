"use client";
import {HTMLAttributes, useCallback} from "react";
import {TimedTemplate} from "@/interfaces/timed-template";
import Image from "next/image";
import {XprButton} from "@/components/xpr/xpr-button";
import {useXpr} from "@/components/xpr/xpr-provider";
import {generateMintAction} from "@/utils/actions";
import {isActiveRightNow, isIncoming, isPast} from "@/utils/timed-template";
import dayjs from "dayjs";
import project from "./../../project.json";

type ClaimableDetailsProps = HTMLAttributes<HTMLDivElement> & {
  claimable?: TimedTemplate;
  ipfsResolver: string;
};
export const ClaimableDetails: React.FunctionComponent<
  ClaimableDetailsProps
> = ({claimable, ipfsResolver, className, ...rest}) => {
  const {session} = useXpr();
  const openSuccessDialog = useCallback(() => {
    if (document) {
      const modal = document.getElementById("my_modal_1");
      if (modal) {
        (modal as HTMLFormElement).showModal();
      }
    }
  }, []);

  const claimActionTransact = useCallback(() => {
    if (!session) return;
    const actions = [
      generateMintAction(
        session?.auth.actor.toString()!,
        process.env.NEXT_PUBLIC_PROTON_REQUEST_ACCOUNT!
      ),
    ];
    session.transact({actions: actions}).then(res => {
      if (res.processed && res.processed.id) {
        openSuccessDialog();
      }
      console.log(res);
    });
  }, [openSuccessDialog, session]);

  if (!claimable) return <>No NFT</>;
  return (
    <div className={`grid grid-cols-2 gap-16`}>
      <div className="card bg-base-200 relative flex justify-center items-center p-8 rounded-lg">
        <Image
          className="aspect-square"
          alt={claimable.immutable_data.image}
          width={1280}
          height={1280}
          src={`${ipfsResolver}/${claimable.immutable_data.image}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 content-center items-start justify-items-start ">
        <h2 className="text-2xl text-base-content">
          {claimable.collection.collection_name}
        </h2>
        <h1 className="text-5xl text-base-content font-bold">{claimable.immutable_data.name}</h1>
        {isActiveRightNow(
          parseInt(claimable.activeStartTime),
          parseInt(claimable.activeEndTime)
        ) && <div className="badge badge-primary">Active</div>}
        {isIncoming(parseInt(claimable.activeStartTime)) && (
          <div className="badge badge-warning">
            { project.claimable.details["incoming-claim-badge"]}{" "}
            {dayjs(parseInt(claimable.activeStartTime)).format(project['date-format'])}
          </div>
        )}
        {isPast(parseInt(claimable.activeEndTime)) && (
          <div className="badge badge-error">
            { project.claimable.details["missed-claim-label"]}
          </div>
        )}
        <p className="leading-6 text-base-content">{claimable.immutable_data.description}</p>
        {isActiveRightNow(
          parseInt(claimable.activeStartTime),
          parseInt(claimable.activeEndTime)
        ) &&  
        <XprButton>
          <button
            onClick={() => claimActionTransact()}
            className="btn btn-primary"
          >
            { project.claimable.details["active-claim-button-label"]} {claimable.immutable_data.name}
          </button>
          </XprButton>
        }
        {isIncoming(
          parseInt(claimable.activeStartTime)
        ) && 
        <button
        onClick={() => claimActionTransact()}
            className="btn btn-primary"
            disabled
      >
        { project.claimable.details["incoming-claim-button-label"]}
      </button>
        }
      </div>
      <dialog id="my_modal_1" className="modal overflow-visible">
        <div
          className="modal-box grid grid-cols-1 gap-4 overflow-visible"
          style={{justifyItems: "center"}}
        >
          <div className="rounded-full flex aspect-square" style={{marginTop:"-4em"}}>
            <div className="w-24 rounded-full bg-primary content-center flex flex-wrap justify-center">
              <p className="text-7xl">🤘</p>
          </div>
        </div>
          <h3 className="text-2xl font-bold text-center">{ project.claimable.modal.title}</h3>
          <p className="py-4 text-center">
            { project.claimable.modal.content}
          </p>
          <div className="modal-action w-full">
            <form method="dialog" className="w-full">
              <button className="btn btn-primary w-full rounded-full pl-0 h-auto font-dm-display ">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
