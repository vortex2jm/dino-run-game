import Phaser from "../lib/phaser.js"

export default class Game extends Phaser.Scene{

    constructor(){
        super('game');
    }

    init(){
        //presetting variables
        this.velocity = 1;
        this.velocity2 = 1;
        this.score = 0;
        this.cactusVelocity = -400;
        this.obstacleExists = false;
    }

    preload(){
        //loading images and spritesheets
        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('platform', './src/sprites/images/gassPlatform.jpg');
        this.load.image('button', './src/sprites/images/playPause.png');
        this.load.image('cactus', './src/sprites/images/car.png');
        this.load.spritesheet('dino', './src/sprites/images/spritesheet.png', {
            frameWidth: 460,
            frameHeight: 410
        });
        //creating keyboard object
        this.keys = this.input.keyboard.createCursorKeys();

        this.load.audio('music2', './src/sprites/sounds/happywalk.mp3');
        this.load.audio('jumpAudio', './src/sprites/sounds/jump02.mp3');
    }

    create(){

        this.jumpAudio = this.sound.add('jumpAudio', {loop: false, volume: 0.1});
        this.music2 = this.sound.add('music2', {loop: true, volume: 0.2});
        this.music2.play();

        //standard data
        const {width, height} = this.scale;
        const style = {color: '#000', fontSize: 24};

        //adding platform and background as a tilesprite
        this.background = this.add.tileSprite(width/2, height/2, width, height, 'background');
        this.platform = this.add.tileSprite(width/2, 400, width, 80, 'platform');
        this.physics.add.existing(this.platform, true);

        //adding dino as spritesheet
        this.dino = this.physics.add.sprite(200, height/2, 'dino')
        .setScale(0.25)
        .setSize(250,370)
        // .setOffset(-150,-30);

        //adding physics
        this.physics.add.collider(this.dino, this.platform);

        //adding text
        this.scoreText = this.add.text(800, 50, 'Score: 0', style);

        //adding actions to playPause button
        const playPauseButton = this.add.image(85,70,'button').setScale(0.03).setInteractive();
        playPauseButton.on('pointerover', ()=> {playPauseButton.setScale(0.04)});
        playPauseButton.on('pointerout', ()=> {playPauseButton.setScale(0.03)});
        playPauseButton.on('pointerdown', ()=> {
            this.scene.launch('pause');
            this.scene.pause();
        })

        //creating animations to dino
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', {start: 0, end: 7}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dino', {start: 9, end: 19}),
            frameRate: 12,
            repeat: 1
        })

        //creating group that will receive cactus
        this.obstacleGroup = this.add.group();
        this.physics.add.collider(this.platform, this.obstacleGroup);
        this.physics.add.collider(this.obstacleGroup, this.dino, ()=> {
            this.scene.stop();
            this.scene.start('game_over', {score: this.score});
            this.game.sound.stopAll();
        }, undefined, this);
    }

    update(){
        //creating background and platform animations
        this.background.tilePositionX = this.velocity * this.velocity2;
        this.platform.tilePositionX = this.velocity * this.velocity2 * 2;

        //creating keys objects
        const touchingDown = this.dino.body.touching.down;
        const kUp = this.keys.up.isDown;
        const kSpace = this.keys.space.isDown;
        const kShift = this.keys.shift.isDown;

        //defining actions to keys
        if(touchingDown && (kUp || kSpace)){

            this.dino.setVelocityY(-600);
            this.dino.anims.play('jump', true);
            this.jumpAudio.play();
        }
        else if(touchingDown){
            this.dino.anims.play('run', true);
        }

        if(kShift){
            this.scene.launch('pause');
            this.scene.pause();
        }

        //additional funcions
        this.updateVelocity();
        this.updateScore();
        this.updateGroup();
    }


    //additional functions implementation
    updateVelocity(){
        //updating velocities
        this.velocity += 3;
        this.velocity2 += 0.0001;
        this.cactusVelocity -= 0.1;
    }

    updateScore(){
        //updating score
        this.score++;
        this.scoreText.text = `Score: ${this.score}`;
    }

    createCactus(posXadd){
        //creating cactus, adding animation and inclding to group
        this.obstacle = this.physics.add.sprite(this.scale.width + posXadd, 300, 'cactus')
        .setScale(0.08)
        .setSize(2300, 800)

        this.obstacle.setImmovable(true);
        this.obstacle.body.setAllowGravity(false);
        this.obstacle.setVelocityX(this.cactusVelocity);
        this.obstacleGroup.add(this.obstacle);
    }

    updateGroup(){
        //creating conditions to insert the group in game
        if(!this.obstacleExists){
            let posXadd = Phaser.Math.Between(0,2000);
            this.createCactus(posXadd);
            this.obstacleExists = true;
        }
        else{
            if(this.obstacle.x < -250) this.obstacleExists = false
        }
    }
}