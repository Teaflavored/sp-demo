"use client";

import { api } from "@/lib/client/api";
import { useEffect } from "react";

type Props = {
  slug: string;
};

export const NftsGrid = ({ slug }: Props) => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/nfts?slug=${slug}`);

      console.log(response);
    };

    fetchData();
  }, [slug]);

  return <div>NFTS GRID</div>;
};
