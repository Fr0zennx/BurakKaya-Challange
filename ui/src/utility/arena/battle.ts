import { Transaction } from "@mysten/sui/transactions";

export const battle = (
  packageId: string,
  heroId: string,
  arenaId: string
) => {
  const tx = new Transaction();

  // ✅ Move call: challenge::arena::battle
  tx.moveCall({
    target: `${packageId}::arena::battle`,
    arguments: [
      tx.object(heroId),   // Hero object (kullanıcının kahramanı)
      tx.object(arenaId),  // Arena object (rakip kahramanın bulunduğu alan)
    ],
  });

  // ✅ Battle sonucu Move modülündeki güç karşılaştırmasına göre belirlenir
  // Hero vs Arena.warrior — kazanan her iki kahramanı da alır.

  return tx;
};

