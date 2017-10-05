
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('cat', 'assets/used/player_spritesheet.png', 64, 64);
    game.load.spritesheet('specials_cat', 'assets/used/player_specials_spritesheet.png', 64, 64);
    game.load.spritesheet('energy_projectiles', 'assets/used/projectiles_spritesheet.png', 32, 32);
    game.load.spritesheet('flying_tongue', 'assets/used/flying_tongue.png', 64, 64);
    game.load.spritesheet('skeleton_warrior', 'assets/Skeleton/Sprite Sheets/Skeleton Walk.png', 22, 33);

    //game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.image('background', 'assets/Free Pixel Art Forest/Preview/Background.png');
    game.load.image('wool_ball', 'assets/used/wool_ball.png');
    //game.load.image('bullet', 'assets/sprites/purple_ball.png');

}

var player;
var facing = 'left';
 
var jumpTimer = 0;
var controls;
var bullets;

var fireRate = 100;
var nextFire = 0;

var bg;

var controls;

var spawn_allowed = true;
var enemy_credits;
var enemy_wave;

var bonus;
var bolas_de_la;

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function define_controls(){
    controls = {
        jump: game.input.keyboard.addKey(Phaser.Keyboard.W),
        crouch: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        fire: game.input.keyboard.addKey(Phaser.Keyboard.G),
        fullscreen: game.input.keyboard.addKey(Phaser.Keyboard.F11)
    }
    return controls
}

function create_projectiles(){
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'energy_projectiles');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('body.gravity.y', 0);
    bullets.callAll('animations.add', 'animations', 'energy_shot', [48, 49, 50, 51, 52], 8, true);
    bullets.callAll('play', null, 'energy_shot');

    return bullets;
}

function spawn_enemies(){
    enemy_wave = game.add.group();
    for (var i  = 0; i  < 3; i++){
        var enemy = enemy_wave.create(game.rnd.integerInRange(0, 300), game.rnd.integerInRange(0, 300), 'flying_tongue');
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.collideWorldBounds = true;
        enemy.health = 20;
        enemy.animations.add('fly', [0, 1, 2, 3, 4], 20, true);
        enemy.animations.play('fly')
        //enemy.body.setSize(16, 32, 22, 23);
    }  
    var enemy = enemy_wave.create(700, 550, 'skeleton_warrior');
    enemy.anchor.setTo(0.5, 0.5);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.health = 100
    enemy.animations.add('march', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, true);
    enemy.animations.play('march');
    enemy.scale.setTo(1.5);


}

function chase_player(){
    enemy_wave.forEach(function(enemy) {
        game.physics.arcade.moveToObject(enemy, player, 30);
    }, this)
}

function check_collision(){
    enemy_wave.forEach(function(enemy) {

    })
}


function update_enemies(){

}

function create_animations(){
    // Player Animations
    player.animations.add('idle', [0, 1, 2, 3], 4, true);
    player.animations.add('left', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);
    player.animations.add('right', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);


    player.animations.add('start_jump', [32, 33, 34], 3, true);
    player.animations.add('midair', [35, 36], 2, true);
    player.animations.add('end_jump', [37, 38, 39], 3, true);

    player.animations.add('left_punch', [163, 164, 165, 166, 160])
    player.animations.add('right_punch', [166, 167, 168, 166, 160])

    player.animations.add('fast_shot_to_air', [306, 307, 308], 60, false);
    player.animations.add('jump_shot_to_front', [320, 321, 322, 323, 324, 325], 6, true);


}


function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    //game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(64, 550, 'cat');
    player.anchor.setTo(0.5, 0.5);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 22, 23);


    bonus = game.add.group();
    bonus.enableBody = true;
    bonus.physicsBodyType = Phaser.Physics.ARCADE;

    create_animations();

    controls = define_controls();

    controls.fullscreen.onDown.add(toggleFullScreen)
    bullets = create_projectiles();
    spawn_enemies();
}

function move(){
    if (controls.left.isDown) {
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (controls.right.isDown) {
        player.body.velocity.x = 150;

        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();

            if (facing == 'left') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }
            player.animations.play('idle');
            facing = 'idle';
        }
    }
    
    if (controls.jump.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        player.animations.play('start_jump');
        jumpTimer = game.time.now + 750;
    }
}

function shoot(){
    if (game.input.activePointer.isDown) {
        if (game.time.now > nextFire && bullets.countDead() > 0) {
            player.animations.play('fast_shot_to_air');
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstDead();

            bullet.reset(player.x - 8, player.y - 8);
            bullet.rotation = this.game.math.angleBetween(player.x, player.y, game.input.activePointer.x, this.game.input.activePointer.y);
            
            game.physics.arcade.moveToPointer(bullet, 300);
        }
    }    
}

function scratch(){
    if(game.input.activePointer.isDown){

    }
}

function update() {

    // game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    move();
    shoot();
    chase_player();

    game.physics.arcade.collide(bullets, enemy_wave, apply_damage, null, this);
    game.physics.arcade.collide(player, bonus, collect_powerup, null, this);

}

function collect_powerup(player, bonus){
    bolas_de_la = bolas_de_la + 1
    bonus.kill();

}

function apply_damage(bullet, enemy){
    bullet.kill();
    enemy.damage(2);
    if(enemy.health == 2){
        var b = bonus.create(enemy.x, enemy.y, 'wool_ball');
        b.scale.setTo(0.125);
        b.body.gravity.y = 250;
        b.body.bounce.y = 0.2;
        b.body.collideWorldBounds = true;
    }

}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);
    game.debug.body(player, 'red', false);
    game.debug.body(enemy_wave, 'green', false);
    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    //game.debug.spriteInfo(player, 32, 450);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
