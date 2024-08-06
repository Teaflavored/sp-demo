import { getNfts, Nft } from "@/lib/server/opensea";
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
  nfts: Nft[];
};

export const GET = async (req: NextRequest) => {
  const {
    slug,
    limit,
    next: previousNext,
  } = request.parse(
    merge({}, Object.fromEntries(req.nextUrl.searchParams.entries()))
  );

  const { next, nfts } = await getNfts({ slug, limit, next: previousNext });

  return NextResponse.json<GetResponse>({ next, nfts }, { status: 200 });
};
