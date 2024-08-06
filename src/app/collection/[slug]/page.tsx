import { NftsGrid } from "@/components/NftsGrid";
import { getCollectionInfo } from "@/lib/server/opensea";
import Image from "next/image";
import { redirect } from "next/navigation";

const CollectionPage = async ({ params }: { params: { slug: string } }) => {
  const collectionInfo = await getCollectionInfo(params.slug);

  if (!collectionInfo) {
    return redirect("/404");
  }

  return (
    <div>
      <div className="w-full h-[300px] relative overflow-hidden">
        {collectionInfo.banner_image_url &&
        collectionInfo.banner_image_url.endsWith("mp4") ? (
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
        )}
      </div>
      <h1 className="text-3xl">{collectionInfo.name}</h1>
      <NftsGrid slug={collectionInfo.collection} />
    </div>
  );
};

export default CollectionPage;
