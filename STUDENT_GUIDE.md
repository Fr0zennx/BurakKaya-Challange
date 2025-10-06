# 🎯 Student Implementation Guide

Below are the TODOs and hints you need to complete.

## 📋 What You Need to Complete

### Move Smart Contract Functions

#### 1. **create_hero** (`move/sources/hero.move`)

```move
module {{package_addr}}::hero {

    use sui::object;
    use sui::tx_context::{TxContext};
    use sui::transfer;
    use sui::event;

    struct Hero has key, store {
        id: object::UID,
        name: String,
        level: u64,
        strength: u64,
        agility: u64,
        intelligence: u64,
        owner: address,
        created_at: u64,
    }

    struct HeroDisplay has key {
        id: object::UID,
        name: String,
        description: String,
        image_url: String,
    }

    struct HeroCreatedEvent has drop, store {
        hero_id: u64,
        owner: address,
        name: String,
        level: u64,
    }

    public entry fun create_hero(
        name: String,
        strength: u64,
        agility: u64,
        intelligence: u64,
        description: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let hero = Hero {
            id: object::new(ctx),
            name: name.clone(),
            level: 1,
            strength,
            agility,
            intelligence,
            owner: ctx.sender(),
            created_at: ctx.epoch_timestamp_ms(),
        };

        let display = HeroDisplay {
            id: object::new(ctx),
            name,
            description,
            image_url,
        };

        event::emit(HeroCreatedEvent {
            hero_id: object::uid_to_inner(&hero.id),
            owner: ctx.sender(),
            name: hero.name.clone(),
            level: hero.level,
        });

        transfer::freeze_object(display);

     
        transfer::public_transfer(hero, ctx.sender());
    }

    public entry fun transfer_hero(hero: Hero, recipient: address) {
        transfer::public_transfer(hero, recipient);
    }

    public fun id(hero: &Hero): &object::UID {
        &hero.id
    }

    public fun owner(hero: &Hero): address {
        hero.owner
    }
}



    // TODO: Create a new Hero struct with the given parameters
        // Hints:
        // Use object::new(ctx) to create a unique ID
        // Set name, image_url, and power fields
    // TODO: Transfer the hero to the transaction sender
    // TODO: Create HeroMetadata and freeze it for tracking
        // Hints:
        // Use ctx.epoch_timestamp_ms() for timestamp
    //TODO: Use transfer::freeze_object() to make metadata immutable

```

#### 3. **create_arena** (`move/sources/arena.move`)

```move
module <address>::hero_factory {
    use sui::object::{Self, UID, ID};
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::tx_context;
    use sui::string::String;
    use sui::event; 

    struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64,
    }

    struct HeroMetadata has key {
        id: UID,
        hero_id: ID,
        created_at_ms: u64, 
    }

    struct Arena has key, store {
        id: UID,
        warrior: Hero, 
        owner: address, 
    }

    struct ArenaCreated has copy, drop, store {
        arena_id: ID,
        created_at_ms: u64,
    }

    public entry fun create_hero(
        name: String,
        image_url: String,
        power: u64,
        ctx: &mut TxContext
    ) {
        let hero_id = object::new(ctx);
        let hero = Hero {
            id: hero_id,
            name,
            image_url,
            power,
        };

        transfer::public_transfer(hero, tx_context::sender(ctx));

        let created_at = tx_context::epoch_timestamp_ms(ctx);

        let metadata = HeroMetadata {
            id: object::new(ctx),
            hero_id: object::uid_to_inner(&hero_id), 
            created_at_ms: created_at,
        };

        
        transfer::share_object(metadata);
    }

    public entry fun create_arena(
        hero: Hero, 
        ctx: &mut TxContext
    ) {
        let owner_addr = tx_context::sender(ctx);

        let arena = Arena {
            id: object::new(ctx),
            warrior: hero, 
            owner: owner_addr,
        };

        
        event::emit_event(
            ArenaCreated {
                arena_id: object::uid_to_inner(&arena.id),
                created_at_ms: tx_context::epoch_timestamp_ms(ctx),
            }
        );

        transfer::share_object(arena);
    }
}




    // TODO: Create an arena object
        // Hints:
        // Use object::new(ctx) for unique ID
        // Set warrior field to the hero parameter
        // Set owner to ctx.sender()
    // TODO: Emit ArenaCreated event with arena ID and timestamp (Don't forget to use ctx.epoch_timestamp_ms(), object::id(&arena))
    // TODO: Use transfer::share_object() to make it publicly tradeable

```

