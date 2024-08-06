import { ContentContainer } from "@/components/ContentContainer";
import { NftsGrid } from "@/components/NftsGrid";
import { getCollectionInfo } from "@/lib/server/opensea";
import { format } from "date-fns";
import { TwitterIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const CollectionPage = async ({ params }: { params: { slug: string } }) => {
  const collectionInfo = await getCollectionInfo(params.slug);

  if (!collectionInfo) {
    return redirect("/404");
  }

  const info = [
    collectionInfo.total_supply ? `${collectionInfo.total_supply} items` : null,
    collectionInfo.created_date
      ? `Created ${format(new Date(collectionInfo.created_date), "MMM yyyy")}`
      : null,
    collectionInfo.contracts?.[0]?.chain
      ? `Chain: ${collectionInfo.contracts[0].chain.toUpperCase()}`
      : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="w-full h-[300px] relative overflow-hidden">
        {collectionInfo.banner_image_url &&
          (collectionInfo.banner_image_url.endsWith("mp4") ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              src={collectionInfo.banner_image_url}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          ) : (
            <Image
              alt=""
              layout="fill"
              src={collectionInfo.banner_image_url}
              unoptimized
              className="object-cover"
            />
          ))}
      </div>
      <div className="bg-gradient-to-t from-black to-transparent -translate-y-[100%] text-white">
        <ContentContainer className="pt-16 pb-4 -mb-[140px] flex justify-between items-center">
          <div>
            <h1 className="text-[42px] font-bold">{collectionInfo.name}</h1>
            {collectionInfo.description && (
              <div className="overflow text-ellipsis max-w-[200px] lg:max-w-[400px] whitespace-nowrap overflow-hidden">
                {collectionInfo.description}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {collectionInfo.twitter_username && (
              <Link
                href={`https://twitter.com/${collectionInfo.twitter_username}`}
                target="_blank"
                className="bg-black/70 rounded-full p-3 text-white"
              >
                <TwitterIcon />
              </Link>
            )}
            {collectionInfo.opensea_url && (
              <Link
                href={collectionInfo.opensea_url}
                target="_blank"
                className="bg-black/70 rounded-full p-3 text-white"
              >
                <Image alt="" src="/opensea.png" width={24} height={24} />
              </Link>
            )}
          </div>
        </ContentContainer>
      </div>
      <ContentContainer>
        <div className="flex gap-2 mb-4">
          {info.map((infoItem, idx) => {
            return (
              <Fragment key={idx}>
                <div>{infoItem}</div>
                {idx < info.length - 1 && "·"}
              </Fragment>
            );
          })}
        </div>
        <NftsGrid slug={collectionInfo.collection} />
      </ContentContainer>
    </div>
  );
};

export default CollectionPage;
