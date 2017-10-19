
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('cat', 'assets/player_spritesheet.png', 64, 64);
    game.load.spritesheet('specials_cat', 'assets/used/player_specials_spritesheet.png', 64, 64);
    game.load.spritesheet('energy_projectiles', 'assets/used/projectiles_spritesheet.png', 32, 32);

    // Enemy spritesheets
    // Lesser
    game.load.spritesheet('flying_tongue', 'assets/used/flying_tongue.png', 64, 64);
    game.load.spritesheet('lesser_minion', 'assets/lesser_monster_spritesheet.png', 64, 59);

    // Major
    game.load.spritesheet('skull_monster', 'assets/skull_monster_spritesheet.png', 64, 64);
    game.load.spritesheet('demon_flower', 'assets/demon_flower_spritesheet.png', 64, 64);

    // Elite
    game.load.spritesheet('skeleton_warrior', 'assets/Skeleton/Sprite Sheets/skeleton_warrior_spritesheet.png', 22, 33);
    game.load.spritesheet('dog_gun_fighter', 'assets/dog_gun_fighter_spritesheet.png', 64, 64);

    //game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.image('background', 'assets/Free Pixel Art Forest/Preview/Background.png');
    game.load.image('wool_ball', 'assets/used/wool_ball.png');
    //game.load.image('bullet', 'assets/sprites/purple_ball.png');

}

var player;

// GUI
var health = "a";
var energy = 50;
var energyText = "energy:" + energy; 
var energyTimer;
var style2 = {font: "24px Arial", fill: "Yellow", align: "center" };
var text1;


var jumpTimer = 0;
var controls;
var bullets;

var fireRate = 100;
var nextFire = 0;
var controls;
var stance = 1;

var hitboxes;
var punch_arm = 0;
var punch_rate = 500;
var next_punch = 0;

var kick_rate = 500;
var next_kick = 0;
var kick_types = ['low_kick', 'middle_kick', 'high_kick'];

var bg;


var spawn_allowed = true;
var spawn_timer;
var enemy_credits = 20;
var enemy_costs = [20, 10, 5]
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

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    //game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(64, 550, 'cat');
    player.facing = 'right';
    player.performingAttack = false;
    player.anchor.setTo(0.5, 0.5);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 22, 23);
    create_player_animations();
    player.animations.play('idle-right');


    bonus = game.add.group();
    bonus.enableBody = true;
    bonus.physicsBodyType = Phaser.Physics.ARCADE;

    

    text1 = this.game.add.text(this.game.world.x + 47, 10, energyText, style2);
    energyTimer = this.game.time.create(false);
    energyTimer.start();
    energyTimer.loop(400, updateCounter, this);

    controls = define_controls();

    controls.fullscreen.onDown.add(toggleFullScreen)

    bullets = create_projectiles();
    hitboxes = create_hitboxes();

    spawn_enemies();
}

function updateCounter(){
    if(energy >= 100){
        energy = 100;
    } else {
        energy++;
    }
}

