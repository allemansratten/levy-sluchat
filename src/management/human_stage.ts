import { Level } from "../model/level"
import { BoardScene } from "./board"
import { Human } from "../model/human"
import { relationshipTagMap } from "../content/entityTags"
import { DEFAULT_FONDNESS } from "../model/peopleGraph"

export class HumanStage {
    private allPeopleTexts: Array<Phaser.GameObjects.Text> = []
    private allPeopleCircles: Array<Phaser.GameObjects.Ellipse> = []
    private allPeopleLines: Array<Phaser.GameObjects.Group> = []
    private allPeopleWarning: Array<Phaser.GameObjects.Text> = []
    private TEXT_ALPHA_OK = 1
    private TEXT_ALPHA_BD = 0.3
    private CIRCLE_ALPHA_OK = 0.2
    private CIRCLE_ALPHA_BD = 0
    private WARNING_ALPHA_OK = 0.9
    private WARNING_ALPHA_BD = 0
    private positions: Array<{ x: number, y: number }>
    private positionsInner: Array<{ x: number, y: number }>

    constructor(private scene: BoardScene, private level: Level) {
        const centerX = 450
        const centerY = 180
        const radius = 150
        const radiusInner = 145

        this.positions = level.humans.map((_, i: number) => {
            const angle = 2 * Math.PI * (i + 0.5) / level.humans.length
            return {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
            }
        })

        this.positionsInner = level.humans.map((_, i: number) => {
            const angle = 2 * Math.PI * (i + 0.5) / level.humans.length
            return {
                x: centerX + Math.cos(angle) * radiusInner,
                y: centerY + Math.sin(angle) * radiusInner,
            }
        })

        for (let i in level.humans) {
            let human = level.humans[i]
            const position = this.positions[i]


            let circle = scene.add.ellipse(0, 0, 80, 80, 0x2e2e2e)
                .setOrigin(0.5, 0.5)
                .setAlpha((Number(i) == 0 ? this.CIRCLE_ALPHA_OK : this.CIRCLE_ALPHA_BD))

            let image = scene.add.image(0, 0, 'portrait_small', i)
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    this.display(human, Number(i))
                })
                .on('pointerout', () => {
                    this.display(level.humans[0], 0)
                })

