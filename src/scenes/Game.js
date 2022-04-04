import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    constructor() {
        super('game');
    }

    init() {

        this.score = 0;
        this.velocity = 1;
        this.velocity2 = 1;
        this.obstacleExists = false;
        this.cactusVelocity = -400;
        this.obstaclesArray = ['cactus', 'cactus2', 'cactus3'];
    }

    preload() {
        
        //loading images
        this.load.image('background', './src/sprites/images/background2.png');
        this.load.image('platform', './src/sprites/images/gassPlatform.jpg');
        this.load.image('button', './src/sprites/images/playPause.png');
        this.load.spritesheet('dino', './src/sprites/images/spritesheet.png', {frameWidth: 460, frameHeight: 410});
        this.load.image('cactus', './src/sprites/images/cactus1.png');

        this.keys = this.input.keyboard.createCursorKeys();
    }
    
    create() {

        
        const {width , height} = this.scale;
        const style = { color: '#000', fontSize: 24 };

        //adding background
        this.background = this.add.tileSprite(width/2, height/2, width, height, 'background');

        //adding dino
        this.dino = this.physics.add.sprite(200, height/2, 'dino').setScale(0.3);
        
        //adding plattform
        this.platform = this.add.tileSprite(width/2, 400, width, 80, 'platform');
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
        playPauseButton.on('pointerover', () => {playPauseButton.setScale(0.04);})
        playPauseButton.on('pointerout', () => {playPauseButton.setScale(0.03);})
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

        //creating obstacle group
        this.obstaclesGroup = this.add.group();
        this.physics.add.collider(this.platform, this.obstaclesGroup);
        this.physics.add.collider(this.obstaclesGroup, this.dino,() => {
            this.scene.stop();
            this.scene.start('game_over', {score: this.score})}, undefined, this);
    }

    update() {

        //moving background
        this.background.tilePositionX = this.velocity * this.velocity2;
        //moving platform
        this.platform.tilePositionX = this.velocity * 2 * this.velocity2;


        //animating dino
        const touchingDown = this.dino.body.touching.down;
        const kUp = this.keys.up.isDown;
        const kSpace = this.keys.space.isDown;
        const kShift = this.keys.shift.isDown;

        if(touchingDown && (kUp || kSpace)){

            this.dino.setVelocityY(-600);
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
        
        //additional functions
        this.updateVelo();
        this.updateScore();
        this.updateGroup();
    }

    
    updateScore() {
        this.score++;
        this.scoreText.text = `Score: ${this.score}`;
    }

    updateVelo() {

        this.velocity += 3;
        this.velocity2 += 0.0001;
        this.cactusVelocity += -0.1;
    }

    updateGroup() {
        
        if(!this.obstacleExists){

            let posXadd = Phaser.Math.Between(0,2000);
            let rand = Phaser.Math.Between(1,2);

            if(rand == 1){

                this.createCactus(posXadd);
            }
            else if(rand == 2){

                this.createCactus(posXadd);
                this.createCactus(posXadd + 60);   
            }

            //actualizing boolean
            this.obstacleExists = true;  
        }
        else{
            
            if(this.obstacle.x < -250){

                //actualizing boolean
                this.obstacleExists = false;
            }   
        }
    }

    createCactus(posXadd){

        this.obstacle = this.physics.add.sprite(1000 + posXadd, 310, this.obstaclesArray[0]).setScale(0.7);
        this.obstacle.setImmovable(true);
        this.obstacle.body.setAllowGravity(false);
        this.obstacle.setVelocityX(this.cactusVelocity);
        this.obstaclesGroup.add(this.obstacle); 
    }
}