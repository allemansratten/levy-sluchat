import { Human } from "./human"
import { HumanTag, RelationshipTag, relationshipTagMap } from "../content/entityTags"
import { HumanName } from "../content/humans"

type EdgeKey = string
export type CoupleKey = [HumanName, HumanName]

export const MIN_FONDNESS = 0
export const DEFAULT_FONDNESS = 5
export const MAX_FONDNESS = 10

export class PeopleGraph {
    private relationshipTags: Map<EdgeKey, Set<RelationshipTag>> = new Map()
    private fondness: Map<EdgeKey, number> = new Map()
    private humansTags: Map<HumanName, Set<HumanTag>> = new Map()

    private oriented: Boolean = true

    constructor(
        people: Human[] = [],
        initialRelationships: Array<Relationship> = [],
        initialTags: Array<[HumanName, HumanTag]>,
        initialFondness: Array<[CoupleKey, number]>,
    ) {
        people.forEach(h => {
            people.forEach(hh => {
                if (h.name != hh.name) {
                    this.setRelTags([h.name, hh.name], new Set<RelationshipTag>())
                    this.fondness.set(this.toEdgeKey([h.name, hh.name]), DEFAULT_FONDNESS)
                }
            })
        })

        initialTags.forEach(hTagTuple => {
            let [hName, hTag] = hTagTuple
            this.addHumTag(hName, hTag)
        })

        initialRelationships.forEach(rel => {
            this.setRelTags(rel.people, rel.tags)
        })

        initialFondness.forEach(([couple, fondness]) => {
            console.assert(MIN_FONDNESS <= fondness && fondness <= MAX_FONDNESS)
            this.fondness.set(this.toEdgeKey(couple), fondness)
        })
    }

    public addHumTag(person: HumanName, tag: HumanTag) {
        let hTags = this.humansTags.get(person) ?? new Set<HumanTag>()
        hTags.add(tag)
        this.humansTags.set(person, hTags)
    }

    public removeHumTag(person: HumanName, tag: HumanTag): boolean {
        return this.humansTags.get(person)?.delete(tag) ?? false
    }

    public getHumTags(person: HumanName): Set<HumanTag> {
        return this.humansTags.get(person) ?? new Set()
    }

    public setRelTags(people: CoupleKey, tags: Set<RelationshipTag>) {
        let graphKey = this.toEdgeKey(people)
        this.relationshipTags.set(graphKey, tags)
    }

    public getRelTags(people: CoupleKey): Set<RelationshipTag> {
        let graphKey = this.toEdgeKey(people)
        return this.relationshipTags.get(graphKey)!
    }

    public addRelTag(people: CoupleKey, tag: RelationshipTag) {
        this.getRelTags(people)?.add(tag)
    }

    public removeRelTag(people: CoupleKey, tag: RelationshipTag): boolean {
        return this.getRelTags(people)?.delete(tag) ?? false
    }

    public changeFondness(people: CoupleKey, change: number) {
        let to = this.fondness.get(this.toEdgeKey(people))! + change
        to = Math.min(to, MAX_FONDNESS)
        to = Math.max(to, MIN_FONDNESS)
        this.setFondness(people, to)
    }

    public setFondness(people: CoupleKey, to: number) {
        this.fondness.set(this.toEdgeKey(people), to)
    }

    public getOutRelationships(person: HumanName): Array<Relationship> {
        let result = new Array

        this.relationshipTags.forEach((val, key) => {
            if (key.startsWith(HumanName[person])) {
                result.push(new Relationship(this.fromEdgeKey(key), val))
            }
        })

        return result
    }

    public getInRelationships(person: HumanName): Array<Relationship> {
        let result = new Array

        this.relationshipTags.forEach((val, key) => {
            if (key.endsWith(HumanName[person])) {
                result.push(new Relationship(this.fromEdgeKey(key), val))
            }
        })

        return result
    }

    public getRelationshipsBetween(a: HumanName, b: HumanName): Array<RelationshipTag> {
        return Array.from(this.relationshipTags.get(this.toEdgeKey([a, b])) ?? [])
    }

    public getMutualRelationshipsBetween(a: HumanName, b: HumanName): Array<RelationshipTag> {
        let ab = this.getRelationshipsBetween(a, b)
        let ba = this.getRelationshipsBetween(b, a)

        return intersection(ab, ba)
    }

    public getAllRelationships(): Relationship[] {
        let res = new Array

        this.relationshipTags.forEach((tags, edgeKey) => {
            const couple = this.fromEdgeKey(edgeKey)
            res.push(new Relationship(couple, tags))
        })

        return res
    }

    private toEdgeKey(unorderedPair: CoupleKey): EdgeKey {
        let [a, b] = unorderedPair
        let orderedPair = a <= b || this.oriented ? [a, b] : [b, a]

        return orderedPair.map(v => v).join('|')
    }

    private fromEdgeKey(key: EdgeKey): CoupleKey {
        let names = key.split('|')
        console.assert(names.length == 2)

        return [names[0] as HumanName, names[1] as HumanName]
    }
}

export class Relationship {
    people: CoupleKey
    tags: Set<RelationshipTag>

    constructor(people: CoupleKey, tags?: Set<RelationshipTag>) {
        this.people = people
        this.tags = tags ?? new Set<RelationshipTag>()
    }

    // @deprecated
    public toString(): string {
        return `${this.people[1]}: ${Array.from(this.tags).map((x) => relationshipTagMap.get(x) ?? "?").join(', ')}`
    }
}

export function intersection<T>(as: T[], bs: T[]): T[] {
    let res = new Array

    for (const a of as) {
        if (bs.includes(a)) {
            res.push(a)
        }
    }

    return res
}