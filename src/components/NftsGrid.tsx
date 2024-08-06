"use client";

import type { GetResponse } from "@/app/api/nfts/route";
import { api } from "@/lib/client/api";
import type { Nft } from "@/lib/server/opensea";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  slug: string;
};

export const NftsGrid = ({ slug }: Props) => {
  const [nfts, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get<GetResponse>(`/nfts?slug=${slug}`);

      setNfts(response.nfts);
    };

    fetchData();
  }, [slug]);

  return (
    <div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {nfts.map((nft) => {
          const imageUrl = nft.display_image_url || nft.image_url;

          return (
            <li key={nft.identifier} className="w-full">
              <div className="aspect-square relative">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={nft.name}
                    layout="fill"
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-ellipsis overflow-hidden">
                {nft.name || `#${nft.identifier}`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
