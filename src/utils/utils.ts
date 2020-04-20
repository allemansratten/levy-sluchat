import { Human } from "../model/human";
import { HumanNameIndex } from "../content/humans";

export class Utils {
    public static drawPortraits(humans: Array<Human>, scene: Phaser.Scene): Phaser.GameObjects.Group {
        let group = scene.add.group()
            .setOrigin(0.5, 0.5)
        for (let hi in humans) {
            let human = humans[hi]
            let index = HumanNameIndex.indexOf(human.name)
            let circle = scene.add.ellipse(50 + 400 - humans.length * 100 / 2 + Number(hi) * 100, 50, 80, 80, 0x2e2e2e)
                .setDepth(3000)
            let image = scene.add.image(50 + 400 - humans.length * 100 / 2 + Number(hi) * 100, 50, 'portrait_small', index)
                .setDepth(3001)
            let text = scene.add.text(50 + 400 - humans.length * 100 / 2 + Number(hi) * 100, 95, `${human.name}`, {
                fill: '#e0e0e0',
                fontFamily: 'Roboto',
                fontSize: '18px',
            })
                .setDepth(3001)
                .setOrigin(0.5, 0)
            group.add(image)
            group.add(circle)
            group.add(text)
        }

        return group
    }
}