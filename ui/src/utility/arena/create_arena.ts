import { Transaction } from "@mysten/sui/transactions";

export const createArena = (packageId: string, heroId: string) => {
  const tx = new Transaction();

  // ✅ Move call: challenge::arena::create_arena
  tx.moveCall({
    target: `${packageId}::arena::create_arena`,
    arguments: [
      tx.object(heroId), // Hero objesini argüman olarak geçir
    ],
  });

  // Bu fonksiyon zincirde bir Arena objesi oluşturur.
  // Arena paylaşılabilir (shared object) hale getirilir ve diğer kullanıcılar buna karşı savaşabilir.

  return tx;
};
