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

const configs: Record<
  string,
  {
    collectionName: string;
    collectionSlug: string;
    collectionImage: string;
  }
> = {
  "proof-moonbirds": {
    collectionName: "Proof Moonbirds",
    collectionSlug: "proof-moonbirds",
    collectionImage: "",
  },
  milady: {
    collectionName: "Milady",
    collectionSlug: "milady",
    collectionImage: "",
  },
  ens: {
    collectionName: "ENS",
    collectionSlug: "ens",
    collectionImage: "",
  },
  parallelalpha: {
    collectionName: "Parallel Alpha",
    collectionSlug: "parallelalpha",
    collectionImage: "",
  },
  lilpudgys: {
    collectionName: "Lil Pudgys",
    collectionSlug: "lilpudgys",
    collectionImage: "",
  },
  lootproject: {
    collectionName: "Loot Project",
    collectionSlug: "lootproject",
    collectionImage: "",
  },
  mfers: {
    collectionName: "MFers",
    collectionSlug: "mfers",
    collectionImage: "",
  },
  superrare: {
    collectionName: "SuperRare",
    collectionSlug: "superrare",
    collectionImage: "",
  },
  "chromie-squiggle-by-snowfro": {
    collectionName: "Chromie Squiggle by Snowfro",
    collectionSlug: "chromie-squiggle-by-snowfro",
    collectionImage: "",
  },
  "cryptoadz-by-gremplin": {
    collectionName: "CryptoAdz by Gremplin",
    collectionSlug: "cryptoadz-by-gremplin",
    collectionImage: "",
  },
  "world-of-women-nft": {
    collectionName: "World of Women NFT",
    collectionSlug: "world-of-women-nft",
    collectionImage: "",
  },
  "opepen-edition": {
    collectionName: "Opepen Edition",
    collectionSlug: "opepen-edition",
    collectionImage: "",
  },
  "0n1-force": {
    collectionName: "0N1 Force",
    collectionSlug: "0n1-force",
    collectionImage: "",
  },
  rarible: {
    collectionName: "Rarible",
    collectionSlug: "rarible",
    collectionImage: "",
  },
  memelandcaptainz: {
    collectionName: "Memeland Captainz",
    collectionSlug: "memelandcaptainz",
    collectionImage: "",
  },
  sandbox: {
    collectionName: "Sandbox",
    collectionSlug: "sandbox",
    collectionImage: "",
  },
  "degods-eth": {
    collectionName: "DeGods ETH",
    collectionSlug: "degods-eth",
    collectionImage: "",
  },
  beanzofficial: {
    collectionName: "Beanz Official",
    collectionSlug: "beanzofficial",
    collectionImage: "",
  },
  "cool-cats-nft": {
    collectionName: "Cool Cats NFT",
    collectionSlug: "cool-cats-nft",
    collectionImage: "",
  },
  meebits: {
    collectionName: "Meebits",
    collectionSlug: "meebits",
    collectionImage: "",
  },
  "doodles-official": {
    collectionName: "Doodles Official",
    collectionSlug: "doodles-official",
    collectionImage: "",
  },
  "bored-ape-kennel-club": {
    collectionName: "Bored Ape Kennel Club",
    collectionSlug: "bored-ape-kennel-club",
    collectionImage: "",
  },
  "wrapped-cryptopunks": {
    collectionName: "Wrapped CryptoPunks",
    collectionSlug: "wrapped-cryptopunks",
    collectionImage: "",
  },
  azuki: {
    collectionName: "Azuki",
    collectionSlug: "azuki",
    collectionImage: "",
  },
  clonex: {
    collectionName: "CloneX",
    collectionSlug: "clonex",
    collectionImage: "",
  },
  pudgypenguins: {
    collectionName: "Pudgy Penguins",
    collectionSlug: "pudgypenguins",
    collectionImage: "",
  },
  otherdeed: {
    collectionName: "OtherDeed",
    collectionSlug: "otherdeed",
    collectionImage: "",
  },
  cryptopunks: {
    collectionName: "CryptoPunks",
    collectionSlug: "cryptopunks",
    collectionImage: "",
  },
  "mutant-ape-yacht-club": {
    collectionName: "Mutant Ape Yacht Club",
    collectionSlug: "mutant-ape-yacht-club",
    collectionImage: "",
  },
  boredapeyachtclub: {
    collectionName: "Bored Ape Yacht Club",
    collectionSlug: "boredapeyachtclub",
    collectionImage: "",
  },
};

const request = z.object({
  query: z.string(),
});

const response = z.object({
  results: z.array(
    z.object({
      collectionName: z.string(),
      collectionSlug: z.string(),
      collectionImage: z.string(),
    })
  ),
});

const MAX_TO_SHOW = 5;

export type GetResponse = z.infer<typeof response>;

export const GET = async (req: NextRequest) => {
  const { query } = request.parse(
    merge({}, Object.fromEntries(req.nextUrl.searchParams.entries()))
  );

  const results = SEARCHEABLE_SLUGS.filter(
    (slug) =>
      slug.includes(query.toLowerCase()) ||
      configs[slug].collectionName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, MAX_TO_SHOW);

  return NextResponse.json<GetResponse>(
    {
      results: results.map((slug) => configs[slug]),
    },
    {
      status: 200,
    }
  );
};
