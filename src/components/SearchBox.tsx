"use client";

import type { GetResponse } from "@/app/api/search/route";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/lib/client/api";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEBOUNCE_TIMEOUT = 200;

export const SearchBox = () => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebouncedValue(value, DEBOUNCE_TIMEOUT);
  const router = useRouter();

  const { isFetched, isFetching, data } = useQuery({
    queryKey: ["search", debouncedValue],
    queryFn: async () => {
      return await api.get<GetResponse>(`/search?query=${debouncedValue}`);
    },
  });

  return (
    <Command>
      <CommandInput
        placeholder="Type a command or search..."
        value={value}
        onValueChange={(val) => {
          setValue(val);
        }}
      />
      <CommandList>
        {!isFetching && data?.results.length === 0 && isFetched && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {isFetching && <CommandEmpty>Loading...</CommandEmpty>}
        {!!data?.results.length && (
          <CommandGroup heading="Collections">
            {(data.results || []).map((result) => (
              <CommandItem
                key={result.collectionSlug}
                onSelect={() => {
                  router.push(`/collection/${result.collectionSlug}`);
                }}
              >
                {result.collectionName}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};
