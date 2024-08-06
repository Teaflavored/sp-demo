"use client";

import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import { truncateAddress } from "@/lib/shared/strings";
import { useDisconnect } from "wagmi";

export const ConnectWalletButton = () => {
  const { disconnect } = useDisconnect();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        if (isConnected && address) {
          return (
            <Button onClick={() => disconnect()}>
              {truncateAddress(address)} | Disconnect
            </Button>
          );
        }

        return <Button onClick={show}>Connect Wallet</Button>;
      }}
    </ConnectKitButton.Custom>
  );
};
