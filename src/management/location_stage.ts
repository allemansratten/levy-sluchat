import { Level } from "../content/level"
import { BoardScene } from "./board"

export class LocationStage {
    private allLocationImage: Array<Phaser.GameObjects.Image> = []

    constructor(scene: BoardScene, level: Level) {
        // scene.add.rectangle(680, 0, 120, 500, 0xcccccc)
        //     .setOrigin(0, 0)
        let text = scene.add.text(700, 10, 'Go to:', { fill: 'black', fontFamily: 'Roboto' })


        for (let i in level.locations) {
            let location = level.locations[i]
            let img = scene.add.image(695, 40 + Number(i) * 110, 'location_thumb')
                .setFrame(i)
                .setInteractive({ useHandCursor: true })
                .setOrigin(0, 0)
                .setDisplaySize(90, 90)
                .on('pointerdown', () => {
                    scene.goOut(location)
                    scene.tripSummary.goLocation = location
                })
            this.allLocationImage.push(img)
            let text = scene.add.text(700, 40 + Number(i) * 110, `${location.name}`, { fill: 'black', fontFamily: 'Roboto' })
        }
    }

    public enable(value: boolean) {
        for (let img of this.allLocationImage) {
            img.input.enabled = value
        }
    }
}