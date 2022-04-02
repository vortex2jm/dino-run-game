import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('pause');
    }

    preload() {

        this.keys = this.input.keyboard.createCursorKeys();
    }

    create() {
        
        this.add.image(500, 250, 'background');

        const playPauseButton2 = this.add.image(500,250, 'button').setScale(0.1).setInteractive();

        playPauseButton2.on('pointerover', () => {

            playPauseButton2.setScale(0.12);
        })
        playPauseButton2.on('pointerout', () => {

            playPauseButton2.setScale(0.1);
        })
        playPauseButton2.on('pointerdown', () => {

            this.scene.resume('game');
            this.scene.stop();
        })
    }

    update(){

        const kShift = this.keys.shift.isDown;

        if(kShift){

            this.scene.resume('game');
            this.scene.stop();
        }
    };
}