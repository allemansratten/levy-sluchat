import { HateGraph, SimpleSituation } from "./hateGraph"
import { Level } from "./level"
import { RelationshipTag, Relationship } from "./peopleGraph"
import { Human, HumanTag } from "./human"

export let levels: Array<Level> = []

let locations = [
    { name: 'Bowling', limit: { min: 2, max: 5 } },
    { name: 'Drink', limit: { min: 2, max: 4 } },
    { name: 'Forest', limit: { min: 2, max: 6 } },
    { name: 'Movie', limit: { min: 2, max: 6 } },
]

// You is always on the zeroth position

levels.push(
    new Level(
        [
            new Human('You', [], new Set([HumanTag.angry_drunk])),
            new Human('Kate', [], new Set([HumanTag.good_bowler])),
            new Human('Lucian', [], new Set([HumanTag.jealous])),
            new Human('Matthew', [], new Set([HumanTag.promiscuous])),
        ],
        locations,
        [
            new Relationship(['Kate', 'Lucian'], new Set([RelationshipTag.friend_like])),
        ],
        new HateGraph([
            new SimpleSituation(
                ['Kate', 'Lucian'],
                ['Matthew'],
                locations,
                [
                    {
                        people: ['Kate', 'Lucian'], 
                        addedRelTags: new Set([RelationshipTag.crush]), 
                        addedHumTags: [new Set([HumanTag.sad_drunk]), new Set<HumanTag>()],
                        removedRelTags: new Set<RelationshipTag>(),
                        removedHumTags: [new Set<HumanTag>(),new Set<HumanTag>()],
                    },
                ]
            )
            ,
        ]),
    ),
)