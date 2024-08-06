import { useAccount } from "wagmi";
import { ConnectWalletButton } from "./ConnectWalletButton";

export const DemoBuySection = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <ConnectWalletButton />
      </div>
    );
  }

  return <div>DemoBuySection</div>;
};
