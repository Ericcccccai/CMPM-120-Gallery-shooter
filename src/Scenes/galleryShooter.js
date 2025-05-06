// Global variable
let savedHighScore = 0;

class GalleryShooter extends Phaser.Scene {
    constructor() {
        super('GalleryShooter');
    }

    preload() {
        // Load player and projectile assets
        this.load.image('river-left', 'assets/river_left.png');
        this.load.image('river-middle', 'assets/river_middle.png');
        this.load.image('river-right', 'assets/river_right.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('flower', 'assets/flower.png');
        this.load.image('plane', 'assets/plane.png');
        this.load.image('duck', 'assets/duck.png');
        this.load.image('poop', 'assets/shit.png');
        this.load.image('spit', 'assets/spit.png');
        this.load.image('croc', 'assets/crocodile.png');
        this.load.image('heart', 'assets/heart.png');
    }

    create() {
        const tileWidth = 100;
        const screenHeight = 600;
        this.highScore = savedHighScore;
        
        // Left grass (48px wide)
        this.leftGrass = this.add.tileSprite(24, 300, 48, screenHeight, 'grass');

        // One-tile-wide river-left (16px)
        this.riverLeft = this.add.tileSprite(56, 300, 16, screenHeight, 'river-left');

        // River middle (704px)
        this.riverMiddle = this.add.tileSprite(408, 300, 704, screenHeight, 'river-middle');

        // One-tile-wide river-right (16px)
        this.riverRight = this.add.tileSprite(760, 300, 16, screenHeight, 'river-right');

        // Right grass (48px wide)
        this.rightGrass = this.add.tileSprite(776, 300, 48, screenHeight, 'grass');

        // Random flowers and planes on grass
        // for (let i = 0; i < 5; i++) {
        //     let flowerLeft = this.add.image(Phaser.Math.Between(0, 48), Phaser.Math.Between(0, 600), 'flower').setScale(0.5);
        //     let flowerRight = this.add.image(Phaser.Math.Between(752, 800), Phaser.Math.Between(0, 600), 'flower').setScale(0.5);
        // }
        // for (let i = 0; i < 2; i++) {
        //     let plane = this.add.image(Phaser.Math.Between(752, 800), Phaser.Math.Between(0, 600), 'plane').setScale(0.4);
        // }


        // Add player (duck)
        this.duck = this.add.sprite(400, 200, 'duck');
        this.duck.setDisplaySize(64, 48);
        this.children.bringToTop(this.duck);
        //this.add.rectangle(400, 500, 64, 48).setStrokeStyle(2, 0xffff00);
        //console.log(`duck: (${this.duck.x}, ${this.duck.y})`);





        // Controls
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            fire: 'SPACE'
        });

        // Groups
        this.poops = this.add.group();
        this.crocs = this.add.group();
        this.spits = this.add.group();
        this.decorations = this.add.group();

        // Flower spawner
        for (let i = 0; i < 10; i++) {
            let flowerLeft = this.add.image(Phaser.Math.Between(0, 48), Phaser.Math.Between(0, 600), 'flower').setScale(0.5);
            let flowerRight = this.add.image(Phaser.Math.Between(750, 800), Phaser.Math.Between(0, 600), 'flower').setScale(0.5);
            this.decorations.add(flowerLeft);
            this.decorations.add(flowerRight);
        }
        
        for (let i = 0; i < 2; i++) {
            let plane = this.add.image(Phaser.Math.Between(752, 800), Phaser.Math.Between(0, 600), 'plane').setScale(0.4);
            this.decorations.add(plane);
        }

