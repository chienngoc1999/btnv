"use client";

import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";

const ListCoffee = ({ search }: any) => {
  const [data, setData] = useState<any>([]);
  const [listSelected, setListSelected] = useState<any>([]);
  const listSelectedSorted = useMemo(() => {
    return [...new Set(listSelected)].sort();
  }, [listSelected]);

  const getData = async () => {
    try {
      const resp = await fetch("https://api.sampleapis.com/coffee/hot");
      const json = await resp.json();
      if (json) {
        const filteredData = json.filter(
          (item: { title: string }) =>
            !["Black Coffee", "Svart Te", "Frapino Caramel"].includes(
              item.title
            )
        );
        setData(filteredData);
      }
    } catch (err) {
      console.log("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSelection = (title: string) => {
    setListSelected((prevList: any) =>
      prevList.includes(title)
        ? prevList.filter((item: string) => item !== title)
        : [...prevList, title]
    );
  };

  return (
    <>
      <div className="fixed bottom-2 right-2 bg-gray-200 p-4">
        <div className="font-medium">Giỏ hàng:</div>
        <br />
        {listSelectedSorted.join(", ")}
      </div>
      <ul>
        {data?.length > 0 &&
          data.map((item: any) => {
            if (
              search &&
              !item.title.toLowerCase().includes(search.toLowerCase())
            ) {
              return null;
            }
            return (
              <li
                key={item.title}
                className={`${
                  listSelected.includes(item.title)
                    ? "bg-violet-400"
                    : "bg-red-300"
                } px-4 py-2 my-2 text-[14px] text-black items-center flex gap-4`}
              >
                <input
                  type="checkbox"
                  id={item.title}
                  className="w-4 h-4 ml-4"
                  onChange={() => handleSelection(item.title)}
                  checked={listSelected.includes(item.title)}
                />
                <label htmlFor={item.title}>{item.title}</label>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default function Page() {
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 500),
    []
  );
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };
  return (
    <>
      <div className="w-full max-w-sm min-w-[200px]">
        <input
          placeholder="Search here"
          type="text"
          onChange={handleSearchChange}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow m-4"
        />
      </div>
      <ListCoffee search={search} />
    </>
  );
}
