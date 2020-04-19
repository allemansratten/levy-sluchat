import { Human } from './human'
import { LocationName } from '../content/locations'

export class TripSummary {
    public goPeople: Array<Human> = new Array<Human>()
    public goLocation?: LocationName

    constructor(specialGuest: Human) {
        this.goPeople.push(specialGuest)
    }

    public removeGoPeople(human: Human): boolean {
        let prevSize = this.goPeople.length
        this.goPeople = this.goPeople.filter(x => x.name !== human.name)
        return prevSize != this.goPeople.length
    }

    public flipGoPeople(human: Human): boolean {
        if (this.removeGoPeople(human)) {
            // deleted
            return false
        } else {
            // not deleted, so add
            this.goPeople.push(human)
            return true
        }
    }

    public prepare(location: LocationName) {
        this.goLocation = location
    }
}