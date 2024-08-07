"use client";

import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client/api";
import { ethers } from "ethers";
import type {
  GetResponse,
  PostRequest,
  PostResponse,
} from "@/app/api/nfts/listings/route";
import Image from "next/image";
import { Button } from "./ui/button";
import { Address, formatEther, Hex, zeroAddress } from "viem";
import { truncateAddress } from "@/lib/shared/strings";
import Link from "next/link";
import { seaport } from "@/lib/abis/seaport";
import { useToast } from "./ui/use-toast";

type Props = {
  slug: string;
};

export const DemoBuySection = ({ slug }: Props) => {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { toast } = useToast();

  const { data, isFetched, isFetching } = useQuery({
    queryKey: ["demoBuySection"],
    queryFn: async () => {
      return api.get<GetResponse>(`/nfts/listings?slug=${slug}`);
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["demoBuySectionBuy"],
    mutationFn: async ({
      hash,
      protocolAddress,
      chain,
    }: {
      hash: string;
      protocolAddress: string;
      chain: string;
    }) => {
      return api.post<PostRequest, PostResponse>(`/nfts/listings`, {
        fulfiller: address || zeroAddress,
        hash,
        protocol_address: protocolAddress,
        chain,
      });
    },
  });

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <ConnectWalletButton />
      </div>
    );
  }

  if (!isFetched && isFetching) {
    return <div>Loading...</div>;
  }

  const nft = data?.nfts[0];
  const listing = data?.listings[0];

  if (!nft || !listing) {
    return <div>No listings found.</div>;
  }

  const imageUrl = nft.display_image_url || nft.image_url;
  const price = listing.price.current.value;
  const owner = nft.owners[0].address;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[240px]">
        <Link href={nft.opensea_url} target="_blank">
          <div className="relative aspect-square">
            {imageUrl && <Image alt="" fill src={imageUrl} unoptimized />}
          </div>
        </Link>
        <div>{nft.name || `# ${nft.identifier}`}</div>
        {owner && (
          <Link
            href={`https://opensea.io/${owner}`}
            target="_blank"
            className="underline text-blue-400"
          >
            Owner: {truncateAddress(owner)}
          </Link>
        )}
        <div>Price: {formatEther(BigInt(price))} ETH</div>
        <Button
          className="w-full"
          onClick={async () => {
            const data = await mutateAsync({
              hash: listing.order_hash,
              protocolAddress: listing.protocol_address,
              chain: listing.chain,
            });

            const spInterface = new ethers.Interface(seaport);
            const func = spInterface.getFunction(
              data.fulfillment_data.transaction.function
            );

            if (func && address) {
              const encodedData = spInterface.encodeFunctionData(
                func,
                Object.values(data.fulfillment_data.transaction.input_data)
              );

              const tx = {
                to: data.fulfillment_data.transaction.to as Address,
                from: address as Address,
                value: BigInt(data.fulfillment_data.transaction.value),
                data: encodedData as Hex,
              };

              try {
                await sendTransactionAsync(tx);
              } catch (e: any) {
                console.error(e);

                if (e.message.includes("exceeds the balance of the account")) {
                  toast({
                    title: "Not enough funds",
                    variant: "destructive",
                  });
                } else if (e.message.includes("User rejected the request")) {
                  toast({
                    title: "Transaction rejected",
                    variant: "destructive",
                  });
                }
              }
            }
          }}
        >
          Buy
        </Button>
      </div>
    </div>
  );
};
