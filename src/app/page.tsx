import { SearchBox } from "@/components/SearchBox";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="flex justify-center w-full">
        <div className="w-[320px] border flex items-start mt-[20%]">
          <SearchBox />
        </div>
      </div>
    </div>
  );
}
