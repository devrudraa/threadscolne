"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchResultProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}
const SearchResult: FC<SearchResultProps> = ({ imgUrl, name, username }) => {
  return (
    <Link href={"profile/" + username}>
      <article className="user-card px-5 py-3 bg-dark-3 rounded-lg">
        <div className="user-card_avatar">
          <div className="relative h-12 w-12">
            <Image
              src={imgUrl}
              alt="user_logo"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex-1 text-ellipsis">
            <h4 className="text-base-semibold text-light-1">{name}</h4>
            <p className="text-small-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </article>
    </Link>
  );
};
export default SearchResult;
