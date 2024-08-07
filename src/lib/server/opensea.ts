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
  twitter_username: string;
  opensea_url: string;
  created_date: string;
  contracts: Array<{
    address: string;
    chain: string;
  }>;
};

export type Nft = {
  collection: string;
  contract: string;
  description: string | null;
  display_image_url: string | null;
  display_animation_url: string | null;
  image_url: string | null;
  identifier: string;
  name: string;
  token_standard: string;
  opensea_url: string;
};

export type NftWithOwner = Nft & {
  owners: Array<{
    address: string;
    quantity: number;
  }>;
};

export type Listing = {
  order_hash: string;
  chain: string;
  price: {
    current: {
      currency: string;
      decimals: 18;
      value: string;
    };
  };
  protocol_data: {
    parameters: {
      offerer: string;
      offer: Array<{
        itemType: number;
        token: string;
        identifierOrCriteria: string;
        startAmount: string;
        endAmount: string;
      }>;
      consideration: Array<{
        itemType: number;
        token: string;
        identifierOrCriteria: string;
        startAmount: string;
        endAmount: string;
      }>;
      startTime: string;
      endTime: string;
      orderType: number;
      zone: string;
      zoneHash: string;
      salt: string;
      conduitKey: string;
      totalOriginalConsiderationItems: number;
      counter: number;
    };
    signature: string | null;
  };
  protocol_address: string;
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

export const getNftInfo = async ({
  address,
  chain,
  identifier,
}: {
  address: string;
  chain: string;
  identifier: string;
}): Promise<{ nft: NftWithOwner }> => {
  const options = {
    method: "GET",
    headers: sharedHeaders,
  };

  const data = await fetch(
    `https://api.opensea.io/api/v2/chain/${chain}/contract/${address}/nfts/${identifier}`,
    options
  );

  return data.json();
};

export const getListingsByCollection = async ({
  slug,
  limit,
  next,
}: {
  slug: string;
  limit?: number;
  next?: string;
}): Promise<{
  next: string | null;
  listings: Listing[];
}> => {
  const options = {
    method: "GET",
    headers: sharedHeaders,
  };

  const url = new URL(
    `https://api.opensea.io/api/v2/listings/collection/${slug}/best`
  );

  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  if (next) {
    url.searchParams.append("next", next);
  }

  console.log(url.toString());

  const data = await fetch(url.toString(), options);

  const _data = await data.json();

  return {
    next: _data.next || null,
    listings: _data.listings,
  };
};

export const attemptFulfill = async ({
  fulfiller,
  hash,
  chain,
  protocol_address,
}: {
  fulfiller: string;
  hash: string;
  chain: string;
  protocol_address: string;
}): Promise<{
  fulfillment_data: {
    transaction: {
      function: string;
      chain: number;
      to: string;
      value: number;
      input_data: any;
    };
  };
}> => {
  const options = {
    method: "POST",
    headers: {
      ...sharedHeaders,
    },
    body: JSON.stringify({
      listing: {
        chain,
        hash,
        protocol_address,
      },
      fulfiller: { address: fulfiller },
    }),
  };

  const result = await fetch(
    "https://api.opensea.io/api/v2/listings/fulfillment_data",
    options
  );

  return await result.json();
};
