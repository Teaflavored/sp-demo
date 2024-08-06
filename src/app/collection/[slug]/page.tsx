import { NftsGrid } from "@/components/NftsGrid";
import { getCollectionInfo } from "@/lib/server/opensea";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const CollectionPage = async ({ params }: { params: { slug: string } }) => {
  const collectionInfo = await getCollectionInfo(params.slug);

  if (!collectionInfo) {
    return redirect("/404");
  }

  return (
    <div>
      <div className="w-full h-[300px] relative">
        {collectionInfo.banner_image_url && (
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
      <NftsGrid />
    </div>
  );
};

export default CollectionPage;
