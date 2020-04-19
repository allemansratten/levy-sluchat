import { Level } from "../model/level"
import { Relationship } from "../model/peopleGraph"
import { Human } from "../model/human"
import { HumanTag, RelationshipTag } from "./entityTags"
import {
    Complex,
    EternalCouple,
    MutualCrush,
    NobodyLikesAngryDrunk,
    SituationUtils,
    TimerSituation,
} from "../model/situationTypes"
import { HumanName } from "./humans"
import { LocationName } from "./locations"
import { SituationEffect } from "../model/situation"

export let levels: Array<Level> = []

let locations: LocationName[] = [
    LocationName.Bowling,
    LocationName.Drink,
    LocationName.Park,
    LocationName.Movie,
]

// You is always on the zeroth position

function mutualRelationship(people: [HumanName, HumanName], tags: RelationshipTag[]): [Relationship, Relationship] {
    const tagSet = new Set(tags)
    const [a, b] = people

    return [
        new Relationship([a, b], tagSet),
        new Relationship([b, a], tagSet),
    ]
}

function flattenRelationshipList(relationships: Array<Relationship | [Relationship, Relationship]>) {
    let res = []

    for (const r of relationships) {
        if (r instanceof Relationship) {
            res.push(r)
        } else {
            const [ra, rb] = r
            res.push(ra, rb)
        }
    }

    return res
}

levels.push(
    new Level(
        [
            new Human(HumanName.You),
            new Human(HumanName.Alex),
            new Human(HumanName.Beatrice),
            new Human(HumanName.Cecil),
            new Human(HumanName.Dan),
            new Human(HumanName.Eric),
            new Human(HumanName.Flavie),
        ],
        locations,
        flattenRelationshipList([
            mutualRelationship([HumanName.Alex, HumanName.Beatrice], [RelationshipTag.crush]),
            mutualRelationship([HumanName.Alex, HumanName.Cecil], [RelationshipTag.crush]),
            new Relationship([HumanName.Dan, HumanName.Beatrice], new Set([RelationshipTag.ex, RelationshipTag.crush])),
            new Relationship([HumanName.Dan, HumanName.You], new Set([RelationshipTag.ex])),
            mutualRelationship([HumanName.Eric, HumanName.Alex], [RelationshipTag.crush]),
            mutualRelationship([HumanName.Eric, HumanName.Beatrice], [RelationshipTag.crush]),
            mutualRelationship([HumanName.Dan, HumanName.Flavie], [RelationshipTag.eternal_couple_apart_1]),
        ]),
        [
            [HumanName.Beatrice, HumanTag.promiscuous],
            [HumanName.Cecil, HumanTag.introvert],
            [HumanName.Dan, HumanTag.extrovert],
            [HumanName.Dan, HumanTag.angry_drunk],
        ]
        ,
        [
            // initial fondness
            [[HumanName.Alex, HumanName.Beatrice], 7],
            [[HumanName.Beatrice, HumanName.Alex], 7],
            [[HumanName.Alex, HumanName.Cecil], 7],
            [[HumanName.Cecil, HumanName.Alex], 7],
        ],
        [
            new TimerSituation(),
            new NobodyLikesAngryDrunk(),
            new MutualCrush(),
            new EternalCouple(HumanName.Dan, HumanName.Flavie),
            new Complex({    //Flavie FOMO event 2
                humReq: [HumanName.Alex, HumanName.Beatrice, HumanName.Cecil, HumanName.Dan, HumanName.Eric],
                humTagsReq: [[HumanName.Flavie, HumanTag.flavie_angry]],
                effect: [new SituationEffect().changeFondness([[[HumanName.Flavie, HumanName.You], -10]])
                .setDescription('Flavie came uninvited, chewed you out, and left. Forever.')]
            }),
            new Complex({    //Flavie FOMO event 1
                humReq: [HumanName.Alex, HumanName.Beatrice, HumanName.Cecil, HumanName.Dan, HumanName.Eric],
                humTagsBan: [[HumanName.Flavie, HumanTag.flavie_angry]],
                effect: [new SituationEffect().changeFondness([
                    [[HumanName.Flavie, HumanName.Alex], -1],
                    [[HumanName.Flavie, HumanName.Beatrice], -1],
                    [[HumanName.Flavie, HumanName.Cecil], -1],
                    [[HumanName.Flavie, HumanName.Dan], -1],
                    [[HumanName.Flavie, HumanName.Eric], -1],
                    [[HumanName.Flavie, HumanName.You], -3]
                ]).addHumTags([[HumanName.Flavie, HumanTag.flavie_angry]])
                .setDescription('Flavie is angry that you invited everybody except her.')]
            }),
            new Complex({    // Bowling Brawl     TODO: efekt na ostatní co tam jdou
                humReq: [HumanName.Cecil, HumanName.Dan],
                allowedLocations: [LocationName.Bowling],
                relTagsBan: [[[HumanName.Cecil, HumanName.Dan], RelationshipTag.bowling_brawl]],
                effect: [new SituationEffect().changeFondness([
                    [[HumanName.Cecil, HumanName.Dan], -2],
                    [[HumanName.Dan, HumanName.Cecil,],-2]])
                .addRelTags([[[HumanName.Cecil, HumanName.Dan], RelationshipTag.bowling_brawl]])
                .setDescription('Cecil and Dan bet who could score the most in bowling.' + 
                    ' Dan thought he would win easily, but Cecil did.' + 
                    ' So Dan accused him of cheating, and they got into a fight!')]

            }),

        ],
    ),
)        