#### 4. **battle** (`move/sources/arena.move`)

```move
module <address>::hero_factory {
    use sui::object::{Self, UID, ID};
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::tx_context;
    use sui::string::String;
    use sui::event;

    struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64, 
    }

    struct HeroMetadata has key {
        id: UID,
        hero_id: ID, 
        created_at_ms: u64, 
    }

    struct Arena has key, store {
        id: UID,
        warrior: Hero, 
        owner: address, 
    }

    struct ArenaCreated has copy, drop, store {
        arena_id: ID,
        created_at_ms: u64,
    }
    
    struct BattleCompleted has copy, drop, store {
        arena_id: ID,
        winner_id: ID,
        loser_id: ID,
        completed_at_ms: u64,
    }

    public entry fun create_hero(
        name: String,
        image_url: String,
        power: u64,
        ctx: &mut TxContext
    ) {
        let hero_id = object::new(ctx);
        let hero = Hero {
            id: hero_id,
            name,
            image_url,
            power,
        };

        transfer::public_transfer(hero, tx_context::sender(ctx));

        let created_at = tx_context::epoch_timestamp_ms(ctx);
        let metadata = HeroMetadata {
            id: object::new(ctx),
            hero_id: object::uid_to_inner(&hero_id), 
            created_at_ms: created_at,
        };

        transfer::share_object(metadata);
    }

    public entry fun create_arena(
        hero: Hero, 
        ctx: &mut TxContext
    ) {
        let owner_addr = tx_context::sender(ctx);

        let arena = Arena {
            id: object::new(ctx),
            warrior: hero, 
            owner: owner_addr,
        };

        event::emit_event(
            ArenaCreated {
                arena_id: object::uid_to_inner(&arena.id),
                created_at_ms: tx_context::epoch_timestamp_ms(ctx),
            }
        );

        transfer::share_object(arena);
    }
    
    public entry fun complete_battle(
        arena: Arena,
        challenger: Hero,
        ctx: &mut TxContext
    ) {
        let Arena { id, warrior, owner: arena_owner } = arena;
        
        let challenger_id = object::uid_to_inner(&challenger.id);
        let warrior_id = object::uid_to_inner(&warrior.id);
        
        let challenger_power = challenger.power;
        let warrior_power = warrior.power;
        
        let current_sender = tx_context::sender(ctx);

        if (challenger_power > warrior_power) {
            transfer::public_transfer(challenger, current_sender);
            transfer::public_transfer(warrior, current_sender);

            event::emit_event(
                BattleCompleted {
                    arena_id: object::uid_to_inner(&id),
                    winner_id: challenger_id,
                    loser_id: warrior_id,
                    completed_at_ms: tx_context::epoch_timestamp_ms(ctx),
                }
            );
        } else {
            transfer::public_transfer(challenger, arena_owner);
            transfer::public_transfer(warrior, arena_owner);

            event::emit_event(
                BattleCompleted {
                    arena_id: object::uid_to_inner(&id),
                    winner_id: warrior_id,
                    loser_id: challenger_id,
                    completed_at_ms: tx_context::epoch_timestamp_ms(ctx),
                }
            );
        };

        object::delete(id);
    }
}

    
    // TODO: Implement battle logic
        // Hints:
        // Destructure arena to get id, warrior, and owner
    // TODO: Compare hero.hero_power() with warrior.hero_power()
        // Hints: 
        // If hero wins: both heroes go to ctx.sender()
        // If warrior wins: both heroes go to battle place owner
    // TODO:  Emit BattlePlaceCompleted event with winner/loser IDs (Don't forget to use object::id(&warrior) or object::id(&hero) ). 
        // Hints:  
        // You have to emit this inside of the if else statements
    // TODO: Delete the battle place ID

```

#### 2. **init** (`move/sources/marketplace.move`)