function define_controls(){
    controls = {
        jump: game.input.keyboard.addKey(Phaser.Keyboard.W),
        crouch: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        punch: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
        kick: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
        power: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
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

function create_hitboxes(){
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    hitboxes.physicsBodyType = Phaser.Physics.ARCADE;

    hitboxes.createMultiple(5, null);
    hitboxes.setAll('checkWorldBounds', true);
    hitboxes.setAll('outOfBoundsKill', true);
    hitboxes.setAll('anchor.x', 0.5);
    hitboxes.setAll('anchor.y', 0.5);
    hitboxes.setAll('lifespan', 100);
    hitboxes.setAll('setSize', 5, 5, 100, 0);
    hitboxes.callAll('play', null, null);

    return hitboxes;
}

function spawn_enemies(){
    var tmp_credits = enemy_credits
    spawn_allowed = false;
    enemy_wave = game.add.group();    

    while(tmp_credits > 0){
        var rand = enemy_costs[Math.floor(Math.random() * enemy_costs.length)]
        var enemy;

        if(rand == 100){

        } else if(rand == 50){

        } else if(rand == 20){
            enemy = enemy_wave.create(700, 550, 'skeleton_warrior');
            enemy = create_enemy_body(enemy);
            enemy.body.gravity.y = 1000;
            enemy.health = 100
            enemy.name = 'skeleton_warrior';
            enemy.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 30, true);
            enemy.animations.play('walk');
            enemy.scale.setTo(1.5);
        } else if(rand == 10){
            enemy = enemy_wave.create(game.rnd.integerInRange(0, 300), 2000, 'lesser_minion');
            enemy = create_enemy_body(enemy);
            enemy.body.gravity.y = 1000;
            enemy.health = 30;
            enemy.body.setSize(25, 20, 20, 39);
            enemy.name = 'lesser_minion';

            enemy.animations.add('walk-right', [9, 10, 11, 12], 15, true);
            enemy.animations.add('walk-left', [51, 52, 53, 54], 15, true);
            enemy.animations.add('flinch-right', [24, 25, 26, 25, 24], 15, false);        
            enemy.animations.add('flinch-left', [71, 70, 69, 70, 71], 15, false);
            //enemy.animations.play('walk');

        } else if(rand == 5){
            enemy = enemy_wave.create(game.rnd.integerInRange(0, 300), game.rnd.integerInRange(0, 300), 'flying_tongue');
            enemy = create_enemy_body(enemy);
            enemy.health = 20;
            enemy.name = 'flying_tongue';
            enemy.body.setSize(25, 27, 20, 20);
            enemy.animations.add('walk', [0, 1, 2, 3, 4], 20, true);
            enemy.animations.play('walk')
        }

        tmp_credits = tmp_credits - rand
    } 
    enemy_credits = enemy_credits + 20

}

function create_enemy_body(enemy){
    enemy.anchor.setTo(0.5, 0.5);
    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.body.collideWorldBounds = true;
    enemy.flinching = false;
    return enemy
}

function chase_player(){
    enemy_wave.forEach(function(enemy) {
        if(!enemy.flinching){
            if(enemy.x >= player.x && enemy.name == "lesser_minion"){
                enemy.animations.play('walk-left');
            } else {
                enemy.animations.play('walk-right');
            }
            game.physics.arcade.moveToObject(enemy, player, 30);
        }
    }, this)
}

function check_collision(){
    enemy_wave.forEach(function(enemy) {

    })
}

function create_player_animations(){
    // Player Animations
    player.animations.add('idle-right', [0, 1, 2, 3], 4, true);
    player.animations.add('idle-left', [336, 337, 338, 339], 4, true);
    player.animations.add('move-right', [17, 18, 19, 20, 21, 22, 23], 15, true);
    player.animations.add('move-left', [353, 354, 355, 356, 357, 358, 359], 15, true);



    player.animations.add('start_jump', [32, 33, 34], 3, true);
    player.animations.add('midair', [35, 36], 2, true);
    player.animations.add('end_jump', [37, 38, 39], 3, true);


    // Punches
    player.animations.add('left_punch', [147, 148, 149, 150, 153], 15, false);
    player.animations.add('right_punch', [150, 151, 152, 150, 153], 15, false);

    // Kicks
    player.animations.add('low_kick', [161, 162, 163, 164], 15, false);
    player.animations.add('middle_kick', [167, 168, 169, 170], 15, false);
    player.animations.add('high_kick', [177, 178, 179, 180], 15, false);
    //player.animations.add('right_punch', [166, 167, 168, 166, 160], 5, false);

    player.animations.add('fast_shot_to_air', [306, 307, 308], 60, false);
    player.animations.add('jump_shot_to_front', [320, 321, 322, 323, 324, 325], 6, true);
}

function move(){
    if (controls.left.isDown) {
        player.body.velocity.x = -150;

        player.animations.play('move-left');
        player.facing = 'left';
    }
    else if (controls.right.isDown) {
        player.body.velocity.x = 150;

            player.animations.play('move-right');
            player.facing = 'right';
    }
    else if(!player.performingAttack){
        player.animations.play('idle-' + player.facing);        
    }

        if (controls.jump.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        player.animations.play('start_jump');
        jumpTimer = game.time.now + 750;
    }
}

function process_input(){
    if(!player.performingAttack){
        move();
    }

    if(controls.punch.isDown){
        stance = 1;
    } else if(controls.kick.isDown){
        stance = 2;
    } else if(controls.power.isDown){
        stance = 3;
    }

    if(game.input.activePointer.isDown){
        player.performingAttack = true;
        player.body.velocity.x = 0;
        switch(stance){
            case 1:     punch();
            break;
            case 2:     kick();
            break;
            case 3:     shoot();
            break;
        } 
        if(player.animations.currentAnim.name != "idle-right" &&
            player.animations.currentAnim.name != "idle-left" && 
            player.animations.currentAnim.name != "move-right" && 
            player.animations.currentAnim.name != "move-left"){
                    player.animations.currentAnim.onComplete.add(() => { player.animations.play('idle-' + player.facing); player.performingAttack = false; }, this);
            }
    }
}

function shoot(){
       if (game.time.now > nextFire && bullets.countDead() > 0) {
            player.animations.play('fast_shot_to_air');
            nextFire = game.time.now + fireRate;
            var bullet = bullets.getFirstDead();
            bullet.reset(player.x - 8, player.y - 8);
            bullet.rotation = this.game.math.angleBetween(player.x, player.y, game.input.activePointer.x, this.game.input.activePointer.y);
             
            game.physics.arcade.moveToPointer(bullet, 300);
       }  
}

function punch(){
    if(game.time.now > next_punch){
        var hitbox = hitboxes.getFirstDead();
        hitbox.reset(player.x + 5, player.y - 8);
        hitbox.lifespan = 30;
        if(player.facing == 'left'){

        } else {

        }
        hitbox.body.velocity.x = 500;
        hitbox.body.setSize(5,10,0, 25);
        next_punch = game.time.now + punch_rate;
        if(!punch_arm){
            player.animations.play('left_punch');
            punch_arm = 1;
        } else {
            player.animations.play('right_punch');
            punch_arm = 0;
        }
    }    
}

function kick(){
    if(game.time.now > next_kick){
        next_kick = game.time.now + kick_rate;
        player.animations.play(kick_types[Math.floor(Math.random() * kick_types.length)]);    

    }    
}

function trigger_spawn(){    
    if(spawn_allowed == false && enemy_wave.countLiving() == 0){        
        spawn_allowed = true;
        spawn_timer = game.time.now + 500
    }
}

function update() {

    // game.physics.arcade.collide(player, layer);
    console.log(player.performingAttack);
    trigger_spawn();

    if(spawn_allowed && game.time.now > spawn_timer){
        spawn_enemies();
    }

    player.body.velocity.x = 0;

    process_input();
    

    chase_player();

    game.physics.arcade.collide(bullets, enemy_wave, apply_damage, null, this);
    game.physics.arcade.collide(hitboxes, enemy_wave, apply_damage, null, this);
    game.physics.arcade.collide(player, bonus, collect_powerup, null, this);

}

function collect_powerup(player, bonus){
    bolas_de_la = bolas_de_la + 1
    bonus.kill();
}

function apply_damage(object, enemy){
    object.kill();
    enemy.damage(2);

    if(enemy.name == 'lesser_minion'){
            if(enemy.x >= player.x){
                enemy.animations.play('flinch-left');
            } else {
                enemy.animations.play('flinch-right');
            }        
    } else if(enemy.name == 'flying_tongue'){
        enemy.animations.add('flinch', [17, 18, 17], 15, false);
        enemy.body.velocity.y = 0;
    }
    else if(enemy.name == 'skeleton_warrior'){
        enemy.animations.add('flinch', [17, 18, 19, 20, 21, 17], 15, false);
    }
    enemy.animations.play('flinch');
    enemy.flinching = true;
    enemy.body.velocity.x = 0;
    enemy.animations.currentAnim.onComplete.add(() => { enemy.animations.play('walk'); enemy.flinching = false; }, this);
    
    if(enemy.health == 2){
        var b = bonus.create(enemy.x, enemy.y, 'wool_ball');
        b.scale.setTo(0.125);
        b.body.gravity.y = 250;
        b.body.bounce.y = 0.2;
        b.body.collideWorldBounds = true;
    }

}

function renderGroup(member){
    game.debug.body(member);
}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);
    game.debug.body(hitboxes, 'red', false);
    game.debug.body(enemy_wave, 'green', false);
    enemy_wave.forEachAlive(renderGroup, this);
    hitboxes.forEachAlive(renderGroup, this);
    //game.debug.body(hitbox, 'pink', false);
    //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    //game.debug.spriteInfo(player, 32, 450);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}