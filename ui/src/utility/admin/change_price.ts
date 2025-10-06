import { Transaction } from "@mysten/sui/transactions";

export const changePrice = (
  packageId: string,
  listHeroId: string,
  newPriceInSui: string,
  adminCapId: string
) => {
  const tx = new Transaction();

  // ✅ 1. SUI → MIST dönüşümü (1 SUI = 1_000_000_000 MIST)
  const newPriceInMist = BigInt(Math.floor(Number(newPriceInSui) * 1_000_000_000));

  // ✅ 2. Move call: challenge::marketplace::change_the_price
  tx.moveCall({
    target: `${packageId}::marketplace::change_the_price`,
    arguments: [
      tx.object(adminCapId),  // AdminCap object
      tx.object(listHeroId),  // ListHero object
      tx.pure.u64(newPriceInMist), // New price (in MIST)
    ],
  });

  // ✅ 3. Transaction objesini döndür
  return tx;
};