```move
module <address>::hero_factory {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::string::String;
    use sui::event;

    struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64, 
    }

    struct HeroMetadata has key {
        id: UID,
        hero_id: ID, 
        created_at_ms: u64, 
    }

    struct Arena has key, store {
        id: UID,
        warrior: Hero, 
        owner: address, 
    }
    
    struct AdminCap has key {
        id: UID,
    }
    struct ArenaCreated has copy, drop {
        arena_id: ID,
        created_at_ms: u64,
    }
    
    struct BattleCompleted has copy, drop {
        arena_id: ID,
        winner_id: ID,
        loser_id: ID,
        completed_at_ms: u64,
    }

    fun init(ctx: &mut TxContext) {
        let cap = AdminCap {
            id: object::new(ctx),
        };

        transfer::public_transfer(cap, tx_context::sender(ctx));
    }


    public entry fun create_hero(
        name: String,
        image_url: String,
        power: u64,
        ctx: &mut TxContext
    ) {
        let hero_id = object::new(ctx);
        let hero = Hero {
            id: hero_id,
            name: name,
            image_url: image_url,
            power: power,
        };

        transfer::public_transfer(hero, tx_context::sender(ctx));


        let created_at = ctx.epoch_timestamp_ms();

        let metadata = HeroMetadata {
            id: object::new(ctx),
            hero_id: object::uid_to_inner(&hero_id), 
            created_at_ms: created_at,
        };

        transfer::freeze_object(metadata);
    }

    public entry fun create_arena(
        hero: Hero, 
        ctx: &mut TxContext
    ) {
        let owner_addr = tx_context::sender(ctx);

        let arena = Arena {
            id: object::new(ctx),
            warrior: hero, 
            owner: owner_addr,
        };

        event::emit(ArenaCreated {
            arena_id: object::id(&arena),
            created_at_ms: ctx.epoch_timestamp_ms(),
        });

        transfer::share_object(arena);
    }
    
    public entry fun complete_battle(
        arena: Arena,
        challenger: Hero, 
        ctx: &mut TxContext
    ) {
        let Arena { id, warrior, owner: arena_owner } = arena;
        
        let challenger_id = object::id(&challenger);
        let warrior_id = object::id(&warrior);
        
        let challenger_power = challenger.power;
        let warrior_power = warrior.power;
        
        let current_sender = tx_context::sender(ctx);

        if (challenger_power > warrior_power) {
            transfer::public_transfer(challenger, current_sender);
            transfer::public_transfer(warrior, current_sender);
            event::emit(BattleCompleted {
                arena_id: object::uid_to_inner(&id),
                winner_id: challenger_id,
                loser_id: warrior_id,
                completed_at_ms: ctx.epoch_timestamp_ms(),
            });

        } else {
            transfer::public_transfer(challenger, arena_owner);
            transfer::public_transfer(warrior, arena_owner);

            event::emit(BattleCompleted {
                arena_id: object::uid_to_inner(&id),
                winner_id: warrior_id,
                loser_id: challenger_id,
                completed_at_ms: ctx.epoch_timestamp_ms(),
            });
        };

        object::delete(id);
    }
}




    // NOTE: The init function runs once when the module is published
    // TODO: Initialize the module by creating AdminCap
        // Hints:
        // Create AdminCap id with object::new(ctx)
    // TODO: Transfer it to the module publisher (ctx.sender()) using transfer::public_transfer() function

```

#### 5. **list_hero** (`move/sources/marketplace.move`)

