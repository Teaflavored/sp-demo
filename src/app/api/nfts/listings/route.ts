import {
  attemptFulfill,
  getListingsByCollection,
  getNftInfo,
  Listing,
  NftWithOwner,
} from "@/lib/server/opensea";
import { merge } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const request = z.object({
  slug: z.string(),
  limit: z.number().optional(),
  next: z.string().optional(),
});

export type GetResponse = {
  next: string | null;
  listings: Listing[];
  nfts: NftWithOwner[];
};

export const GET = async (req: NextRequest) => {
  const {
    slug,
    limit,
    next: previousNext,
  } = request.parse(
    merge({}, Object.fromEntries(req.nextUrl.searchParams.entries()))
  );

  const { next, listings } = await getListingsByCollection({
    slug,
    limit: 1,
  });

  // Fetch nft info for listings
  const nftsWithOwners = await Promise.all(
    listings.map(async (listing) => {
      console.log({
        address: listing.protocol_data.parameters.offer[0].token,
        chain: listing.chain,
        identifier:
          listing.protocol_data.parameters.offer[0].identifierOrCriteria,
      });

      const nft = await getNftInfo({
        address: listing.protocol_data.parameters.offer[0].token,
        chain: listing.chain,
        identifier:
          listing.protocol_data.parameters.offer[0].identifierOrCriteria,
      });

      return nft.nft;
    })
  );

  return NextResponse.json<GetResponse>(
    {
      next,
      listings: listings.filter(Boolean),
      nfts: nftsWithOwners.filter(Boolean),
    },
    { status: 200 }
  );
};

const postRequest = z.object({
  fulfiller: z.string(),
  hash: z.string(),
  chain: z.string(),
  protocol_address: z.string(),
});

export type PostRequest = z.infer<typeof postRequest>;
export type PostResponse = {
  fulfillment_data: {
    transaction: {
      function: string;
      chain: number;
      to: string;
      value: number;
      input_data: any;
    };
  };
};

export const POST = async (req: NextRequest) => {
  const { fulfiller, hash, chain, protocol_address } = postRequest.parse(
    await req.json()
  );

  const response = await attemptFulfill({
    fulfiller,
    hash,
    chain,
    protocol_address,
  });

  return NextResponse.json<PostResponse>(response, { status: 200 });
};