            let text = scene.add.text(0, 0, `${human.name}`, {
                fill: '#1c1c1c',
                fontFamily: 'Roboto',
                fontSize: '18px',
            })
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true })
                .setAlpha(Number(i) == 0 ? this.TEXT_ALPHA_OK : this.TEXT_ALPHA_BD)

            let warning = scene.add.text(0, 0, '!', {color: '#ff0000', fontSize: '33px'})
                .setOrigin(0.5, 0.5)
                .setAlpha(this.WARNING_ALPHA_OK)

            scene.add.group([image, text, circle, warning]).setXY(position.x, position.y)

            // TBH I have no idea why this is not relative to the group, but whatevs
            text.setPosition(position.x, position.y + 100 + 10)
            circle.setPosition(position.x, position.y + 50 + 10)
            image.setPosition(position.x, position.y + 45 + 10)
            warning.setPosition(position.x + 19, position.y + 30)

            if (Number(i) != 0) {
                const onClick = () => {
                    if (scene.tripSummary.flipGoPeople(human)) {
                        scene.tweens.add({
                            targets: text,
                            alpha: { from: this.TEXT_ALPHA_BD, to: this.TEXT_ALPHA_OK },
                            duration: 500,
                        })
                        scene.tweens.add({
                            targets: circle,
                            alpha: { from: this.CIRCLE_ALPHA_BD, to: this.CIRCLE_ALPHA_OK },
                            duration: 500,
                        })
                    } else {
                        scene.tweens.add({
                            targets: text,
                            alpha: { from: this.TEXT_ALPHA_OK, to: this.TEXT_ALPHA_BD },
                            duration: 500,
                        })
                        scene.tweens.add({
                            targets: circle,
                            alpha: { from: this.CIRCLE_ALPHA_OK, to: this.CIRCLE_ALPHA_BD },
                            duration: 500,
                        })
                    }
                }

                text.on('pointerdown', onClick)
                circle.on('pointerdown', onClick)
                image.on('pointerdown', onClick)
            }

            this.allPeopleTexts.push(text)
            this.allPeopleCircles.push(circle)
            this.allPeopleWarning.push(warning)
        }

        this.redrawLines(level)
    }

    public bleachPeople() {
        for (let i in this.level.humans) {
            if (Number(i) != 0) {
                this.allPeopleTexts[i].setAlpha(this.TEXT_ALPHA_BD)
                this.allPeopleCircles[i].setAlpha(this.CIRCLE_ALPHA_BD)
            }
        }
    }

    public display(human: Human, index: number) {
        for (let i in this.allPeopleLines) {
            // I very much admit that this is super slow and unoptimized
            // BUT WTF IS NOT GROUP ALPHA EXPOSED PUBLICLY
            if (Number(i) == index) {
                for (let child of this.allPeopleLines[i].children.getArray()) {
                    this.scene.tweens.add({
                        targets: child,
                        alpha: { from: (child as Phaser.GameObjects.Line).alpha, to: 1 },
                        duration: 300,
                    })
                }
            } else {
                for (let child of this.allPeopleLines[i].children.getArray()) {
                    this.scene.tweens.add({
                        targets: child,
                        alpha: { from: (child as Phaser.GameObjects.Line).alpha, to: 0 },
                        duration: 300,
                    })
                }
            }
        }
        this.scene.phone!.display(human, Number(index))
    }

    private linearScaleBlack(level: number): number {
        // level is 0 to 1
        // return Math.round(level*255*255*255) + Math.round(level*255) + Math.round(level*255)

        // aint got time to do this properly
        // level is 0 to 10
        if (level <= 1) {
            return 0xde0000
        } else if (level <= 2) {
            return 0xcf3636
        } else if (level <= 3) {
            return 0xd46c6c
        } else if (level <= 4) {
            return 0xb08787
        } else if (level <= 5) {
            return 0xa3a3a3
        } else if (level <= 6) {
            return 0x93a390
        } else if (level <= 7) {
            return 0x73ba7a
        } else if (level <= 8) {
            return 0x62bd6b
        } else if (level <= 9) {
            return 0x3bb847
        } else {
            return 0x00de13
        }
    }

    public redrawLines(level: Level) {
        for (let g of this.allPeopleLines) {
            g.destroy(true)
        }
        this.allPeopleLines = []

        let peopleGraph = level.friendshipManager.peopleGraph
        for (let hi1 in level.humans) {
            let human1 = level.humans[hi1]
            let group = this.scene.add.group()
                .setXY(0, 50)
            for (let hi2 in level.humans) {
                let human2 = level.humans[hi2]
                if (hi1 == hi2)
                    continue

                // change fw
                let youChange = human1.name == 'You'
                if (youChange) {
                    let tmp = human2
                    human2 = human1
                    human1 = tmp
                }

                let tags = Array
                    .from(peopleGraph.getRelTags([human1.name, human2.name]))
                    .filter((x) => relationshipTagMap.has(x))
                let fondness = peopleGraph.getFondness([human1.name, human2.name])

                let graphics = this.scene.add.graphics()

                if (fondness != DEFAULT_FONDNESS || tags.length != 0) {
                    let diffX = (this.positionsInner[hi1].x - this.positionsInner[hi2].x)
                    let diffY = (this.positionsInner[hi1].y - this.positionsInner[hi2].y)
                    let diffXN = diffX / Math.sqrt(diffX * diffX + diffY * diffY)
                    let diffYN = diffY / Math.sqrt(diffX * diffX + diffY * diffY)

                    let color = this.linearScaleBlack(fondness)

                    let x1 = this.positionsInner[hi1].x - 45 * diffXN
                    let y1 = this.positionsInner[hi1].y + 60 - 45 * diffYN
                    let x2 = this.positionsInner[hi2].x + 45 * diffXN
                    let y2 = this.positionsInner[hi2].y + 60 + 45 * diffYN
                    let line = this.scene.add.line(0, 0,
                        x1, y1, x2, y2,
                        color,
                        0.3)
                        .setOrigin(0, 0)
                        .setLineWidth(2)
                    group.add(line)


                    let triangle = this.scene.add.triangle(youChange ? x1 : x2, youChange ? y1 : y2, -10, 0, 10, 0, 0, 10, color)
                        .setOrigin(0, 0)
                        .setRotation(Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2 + (youChange ? Math.PI : 0))
                    group.add(triangle)
                }

                for (let i in tags) {
                    let tag = tags[i]
                    let avgX = (this.positionsInner[hi1].x + this.positionsInner[hi2].x) / 2
                    let avgY = (this.positionsInner[hi1].y + this.positionsInner[hi2].y) / 2 + 60
                    let symbol = this.scene.add.image(avgX + (Number(i) - tags.length / 2 + 0.4) * 27, avgY, 'rel_tags')
                        .setFrame(tag)
                        .setDisplaySize(25, 25)
                    group.add(symbol)
                }

                // change back 
                if (youChange) {
                    let tmp = human2
                    human2 = human1
                    human1 = tmp
                }
            }
            group.setAlpha(0)
            this.allPeopleLines.push(group)



            let fondnessBad : boolean = this.level.humans.map(
                x => x.name == human1.name ? 10 : this.level.friendshipManager.peopleGraph.getFondness([human1.name, x.name])
            ).some(x => x <= 2)
            this.allPeopleWarning[hi1].setAlpha(fondnessBad ? this.WARNING_ALPHA_OK : this.WARNING_ALPHA_BD)
        }
    }
}
