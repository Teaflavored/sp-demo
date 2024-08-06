"use client";

import type { GetResponse } from "@/app/api/nfts/route";
import { api } from "@/lib/client/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { times } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "./ui/skeleton";

type Props = {
  slug: string;
};

export const NftsGrid = ({ slug }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchedAfterMount,
  } = useInfiniteQuery({
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
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {!isFetchedAfterMount && (
          <>
            {times(20).map((_, idx) => {
              return <SkeletonNft key={idx} />;
            })}
          </>
        )}
        {isFetchedAfterMount &&
          (data?.pages.flatMap((page) => page.nfts) || []).map((nft) => {
            const imageUrl = nft.display_image_url || nft.image_url;

            return (
              <li key={nft.identifier} className="w-full">
                <Link href={nft.opensea_url} target="_blank">
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
                </Link>
                <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {nft.name || `#${nft.identifier}`}
                </p>
              </li>
            );
          })}
        {isFetchingNextPage && (
          <>
            {times(20).map((_, idx) => {
              return <SkeletonNft key={idx} />;
            })}
          </>
        )}
      </ul>
      <span ref={ref} />
    </div>
  );
};

const SkeletonNft = () => {
  return (
    <li className="w-full">
      <Skeleton className="aspect-square" />
      <div className="h-[24px] flex items-center">
        <Skeleton className="w-[70%] h-4" />
      </div>
    </li>
  );
};
