"use client";

import { Fragment, useState } from "react";
import { NftsGrid } from "./NftsGrid";
import { Switch } from "./ui/switch";
import { DemoBuySection } from "./DemoBuySection";

type Props = {
  slug: string;
  infoItems: Array<string | null>;
};

export const NftsSection = ({ slug, infoItems }: Props) => {
  const [isBuyMode, setIsBuyMode] = useState(false);

  return (
    <div className="flex flex-col flex-grow my-4">
      <div className="flex items-center mb-4">
        <div className="hidden md:flex gap-2">
          {infoItems.map((infoItem, idx) => {
            return (
              <Fragment key={idx}>
                <div>{infoItem}</div>
                {idx < infoItems.length - 1 && "·"}
              </Fragment>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          Buy mode
          <Switch
            checked={isBuyMode}
            onCheckedChange={() => setIsBuyMode((prev) => !prev)}
          />
        </div>
      </div>
      {!isBuyMode && <NftsGrid slug={slug} />}
      {isBuyMode && <DemoBuySection slug={slug} />}
    </div>
  );
};
