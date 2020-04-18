import { HateGraph } from "./hateGraph"
import { Level } from "./level"

export let levels: Array<Level> = []

let locations = [
    {name: 'Bowling', limit: {min: 2, max: 5}},
    {name: 'Drink', limit: {min: 2, max: 4}},
    {name: 'Forest', limit: {min: 2, max: 6}},
    {name: 'Movie', limit: {min: 2, max: 6}},
]

levels.push(
    new Level(
        [
            {name: 'Kate', relationships: []},
            {name: 'Lucian', relationships: []},
            {name: 'Mathew', relationships: []},
        ],
        locations,
        [
            {people: [{name: 'Kate'}, {name: 'Mathew'}], level: -1},
        ],
        new HateGraph([
            {
                haveToBePresent: [{name: 'Kate'}, {name: 'Lucian'}],
                cannotBePresent: [{name: 'Mathew'}],
                allowedLocations: locations,
                effect: [
                    {people: [{name: 'Kate'}, {name: 'Lucian'}], relationshipChange: +1},
                    {people: [{name: 'Lucian'}, {name: 'Kate'}], relationshipChange: +1},
                    {people: [{name: 'Mathew'}, {name: 'Kate'}], relationshipChange: -1},
                ],
            },
        ]),
    ),
)