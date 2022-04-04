import Phaser from '../lib/phaser.js'

export default class Menu extends Phaser.Scene {

    constructor(){

        super('menu');
    }

    init(){};

    preload(){

        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('back', './src/sprites/images/back.png');
    }

    create(){

        const style = { color: '#000000',fontSize: 24};
        const {width, height} = this.scale;

        //adding backgrond and back button
        this.add.image(width/2,height/2,'background');
        const back = this.add.image(90,90,'back').setScale(0.07).setInteractive();

        //creating actions to back button
        back.on('pointerover', () => {back.setScale(0.09)});
        back.on('pointerout', () => {back.setScale(0.07)});
        back.on('pointerdown', () => {this.scene.stop(), this.scene.start('start')});

        //adding text
        const text1 = "SPACE or UP ^    =       jump"
        const text2 = "SHIFT      =     pause/resume"
        const text3 = "\nYou can click on icons too! :)"
        const text4 = "\n\n\n\n     Have a good game!!!    "

        const t1 = this.add.text(width/2, 150, text1, style).setOrigin(0.5);
        this.add.text(width/2, 200, text2, style).setOrigin(0.5);
        this.add.text(width/2, 250, text3, style).setOrigin(0.5);
        this.add.text(width/2, 300, text4, style).setOrigin(0.5);
    }

    update(){};
}