"use client";
import {HTMLAttributes, ReactNode, useState} from "react";
import { useXpr } from "../xpr-provider";
import project from "./../../../project.json";

type XprSessionProps = HTMLAttributes<HTMLDivElement> & {
  defaultComponent?: ReactNode;
};
export const XprSession: React.FunctionComponent<XprSessionProps> = ({
  className,
  defaultComponent,
  children,
  ...rest
}) => {
  const {session} = useXpr();

  return (
    <details className="dropdown">
      <summary className="m-1 btn">
        Logged as {session?.auth.actor.toString()}
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        <li>
          <button className="btn btn-primary">{ project.wallet["logout-button"]}</button>
        </li>
      </ul>
    </details>
  );
};