```move
module <address>::hero_factory {
    use sui::object::{Self, UID, ID};
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::tx_context;
    use sui::string::String;
    use sui::event;

    struct Hero has key, store {
        id: UID,
        name: String,
        image_url: String,
        power: u64,
    }

    
    struct HeroMetadata has key {
        id: UID,
        hero_id: ID,
        created_at_ms: u64,
    }

   
    struct Arena has key, store {
        id: UID,
        warrior: Hero,
        owner: address,
    }

   
    struct ListHero has key, store {
        id: UID,
        nft: Hero,
        price: u64,
        seller: address,
    }

    
    struct AdminCap has key {
        id: UID,
    }

    
    struct ArenaCreated has copy, drop, store {
        arena_id: ID,
        created_at_ms: u64,
    }

    struct BattleCompleted has copy, drop, store {
        arena_id: ID,
        winner_id: ID,
        loser_id: ID,
        completed_at_ms: u64,
    }

    struct HeroListed has copy, drop, store {
        listing_id: ID,
        hero_id: ID,
        price: u64,
        seller: address,
    }

    
    public entry fun init(ctx: &mut TxContext) {
        let cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(cap, tx_context::sender(ctx));
    }

   
    public entry fun create_hero(
        name: String,
        image_url: String,
        power: u64,
        ctx: &mut TxContext
    ) {
        let hero_id = object::new(ctx);
        let hero = Hero {
            id: hero_id,
            name,
            image_url,
            power,
        };
        transfer::public_transfer(hero, tx_context::sender(ctx));

        let created_at = tx_context::epoch_timestamp_ms(ctx);
        let metadata = HeroMetadata {
            id: object::new(ctx),
            hero_id: object::uid_to_inner(&hero_id),
            created_at_ms: created_at,
        };
        transfer::share_object(metadata);
    }

 
    public entry fun create_arena(
        hero: Hero,
        ctx: &mut TxContext
    ) {
        let owner_addr = tx_context::sender(ctx);
        let arena = Arena {
            id: object::new(ctx),
            warrior: hero,
            owner: owner_addr,
        };

        event::emit_event(
            ArenaCreated {
                arena_id: object::uid_to_inner(&arena.id),
                created_at_ms: tx_context::epoch_timestamp_ms(ctx),
            }
        );

        transfer::share_object(arena);
    }

    
    public entry fun list_hero(
        hero: Hero,
        price: u64,
        ctx: &mut TxContext
    ) {
        let seller_addr = tx_context::sender(ctx);
        let listing_id = object::new(ctx);

        let list_hero = ListHero {
            id: listing_id,
            nft: hero,
            price,
            seller: seller_addr,
        };

        event::emit_event(
            HeroListed {
                listing_id: object::uid_to_inner(&listing_id),
                hero_id: object::uid_to_inner(&list_hero.nft.id),
                price,
                seller: seller_addr,
            }
        );

        transfer::share_object(list_hero);
    }

    
    public entry fun complete_battle(
        arena: Arena,
        challenger: Hero,
        ctx: &mut TxContext
    ) {
        let Arena { id, warrior, owner: arena_owner } = arena;

        let challenger_id = object::uid_to_inner(&challenger.id);
        let warrior_id = object::uid_to_inner(&warrior.id);
        let challenger_power = challenger.power;
        let warrior_power = warrior.power;
        let current_sender = tx_context::sender(ctx);

        if (challenger_power > warrior_power) {
           
            transfer::public_transfer(challenger, current_sender);
            transfer::public_transfer(warrior, current_sender);

            event::emit_event(
                BattleCompleted {
                    arena_id: object::uid_to_inner(&id),
                    winner_id: challenger_id,
                    loser_id: warrior_id,
                    completed_at_ms: tx_context::epoch_timestamp_ms(ctx),
                }
            );
        } else {
            
            transfer::public_transfer(challenger, arena_owner);
            transfer::public_transfer(warrior, arena_owner);

            event::emit_event(
                BattleCompleted {
                    arena_id: object::uid_to_inner(&id),
                    winner_id: warrior_id,
                    loser_id: challenger_id,
                    completed_at_ms: tx_context::epoch_timestamp_ms(ctx),
                }
            );
        };

        object::delete(id);
    }
}


```

#### 6. **buy_hero** (`move/sources/marketplace.move`)

```move


    // TODO: Destructure list_hero to get id, nft, price, and seller
        // Hints:
        // let ListHero { id, nft, price, seller } = list_hero;
    // TODO: Use assert! to verify coin value equals listing price (coin::value(&coin) == price) else abort with `EInvalidPayment`
    // TODO: Transfer coin to seller (use transfer::public_transfer() function)
    // TODO: Transfer hero NFT to buyer (ctx.sender())
    // TODO: Emit HeroBought event with transaction details (Don't forget to use object::uid_to_inner(&id) )
    // TODO: Delete the listing ID (object::delete(id))

     public entry fun buy_hero(
    ctx: &mut TxContext,
    list_hero: ListHero,
    coin: Coin<APT>,
) {
    
    let ListHero { id, nft, price, seller } = list_hero;

    
    assert!(
        coin::value(&coin) == price,
        EInvalidPayment
    );


    transfer::public_transfer(&seller, coin);

   
    transfer::public_transfer(ctx.sender(), nft);

   
    event::emit_event(
        &HeroBoughtEvent {
            hero_id: object::uid_to_inner(&id),
            price,
            seller,
            buyer: ctx.sender(),
        }
    );

    
    object::delete(id);
}

```

