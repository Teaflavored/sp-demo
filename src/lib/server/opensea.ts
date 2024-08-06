import "server-only";

import opensea from "@api/opensea";

// NOTE: This should be stored as a secure env var on prod
opensea.auth("458ed85edccd4bdab1e94fc871d66a6b");
opensea.server("https://api.opensea.io");

export const getCollectionInfo = async (slug: string) => {
  return opensea.get_collection({ collection_slug: slug });
};
