import { HumanName } from "./human";
import { Location } from "./location"
import { TripSummary } from "../management/tripsummary";
import { RelationshipTag, HumanTag } from "./entityTags";
import { PeopleGraph, CoupleKey } from "./peopleGraph";

export class HateGraph {
    public constraints: Array<Situation>

    constructor(constraints: Array<Situation>) {
        this.constraints = constraints
    }
}

export interface Situation {
    GetApplicableEffects(trip: TripSummary, currentState: PeopleGraph): Array<SituationEffect>
}


export class SituationEffect {
    people: CoupleKey

    addedRelTags: Set<RelationshipTag>
    removedRelTags: Set<RelationshipTag>

    addedHumTags: [Set<HumanTag>, Set<HumanTag>]
    removedHumTags: [Set<HumanTag>, Set<HumanTag>]

    constructor(
        people: CoupleKey, 
        addedRelTags?: Set<RelationshipTag>, 
        removedRelTags?: Set<RelationshipTag>, 
        addedHumTags?: [Set<HumanTag>, Set<HumanTag>], 
        removedHumTags?: [Set<HumanTag>, Set<HumanTag>]) {
            this.people = people
            this.addedRelTags = addedRelTags ?? new Set<RelationshipTag>()
            this.removedRelTags = removedRelTags ?? new Set<RelationshipTag>()
            this.addedHumTags = addedHumTags ??  [new Set<HumanTag>(), new Set<HumanTag>()]
            this.removedHumTags = removedHumTags ?? [new Set<HumanTag>(), new Set<HumanTag>()]

    }
}

export class SimpleSituation implements Situation {
    private haveToBePresent: Array<HumanName>
    private cannotBePresent: Array<HumanName>
    private allowedLocations: Array<Location>

    public effect: Array<SituationEffect>

    constructor(

        haveToBePresent: Array<HumanName>, cannotBePresent: Array<HumanName>, allowedLocations: Array<Location>, effect: Array<SituationEffect>) {

        this.haveToBePresent = haveToBePresent
        this.cannotBePresent = cannotBePresent
        this.allowedLocations = allowedLocations
        this.effect = effect
    }

    public GetApplicableEffects(trip: TripSummary, _: PeopleGraph): Array<SituationEffect> {
        return this.isApplicable(trip) ? this.effect : new Array()
    }

    public isApplicable(trip: TripSummary): boolean {
        let namesPresent = trip.goPeople.map(p => p.name)

        return this.haveToBePresent.every(hp => namesPresent.includes(hp)) &&
            this.cannotBePresent.every(cp => !namesPresent.includes(cp)) &&
            this.allowedLocations.some(loc => loc.name == trip.goLocation?.name)
    }

}