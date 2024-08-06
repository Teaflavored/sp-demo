"use client";

import type { GetResponse } from "@/app/api/nfts/route";
import { api } from "@/lib/client/api";
import type { Nft } from "@/lib/server/opensea";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  slug: string;
};

export const NftsGrid = ({ slug }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["nfts"],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        params.set("slug", slug);

        if (pageParam) {
          params.set("next", pageParam);
        }

        return await api.get<GetResponse>(`/nfts?${params.toString()}`);
      },
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.next,
    });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {(data?.pages.flatMap((page) => page.nfts) || []).map((nft) => {
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
              <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                {nft.name || `#${nft.identifier}`}
              </p>
            </li>
          );
        })}
      </ul>
      <span ref={ref} />
    </div>
  );
};
