import Phaser from "../lib/phaser.js"

export default class Pause extends Phaser.Scene{

    constructor(){

        super('pause');
    }

    init(){};

    preload(){

        //loading images
        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('home', './src/sprites/images/home.png');
        this.load.image('restart', './src/sprites/images/restart.png');
        this.load.image('button', './src/sprites/images/playPause.png');

        //create keyboard object
        this.keys = this.input.keyboard.createCursorKeys();
    }

    create(){

        //standard data
        const {width, height} = this.scale;

        //adding background
        this.add.image(width/2, height/2, 'background');

        //creating buttons and your own actions
        const playPauseButton = this.add.image(width/2, height/2,'button').setScale(0.1).setInteractive();
        playPauseButton.on('pointerover', ()=> {playPauseButton.setScale(0.12)});
        playPauseButton.on('pointerout', ()=> {playPauseButton.setScale(0.1)});
        playPauseButton.on('pointerdown', ()=> {
            this.scene.resume('game');
            this.scene.stop();
        })

        const home = this.add.image(900,410, 'home').setScale(0.15).setInteractive();
        home.on('pointerover', ()=> {home.setScale(0.22)});
        home.on('pointerout', ()=> {home.setScale(0.15)});
        home.on('pointerdown', ()=> {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('start');
        })

        const restart = this.add.image(100, 410, 'restart').setScale(0.15).setInteractive();
        restart.on('pointerover', ()=> {restart.setScale(0.22)});
        restart.on('pointerout', ()=> {restart.setScale(0.15)});
        restart.on('pointerdown', ()=> {
            this.scene.stop('game');
            this.scene.stop('pause');
            this.scene.start('game');
        })
    }

    update(){

        //creating action to shift key
        const kShift = this.keys.shift.isDown;

        if(kShift){

            this.scene.resume('game');
            this.scene.stop();
        }
    }
}