import { Transaction } from "@mysten/sui/transactions";

export const delist = (
  packageId: string,
  listHeroId: string,
  adminCapId: string,
) => {
  const tx = new Transaction();

  // ✅ Move call: challenge::marketplace::delist
  tx.moveCall({
    target: `${packageId}::marketplace::delist`,
    arguments: [
      tx.object(adminCapId), // AdminCap object — admin doğrulaması için
      tx.object(listHeroId), // ListHero object — listeden kaldırılacak NFT
    ],
  });

  return tx;
};
