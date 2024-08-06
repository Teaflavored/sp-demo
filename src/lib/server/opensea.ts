import "server-only";

const sharedHeaders = {
  accept: "application/json",
  "Content-Type": "application/json",
  // NOTE: This should be stored as a secure env var on prod
  "x-api-key": "458ed85edccd4bdab1e94fc871d66a6b",
};

export type CollectionInfo = {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  total_supply: number;
};

export type Nft = {
  collection: string;
  contract: string;
  description: string | null;
  display_animation_url: string | null;
  image_url: string | null;
  identifier: string;
  name: string;
  token_standard: string;
  opensea_url: string;
};

export const getCollectionInfo = async (
  slug: string
): Promise<CollectionInfo> => {
  const options = {
    method: "GET",
    headers: sharedHeaders,
  };

  const data = await fetch(
    `https://api.opensea.io/api/v2/collections/${slug}`,
    options
  );

  return data.json();
};

export const getNfts = async ({
  slug,
  limit,
  next,
}: {
  slug: string;
  limit?: number;
  next?: string;
}): Promise<{
  next: string | null;
  nfts: Nft[];
}> => {
  const options = {
    method: "GET",
    headers: sharedHeaders,
  };

  const url = new URL(`https://api.opensea.io/api/v2/collection/${slug}/nfts`);

  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  if (next) {
    url.searchParams.append("next", next);
  }

  const data = await fetch(url.toString(), options);

  const _data = await data.json();

  return {
    next: _data.next || null,
    nfts: _data.nfts,
  };
};