#### 7. **delist** (Admin Only) (`move/sources/marketplace.move`)

```move
public fun delist(_: &AdminCap, list_hero: ListHero, ctx: &mut TxContext) {

    // NOTE: The AdminCap parameter ensures only admin can call this
    // TODO: Implement admin delist functionality
        // Hints:
        // Destructure list_hero (ignore price with "price: _")
    // TODO:Transfer NFT back to original seller
    // TODO:Delete the listing ID (object::delete(id))


      let ListHero { id, nft, price: _, seller } = list_hero;

      transfer::public_transfer(nft, seller);

      object::delete(id, ctx);

    }
```

#### 8. **change_the_price** (Admin Only) (`move/sources/marketplace.move`)

```move


    // NOTE: The AdminCap parameter ensures only admin can call this
    // list_hero has &mut so price can be modified     
    // TODO: Update the listing price
        // Hints:
        // Access the price field of list_hero and update it
  public fun change_the_price(_: &AdminCap, list_hero: &mut ListHero, new_price: u64) {
    list_hero.price = new_price;

  }

```

# ⚠️ Warning! All tests needs to pass!

### After completing build and test your files. 

**Building & Testing the Move Contracts**

   ```bash
   cd move
   sui move build
   sui move test
   ```

### Frontend Utility Scripts

#### 1. **Create Hero** (`ui/src/utility/heroes/create_hero.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions';

export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: number | string
) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::hero::create_hero`, 
    arguments: [
      tx.pure.string(name),
      tx.pure.string(imageUrl),
      tx.pure.u64(BigInt(power)),
    ],
  });

  return tx;
};



```

#### 2. **Buy Hero** (`ui/src/utility/marketplace/buy_hero.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions';

const MIST_PER_SUI = 1_000_000_000n;

export const buyHero = (
  packageId: string,
  listHeroId: string,
  priceInSui: string
) => {
  const tx = new Transaction();
  const priceInMist = BigInt(priceInSui) * MIST_PER_SUI;


  const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist.toString())]);

  tx.moveCall({
    target: `${packageId}::marketplace::buy_hero`,
    arguments: [tx.object(listHeroId), paymentCoin],
  });

  return tx;
};






  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // const priceInMist = ?

  // TODO: Split coin for exact payment
  // Use tx.splitCoins(tx.gas, [priceInMist]) to create a payment coin
  // const [paymentCoin] = ?

  // TODO: Add moveCall to buy a hero
  // Function: `${packageId}::marketplace::buy_hero`
  // Arguments: listHeroId (object), paymentCoin (coin)
  // Hints:
  // - Use tx.object() for the ListHero object
  // - Use the paymentCoin from splitCoins for payment

  
```

#### 3. **List Hero** (`ui/src/utility/marketplace/list_hero.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions';

const MIST_PER_SUI = 1_000_000_000n;

export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string
) => {
  const tx = new Transaction();
  const priceInMist = BigInt(priceInSui) * MIST_PER_SUI; 

  tx.moveCall({
    target: `${packageId}::marketplace::list_hero`,
    arguments: [
      tx.object(heroId),
      tx.pure.u64(priceInMist.toString()),
    ],
  });

  return tx;
};


 




  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // const priceInMist = ?

  // TODO: Add moveCall to list a hero for sale
  // Function: `${packageId}::marketplace::list_hero`
  // Arguments: heroId (object), priceInMist (u64)
  // Hints:
  // - Use tx.object() for the hero object
  // - Use tx.pure.u64() for the price in MIST
  // - Remember: 1 SUI = 1_000_000_000 MIST


```

#### 4. **Transfer Hero** (`ui/src/utility/helpers/transfer_hero.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions'

export const transferHero = (heroId: string, to: string) => {
  const tx = new Transaction()
  tx.transferObjects([tx.object(heroId)], to)
  return tx
}




  // TODO: Transfer hero to another address
  // Use tx.transferObjects() method
  // Arguments: heroId (object), to (address)
  // Hints:
  // - Use tx.object() for object IDs
  // - Use "to" for the address
  // - This is a simple object transfer, not a moveCall


