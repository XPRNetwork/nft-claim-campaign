'use client'
import React, { createContext, useState, useCallback, useContext, ReactNode } from "react";
import ConnectWallet, {LinkSession} from "@proton/web-sdk";

export interface IXprSessionContext {
  loading: boolean;
  session?: LinkSession;
  signIn: () => Promise<LinkSession | undefined>;
  signOut: () => void;
}

const XprSessionContext = createContext<IXprSessionContext | null>(null);

export default function XprProvider({children}:{children:ReactNode}) {
  const [session, setSession] = useState<LinkSession>();
  const [loading, setLoading] = useState(true);


  const value: IXprSessionContext = React.useMemo(
    () => {
      async function signIn(): Promise<LinkSession | undefined> {
        const {link,session} = await ConnectWallet({
          linkOptions: {
            endpoints: process.env.NEXT_PUBLIC_CHAIN_ENDPOINTS!.split(","),
          },
          selectorOptions: {
            appName: process.env.NEXT_PUBLIC_PROTON_APP_NAME,
          },
          transportOptions: {
            requestAccount: process.env.NEXT_PUBLIC_PROTON_REQUEST_ACCOUNT,
          },
        });

        setSession(session);
        return session;
      }
    
      const signOut = async () => { };
      
      return { loading, session, signIn, signOut }
    },
    [loading, session]
  );

  return <XprSessionContext.Provider value={value}>{children}</XprSessionContext.Provider>;
}

export function useXpr(): IXprSessionContext {
  const context = useContext(XprSessionContext);

  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context as IXprSessionContext;
}
