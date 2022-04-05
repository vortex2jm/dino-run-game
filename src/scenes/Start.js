import Phaser from '../lib/phaser.js'

export default class Start extends Phaser.Scene {

    constructor() {
        super('start');
    }

    init(){};

    preload() {
       
        // this.load.image('dinoRun', './src/sprites/images/dinoRun.png');
        this.load.image('spaceButton', './src/sprites/images/spaceRed.png');
        this.load.image('background','./src/sprites/images/background2.png');
        this.load.spritesheet('dinoRun','./src/sprites/images/spritesheet.png',{frameWidth: 460, frameHeight:410});
        this.load.image('menu', './src/sprites/images/menu.png');

        this.load.audio('music', './src/sprites/sounds/Happy walk.mp3');
    }

    create() {

        //standard data
        const {width, height} = this.scale; 
        const style = { color: '#000000',fontSize: 24 };
        
        //playing music
        this.sound.play('music');

        //adding background
        this.add.image(width/2, height/2, 'background');

        //adding dino spritesheet and creating animation
        this.dino = this.add.sprite(width/2, 300, 'dinoRun').setScale(0.4);
        this.anims.create({

            key: 'run',
            frames: this.anims.generateFrameNumbers('dinoRun', {start: 0, end: 7}),
            frameRate: 12,
            repeat: -1
        })

        //creating start button and his actions
        const spaceButton = this.add.image(width/2, 125 , 'spaceButton').setScale(0.45).setInteractive();
        spaceButton.on('pointerdown', () => {

            // this.sound.stopAll();
            this.scene.start('game');
        })

        //creating menu button and his actions
        const menu = this.add.image(70,430,'menu').setScale(0.15).setInteractive();
        menu.on('pointerover', () => {menu.setScale(0.2)});
        menu.on('pointerout', () => {menu.setScale(0.15)});
        menu.on('pointerdown', () => {this.scene.stop(), this.scene.start('menu')});
        
        //adding text
        this.add.text(500, 50, 'Press SPACE to start', style).setOrigin(0.5);

        //intializing game by keyboard
        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.stopAll(); 
            this.scene.start('game');
        })

        //button animation
        setInterval(()=>{

            if(spaceButton.scale == (0.45)) spaceButton.setScale(0.4);
            else spaceButton.setScale(0.45);

        },500);
    }


    update(){

        //running dino animation
        this.dino.anims.play("run", true);
    };
}