import { HateGraph, SituationEffect } from "./hateGraph"
import { Level } from "./level"
import { Relationship, CoupleKey } from "./peopleGraph"
import { Human } from "./human"
import { HumanTag, RelationshipTag } from "./entityTags"
import { SimpleSituation } from "./situationTypes"

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
            new Human('You'),
            new Human('Alex'),
            new Human('Beatrice'),
            new Human('Cecil'),
            new Human('Dan'),
        ],
        locations,
        [
            new Relationship(['Alex', 'Beatrice'], new Set([RelationshipTag.crush])),
            new Relationship(['Beatrice', 'Alex'], new Set([RelationshipTag.crush])),
            new Relationship(['Alex', 'Cecil'], new Set([RelationshipTag.crush])),
            new Relationship(['Cecil', 'Alex'], new Set([RelationshipTag.crush])),
        ],
        [
            ['Alex', HumanTag.promiscuous],
            ['Cecil', HumanTag.introvert],
            ['Dan', HumanTag.extrovert],
            ['Dan', HumanTag.angry_drunk],
            // ['Matthew', HumanTag.promiscuous],
            // ['Matthew', HumanTag.disagreeable],
            // ['Matthew', HumanTag.good_bowler],
            // ['Matthew', HumanTag.extrovert],
            // ['Matthew', HumanTag.jealous],
            // ['Matthew', HumanTag.sad_drunk],
        ]
        ,
        new HateGraph([
            new SimpleSituation(
                ['Kate', 'Lucian'],
                ['Matthew'],
                locations,
                [
                    new SituationEffect(
                        [[['Kate', 'Lucian'], RelationshipTag.crush]],
                        [],
                        [['Kate', HumanTag.sad_drunk]],
                        []
                    )
                ]
            )
            ,
        ]),
    ),
)