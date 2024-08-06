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
