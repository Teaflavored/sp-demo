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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEBOUNCE_TIMEOUT = 200;

export const SearchBox = () => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebouncedValue(value, DEBOUNCE_TIMEOUT);
  const [results, setResults] = useState<GetResponse["results"]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      setIsFetching(true);
      try {
        const data = await api.get<GetResponse>(
          `/search?query=${debouncedValue}`
        );
        setHasFetched(true);

        setResults(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetching(false);
      }
    };

    fetch();
  }, [debouncedValue]);

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
        {!isFetching && results.length === 0 && hasFetched && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {isFetching && <CommandEmpty>Loading...</CommandEmpty>}
        {!!results.length && (
          <CommandGroup heading="Collections">
            {results.map((result) => (
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
