import { FC } from "react";
import { fetchUsers } from "@/lib/actions/user.actions";
import SearchBar from "@/components/shared/SearchBar";
import SearchResult from "@/components/cards/SearchResult";

interface pageProps {
  searchParams: { q: string; page?: number };
}

const Page: FC<pageProps> = async ({ searchParams }) => {
  const searchResult = searchParams.q
    ? await fetchUsers({
        searchString: searchParams.q ? searchParams.q : "",
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
      })
    : undefined;

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <SearchBar />
      <div className="mt-14 flex flex-col gap-9">
        {searchResult?.searchResult.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {searchResult?.searchResult.map((person) => (
              <SearchResult
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username as string}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
