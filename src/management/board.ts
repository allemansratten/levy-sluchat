import {levels } from '../content/levels'
import { TripSummary } from '../model/tripSummary'
import { PhoneStage } from './phone_stage'
import { HumanStage } from './human_stage'
import { LocationStage } from './location_stage'
import { LocationName } from '../content/locations'
import {Level} from "../model/level"

export class BoardScene extends Phaser.Scene {
    private tripFader?: Phaser.GameObjects.Rectangle
    private transitionFader?: Phaser.GameObjects.Rectangle
    private infoText?: Phaser.GameObjects.Text
    private level: Level
    
    public tripSummary: TripSummary
    public phone?: PhoneStage
    private humanStage?: HumanStage
    private locationStage?: LocationStage

    constructor() {
        super({
            key: 'management',
        });
        this.level = levels[0]
        this.tripSummary = new TripSummary(this.level.humans[0])
    }

    public preload() {
        this.transitionFader = this.add.rectangle(0, 0, 800, 500, 0x0)
            .setOrigin(0, 0)
            .setDepth(2001)

        let music = this.sound.add('main_music', {
            volume: 0.5,
            loop: true,
        }).play()
    }

    public create() {

        this.add.image(0, 0, 'board_background')
            .setOrigin(0, 0)

        this.tripFader = this.add.rectangle(0, 0, 800, 500, 0x0)
            .setOrigin(0, 0)
            .setDepth(1001)
            .setAlpha(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.goBack())
        this.infoText = this.add.text(400, 200, '', { fill: '#fff', fontFamily: 'Roboto', fontSize: '20px' })
            .setDepth(1001)
            .setAlpha(0)
            .setAlign('center')
            .setWordWrapWidth(400)
            .setOrigin(0.5, 0.5)

        this.locationStage = new LocationStage(this, this.level)
        this.humanStage = new HumanStage(this, this.level)
        this.phone = new PhoneStage(this)

        this.add.tween({
            targets: this.transitionFader,
            alpha: { from: 1, to: 0 },
            duration: 500,
        })
    }

    public goOut(location: LocationName) {
        this.tripSummary.prepare(location)
        let message = this.level.goOut(this.tripSummary)
        this.tripFader!.input.enabled = false
        this.locationStage!.enable(false)
        this.infoText!.setText(message)
        this.add.tween({
            targets: [this.infoText, this.tripFader],
            alpha: { from: 0, to: 1 },
            duration: 1000,
            onComplete: () => {
                this.tripFader!.input.enabled = true
                this.locationStage!.enable(true)
                this.refresh()
            }
        })
    }

    private goBack() {
        this.humanStage!.bleachPeople()
        this.tripFader!.input.enabled = false
        this.add.tween({
            targets: [this.infoText, this.tripFader],
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => this.tripFader!.input.enabled = true
        })
    }

    private refresh() {
        this.tripSummary = new TripSummary(this.level.humans[0])
        this.phone?.display(this.level.humans[0], 0)
        this.humanStage?.redrawLines(this.level)
    }
}