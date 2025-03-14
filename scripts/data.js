export function getCharacterData() {
    let characters = game.actors
        .filter(actor => actor.hasPlayerOwner) // Only include player-controlled characters
        .map(actor => ({
            name: actor.name,
            maxHP: actor.system.attributes.hp.max,
            currentHP: actor.system.attributes.hp.value,
            AC: actor.system.attributes.ac.value,
            abilityScores: {
                STR: actor.system.abilities.str.value,
                DEX: actor.system.abilities.dex.value,
                CON: actor.system.abilities.con.value,
                INT: actor.system.abilities.int.value,
                WIS: actor.system.abilities.wis.value,
                CHA: actor.system.abilities.cha.value
            }
        }));

    return characters;
}
