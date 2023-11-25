"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FC } from "react";
import { Input } from "@nextui-org/react";

interface SearchBarProps {}
const SearchBar: FC<SearchBarProps> = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // query after 0.2s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      router.push(`/search?q=` + search);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [router, search]);

  return (
    <Input
      id="text"
      isClearable
      onClear={() => {
        setSearch("");
      }}
      startContent={
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
      }
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder={"Search creators"}
      autoComplete="off"
      className="no-focus searchbar_input !bg-transparent"
    />
  );
};
export default SearchBar;