        // Croc spawner
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnCroc,
            callbackScope: this,
            loop: true
        });

        // Super croc spawner
        this.time.addEvent({
            delay: 10000, // 10 seconds
            callback: this.spawnSuperCroc,
            callbackScope: this,
            loop: true
        });

        // Score and health
        this.score = 0;
        this.health = 5;

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '30px', fill: '#fff' });
        this.healthIcons = [];
        for (let i = 0; i < this.health; i++) {
            let icon = this.add.image(650 + i * 30, 20, 'heart').setScale(1.5);
            this.healthIcons.push(icon);
        }

        // Restart
        this.isGameOver = false;
        this.highScore = 0;
    }

    // Helper functions
    spawnCroc() {
        let x = Phaser.Math.Between(200, 600);
        let croc = this.add.sprite(x, 580, 'croc').setScale(0.3);
        croc.angle = -90;

        // Add horizontal wiggle direction and speed
        croc.hitCount = 0;
        croc.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        croc.speed = Phaser.Math.Between(1, 3);

        this.crocs.add(croc);
    }

    spawnSpit(x, y, isSuper = false) {
        let spit = this.add.sprite(x, y - 20, 'spit').setScale(isSuper ? 1 : 0.6);
        this.spits.add(spit);
        spit.isSuper = isSuper;
    }

    spawnSuperCroc() {
        let x = Phaser.Math.Between(200, 600);
        let croc = this.add.sprite(x, 580, 'croc').setScale(0.45); // Bigger croc
        croc.angle = -90;
    
        croc.isSuper = true;
        croc.hitCount = 0;
        croc.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        croc.speed = Phaser.Math.Between(1, 2);
    
        this.crocs.add(croc);
    }

    endGame() {
        // Save high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            savedHighScore = this.highScore;
        }

        this.isGameOver = true;
    
        // Stop spawning crocs
        if (this.spawnTimer) this.spawnTimer.remove();
    
        // Clear remaining enemies and poop/spit
        this.crocs.clear(true, true);
        this.poops.clear(true, true);
        this.spits.clear(true, true);
    
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    
        // Show game over text
        this.add.text(300, 250, 'Game Overrrrr', { fontSize: '32px', fill: '#fff' });
        this.add.text(260, 300, `Final Score: ${this.score}`, { fontSize: '24px', fill: '#fff' });
        this.add.text(260, 330, `High Score: ${this.highScore}`, { fontSize: '20px', fill: '#fff' });
        this.add.text(210, 380, 'Press SPACE to restart', { fontSize: '20px', fill: '#ccc' });
    }

    update() {
        // Restart setup
        if (this.isGameOver && Phaser.Input.Keyboard.JustDown(this.keys.fire)) {
            this.scene.restart();
        }

        // Scroll background
        this.riverLeft.tilePositionY -= 1;
        this.riverMiddle.tilePositionY -= 1;
        this.riverRight.tilePositionY -= 1;
        this.leftGrass.tilePositionY -= 1;
        this.rightGrass.tilePositionY -= 1;

        // Duck movement
        if (this.keys.left.isDown) this.duck.x -= 5;
        if (this.keys.right.isDown) this.duck.x += 5;
        if (this.keys.up.isDown) this.duck.y -= 5;
        if (this.keys.down.isDown) this.duck.y += 5;

        this.duck.x = Phaser.Math.Clamp(this.duck.x, 0, 800);
        this.duck.y = Phaser.Math.Clamp(this.duck.y, 0, 600);

        // Shoot poop
        if (Phaser.Input.Keyboard.JustDown(this.keys.fire)) {
            let poop = this.add.sprite(this.duck.x, this.duck.y + 20, 'poop').setScale(0.5);
            this.poops.add(poop);
        }

        // Move poop
        this.poops.getChildren().forEach(poop => {
            poop.y += 10;
            this.crocs.getChildren().forEach(croc => {
                if (Phaser.Math.Distance.Between(poop.x, poop.y, croc.x, croc.y) < 30) {
                    poop.destroy();
                    croc.hitCount++;
        
                    // Optional: flash effect
                    croc.setTint(0xffaaaa);
                    this.time.delayedCall(100, () => croc.clearTint());
        
                    if (croc.hitCount >= 3) {
                        croc.destroy();
                        this.score += 10;
                        this.scoreText.setText(`Score: ${this.score}`);
                    }
                }
            });
        });

        // Move crocs
        this.crocs.getChildren().forEach(croc => {
            croc.x += croc.speed * croc.direction;
            if (croc.x <= 200 || croc.x >= 600) {
                croc.direction *= -1;
            }
        
            if (Phaser.Math.Between(0, 100) < 3) {
                this.spawnSpit(croc.x, croc.y, croc.isSuper);
            }
        });

        // Move spit projectiles
        this.spits.getChildren().forEach(spit => {
            spit.y -= 6;

            // Check collision with duck
            if (Phaser.Math.Distance.Between(spit.x, spit.y, this.duck.x, this.duck.y) < 30) {
                spit.destroy();
                this.loseHealth();
            }

            if (spit.y < 0) {
                spit.destroy();
            }
        });

        this.decorations.getChildren().forEach(deco => {
            deco.y += 1;
        
            // Optional: recycle off-screen decorations
            if (deco.y > 600) {
                deco.y = 0;
            }
        });

        // Game over
        if (this.isGameOver || this.score >= 150) {
            this.endGame();
        }
    }

    loseHealth() {
        this.health--;
        if (this.healthIcons.length > 0) {
            let icon = this.healthIcons.pop();
            icon.destroy();
        }

        if (this.health <= 0) {
            this.endGame();
        }
    }

}

export default GalleryShooter;
