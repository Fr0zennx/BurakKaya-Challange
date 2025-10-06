module challenge::arena;

use challenge::hero::{Self, Hero};
use std::string::String;
use sui::event;
use sui::object::{Self, UID, ID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

public struct Arena has key, store {
    id: UID,
    warrior: Hero,
    owner: address,
}

public struct ArenaCreated has copy, drop {
    arena_id: ID,
    timestamp: u64,
}

public struct ArenaCompleted has copy, drop {
    winner_hero_id: ID,
    loser_hero_id: ID,
    timestamp: u64,
}

public fun create_arena(hero: Hero, ctx: &mut TxContext) {
    let arena = Arena {
        id: object::new(ctx),
        warrior: hero,
        owner: tx_context::sender(ctx),
    };

    event::emit(ArenaCreated {
        arena_id: object::id(&arena),
        timestamp: ctx.epoch_timestamp_ms(),
    });

    transfer::share_object(arena);
}

#[allow(lint(self_transfer))]
public fun battle(hero: Hero, arena: Arena, ctx: &mut TxContext) {
    let Arena { id, warrior, owner } = arena;

    let hero_power = hero::hero_power(&hero);
    let warrior_power = hero::hero_power(&warrior);

    if (hero_power > warrior_power) {
        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&hero),
            loser_hero_id: object::id(&warrior),
            timestamp: ctx.epoch_timestamp_ms(),
        });

        transfer::public_transfer(hero, tx_context::sender(ctx));
        transfer::public_transfer(warrior, tx_context::sender(ctx));
    } else {
        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&warrior),
            loser_hero_id: object::id(&hero),
            timestamp: ctx.epoch_timestamp_ms(),
        });
        transfer::public_transfer(hero, owner);
        transfer::public_transfer(warrior, owner);
    };

    object::delete(id);
}
