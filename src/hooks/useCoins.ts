import { Coin } from "@/data/coinList";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";

const fetchCoins = async (
  pagination: PaginationState
): Promise<Array<Coin>> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=${
    pagination.pageSize
  }&page=${
    pagination.pageIndex + 1
  }&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en&precision=2`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-JursTjXKhbMTjJkrizZtb8Gn",
    },
  };
  const response = await fetch(url, options);
  return await response.json();
};

const useCoins = (pagination: PaginationState) => {
  return useQuery({
    queryKey: ["coins", pagination],
    queryFn: () => fetchCoins(pagination),
  });
};

export { useCoins, fetchCoins };
