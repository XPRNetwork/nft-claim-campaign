'use client';
import { HTMLAttributes, ReactNode, useCallback, useState } from "react"
import { useXpr } from "../xpr-provider";
import project from "./../../../project.json";

type XprSessionProps = HTMLAttributes<HTMLDivElement> & {
  defaultComponent?:ReactNode
}
export const XprButton: React.FunctionComponent<XprSessionProps> = ({className, defaultComponent, children, ...rest }) => {
  
  const {signIn,session} = useXpr()

  const connectWallet = useCallback(() => {
    
    signIn()

  }, [signIn])
    
  return (
    (session ? (
     children
    ) : (
      <button onClick={()=>connectWallet()} className={`btn btn-primary ${className}`}>
          <p>{ project.wallet["connect-button"]}</p>
      </button>
    ) )
  )
}