```

#### 5. **Create Arena** (`ui/src/utility/battle/create_arena.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions'

export const createArena = (packageId: string, heroId: string) => {
  const tx = new Transaction()
  tx.moveCall({
    target: `${packageId}::arena::create_arena`,
    arguments: [tx.object(heroId)],
  })
  return tx
}



  // TODO: Add moveCall to create a battle place
  // Function: `${packageId}::arena::create_arena`
  // Arguments: heroId (object)
  // Hints:
  // - Use tx.object() for the hero object
  // - This creates a shared object that others can battle against


```

#### 6. **Battle** (`ui/src/utility/battle/battle.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions'

export const battle = (packageId: string, heroId: string, arenaId: string) => {
  const tx = new Transaction()
  tx.moveCall({
    target: `${packageId}::arena::battle`,
    arguments: [tx.object(heroId), tx.object(arenaId)],
  })
  return tx
}




  // TODO: Add moveCall to start a battle
  // Function: `${packageId}::arena::battle`
  // Arguments: heroId (object), arenaId (object)
  // Hints:
  // - Use tx.object() for both hero and battle place objects
  // - The battle winner is determined by hero power comparison
  // - Winner takes both heroes


```

#### 7. **Delist (Admin)** (`ui/src/utility/admin/delist.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions'

export const delist = (
  packageId: string,
  listHeroId: string,
  adminCapId: string
) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::marketplace::delist`,
    arguments: [
      tx.object(adminCapId),
      tx.object(listHeroId),
    ],
  });

  return tx;
};



  // TODO: Add moveCall to delist a hero (Admin only)
  // Function: `${packageId}::marketplace::delist`
  // Arguments: adminCapId (object), listHeroId (object)
  // Hints:
  // - Use tx.object() for both objects
  // - This requires admin capability verification
  // - Returns the hero to the original seller


```

#### 8. **Change Price (Admin)** (`ui/src/utility/admin/change_price.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions';

const MIST_PER_SUI = 1_000_000_000n;

export const changePrice = (
  packageId: string,
  listHeroId: string,
  newPriceInSui: string,
  adminCapId: string
) => {
  const tx = new Transaction();
  const newPriceInMist = BigInt(newPriceInSui) * MIST_PER_SUI; 

  tx.moveCall({
    target: `${packageId}::marketplace::change_the_price`,
    arguments: [
      tx.object(adminCapId),
      tx.object(listHeroId),
      tx.pure.u64(newPriceInMist.toString()),
    ],
  });

  return tx;
};

  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // const newPriceInMist = ?

  // TODO: Add moveCall to change hero price (Admin only)
  // Function: `${packageId}::marketplace::change_the_price`
  // Arguments: adminCapId (object), listHeroId (object), newPriceInMist (u64)
  // Hints:
  // - Use tx.object() for objects
  // - Use tx.pure.u64() for the new price
  // - Convert price from SUI to MIST before sending

  
```

#### 9. **Transfer Admin Cap** (`ui/src/utility/helpers/transfer_admin_cap.ts`)

```typescript
import { Transaction } from '@mysten/sui/transactions';

export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();
  const adminCapRef = tx.object(adminCapId);
  tx.transferObjects({ objects: [adminCapRef], recipient: to });
  return tx;
};



  // TODO: Transfer admin capability to another address
  // Use tx.transferObjects() method
  // Arguments: [objects array], recipient address
  // Hints:
  // - Use tx.object() to reference the admin cap
  // - This is a simple object transfer, not a moveCall
  // - The recipient becomes the new admin

  

```

## 🚀 Development Environment

1. **Building the Move Contracts**

   ```bash
   cd move
   sui move build
   ```

2. **Deploying the Contracts**

   ```bash
   sui client publish
   ```

3. **Configure the User Interface**

   ```typescript
   // Set this value to the Package ID in the transaction summary of step 2
   // File `ui/src/networkConfig.ts`
   const PACKAGE_ID = ''
   ```

4. **Installing User Interface Dependencies**

   ```bash
   cd ui
   npm install
   ```

5. **Run the User Interface**

   ```bash
   npm run dev
   ```
