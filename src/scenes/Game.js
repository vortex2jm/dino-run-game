import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {


    constructor() {
        super('game');
    }

    init() {
        this.score = 0;
        this.velo = 0.15;
    }

    preload() {
        
        //loading images
        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('platform', './src/sprites/images/gassPlatform.jpg');
        this.load.image('button', './src/sprites/images/playPause.png');
        this.load.spritesheet('dino', './src/sprites/images/spritesheet.png', {
            frameWidth: 460,
            frameHeight: 410
        });

        
        this.keys = this.input.keyboard.createCursorKeys();
    }
    
    create() {

        const {width , height} = this.scale;
        const style = { color: '#000', fontSize: 24 };

        //adding background
        this.background = this.add.tileSprite(500, 250, width, height, 'background');

        //adding dino
        this.dino = this.physics.add.sprite(200, 250, 'dino').setScale(0.3);
        
        //adding plattform
        this.platform = this.add.tileSprite(500, 400, width, 80, 'platform');
        this.physics.add.existing(this.platform, true);
        
        //adding colision
        this.physics.add.collider(this.dino, this.platform);
        
        //adding text
        this.scoreText = this.add.text(800, 50, 'Score: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);    
        
        //adding buttons
        const playPauseButton = this.add.image(85,70, 'button').setScale(0.03).setInteractive();
        //animating and creating actions on buttons
        playPauseButton.on('pointerover', () => {

            playPauseButton.setScale(0.04);
        })
        playPauseButton.on('pointerout', () => {

            playPauseButton.setScale(0.03);
        })
        playPauseButton.on('pointerdown', () => {

            this.scene.launch('pause');
            this.scene.pause();
        })
        

        //creating dino animations (spritesheet)
        this.anims.create({

            key: "run",
            frames: this.anims.generateFrameNumbers('dino', {start: 0, end: 7}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({

            key: "jump",
            frames: this.anims.generateFrameNumbers('dino', {start: 8, end: 19}),
            frameRate: 15,
            repeat: 1
        })
    }

    update(time) {

        //moving background
        this.background.tilePositionX = time * this.velo;

        //moving platform
        this.platform.tilePositionX = time * this.velo * 2;

        //animating dino
        const touchingDown = this.dino.body.touching.down;
        const kUp = this.keys.up.isDown;
        const kSpace = this.keys.space.isDown;
        const kShift = this.keys.shift.isDown;

        if(touchingDown && (kUp || kSpace)){

            this.dino.setVelocityY(-500);
            this.dino.anims.play("jump");
        }
        else if(touchingDown){

            this.dino.anims.play("run", true);
        }

        //adding key yo pause the game
        if(kShift){

            this.scene.launch('pause');
            this.scene.pause();
        }
        
        this.updateVelo();
        this.updateScore();
    }

    updateScore() {
        this.score++;
        this.scoreText.text = `Score: ${this.score}`;
    }

    updateVelo() {

        this.velo += 0.00001;
    }
}