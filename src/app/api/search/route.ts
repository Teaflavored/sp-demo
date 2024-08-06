import { merge } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SEARCHEABLE_SLUGS = [
  "proof-moonbirds",
  "milady",
  "ens",
  "parallelalpha",
  "lilpudgys",
  "lootproject",
  "mfers",
  "superrare",
  "chromie-squiggle-by-snowfro",
  "cryptoadz-by-gremplin",
  "world-of-women-nft",
  "opepen-edition",
  "0n1-force",
  "rarible",
  "memelandcaptainz",
  "sandbox",
  "degods-eth",
  "beanzofficial",
  "cool-cats-nft",
  "meebits",
  "doodles-official",
  "bored-ape-kennel-club",
  "wrapped-cryptopunks",
  "azuki",
  "clonex",
  "pudgypenguins",
  "otherdeed",
  "cryptopunks",
  "mutant-ape-yacht-club",
  "boredapeyachtclub",
];

const request = z.object({
  query: z.string(),
});

const response = z.object({
  results: z.array(z.string()),
});

const MAX_TO_SHOW = 5;

export type GetResponse = z.infer<typeof response>;

export const GET = async (req: NextRequest) => {
  const { query } = request.parse(
    merge({}, Object.fromEntries(req.nextUrl.searchParams.entries()))
  );

  const results = SEARCHEABLE_SLUGS.filter((slug) =>
    slug.includes(query.toLowerCase())
  ).slice(0, MAX_TO_SHOW);

  return NextResponse.json<GetResponse>(
    {
      results,
    },
    {
      status: 200,
    }
  );
};
