import Image from "next/image";
import Link from "next/link";
import { ContentContainer } from "./ContentContainer";
import { ConnectWalletButton } from "./ConnectWalletButton";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 h-[60px] bg-white border-b flex items-center w-full px-3 z-[9999]">
      <ContentContainer className="flex justify-between">
        <div className="flex">
          <Link href="/">
            <Image alt="" src="/logo.svg" width={40} height={40} />
          </Link>
        </div>
        <ConnectWalletButton />
      </ContentContainer>
    </nav>
  );
};
