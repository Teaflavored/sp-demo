"use client";

import type { GetResponse } from "@/app/api/search/route";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { api } from "@/lib/client/api";
import { useEffect, useState } from "react";

export const SearchBox = () => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<GetResponse["results"]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.get<GetResponse>(`/search?query=${value}`);

      setResults(data.results);
    };

    fetch();
  }, [value]);

  return (
    <Command
      onSelect={(val) => {
        console.log(val);
      }}
    >
      <CommandInput
        placeholder="Type a command or search..."
        value={value}
        onValueChange={(val) => {
          setValue(val);
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Collections">
          {results.map((result) => (
            <CommandItem key={result}>{result}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
