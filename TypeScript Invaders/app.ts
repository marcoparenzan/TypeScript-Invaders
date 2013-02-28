/// <reference path="jquery.d.ts" />
// http://stackoverflow.com/questions/12682028/how-do-i-get-jquery-autocompletion-in-typescript

class Sprite {

    id: string;
    type: string;
    x: number;
    y: number;
    frames: HTMLImageElement;
    bounding_ray: number;

    collides_callback: (sprite: Sprite, other_sprite: Sprite) => bool;
    render_callback: (sprite: Sprite, context: CanvasRenderingContext2D)=>void;
    update_callback: (sprite: Sprite, game_level: GameLevel) => void;
    move_callback: (sprite: Sprite, dx: number, dy: number) => void;

    collides(other_sprite: Sprite): bool {
        if (this.collides_callback != undefined)
            return this.collides_callback(this, other_sprite);
        else {
            if (this.bounding_ray == 0) return false;
            if (other_sprite.bounding_ray == 0) return false;
            var dx = this.x - other_sprite.x;
            var dy = this.y - other_sprite.y;
            var double_of = dx * dx + dy * dy;
            var d = Math.sqrt(double_of);
            if (d < (this.bounding_ray + other_sprite.bounding_ray))
                return true;
            else
                return false;
       }
    }

    collided(other_sprite: Sprite, game_level: GameLevel)
    {
    }

    render(context: CanvasRenderingContext2D) {
        if (this.render_callback != undefined)
            this.render_callback(this, context);
        else
        {
            // http://www.w3schools.com/tags/canvas_drawimage.asp
            context.drawImage(this.frames, this.x - this.frames.width / 2, this.y - this.frames.height / 2);
        }
    }

    update(game_level: GameLevel) {
        if (this.update_callback != undefined)
            this.update_callback(this, game_level);
        else {

        }
    }

    move(dx: number, dy: number) {
        if (this.move_callback != undefined)
            this.move_callback(this, dx, dy);
        else
        {
            this.x += dx;
            this.y += dy;
        }
    }

    constructor(id: string, type:string, x: number, y: number, frames: HTMLImageElement) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.frames = frames;
    }
}

class Ship extends Sprite
{
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/ship.png";
        super(id, "ship", x, y, frames);

        this.bounding_ray = 10;
        this.energy = 100;
        this.shoot_power = 10;
    }

    energy: number;
    shoot_power: number;

    add_energy(energy: number) {
        this.energy += energy;
        if (this.energy > 100) this.energy = 100;
    }

    increase_shoot_power()
    {
        this.shoot_power += 10;
    }

    collided(other_sprite: Sprite, game_level: GameLevel) {
        if (other_sprite instanceof Enemy)
        {
            var enemy = <Enemy>other_sprite;
            this.energy -= enemy.energy;
            if (this.energy <= 0) {
                game_level.loose_life();
            }
        }
    }

    shoot(game_level: GameLevel): void
    {
        var bullet: ShipBullet = new ShipBullet("", this.x, this.y);
        game_level.add_ship_bullet(bullet);
    }
}

class ShipBullet extends Sprite {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/bullet.png";
        super(id, "bullet", x, y, frames);

        this.bounding_ray = 7;
        this.energy = 10;
    }

    energy: number;

    update(game_level: GameLevel) {
        this.move(0, -5);
        if (this.y < 0) game_level.remove_ship_bullet(this);
    }

    collided(other_sprite: Sprite, game_level: GameLevel) {
        game_level.remove_ship_bullet(this);
    }
}

class EnemyBullet extends Sprite {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/bullet.png";
        super(id, "bullet", x, y, frames);

        this.bounding_ray = 7;
        this.energy = 5;
    }

    energy: number;

    update(game_level: GameLevel) {
        this.move(0, +5);
        if (this.y > 500) game_level.remove_enemy_bullet(this);
    }

    collided(other_sprite: Sprite, game_level: GameLevel) {
        game_level.remove_enemy_bullet(this);
    }
}

class Bonus extends Sprite {

    type: string;

    constructor(id: string, x: number, y: number, type: string) {
        var frames: HTMLImageElement = new Image();
        this.type = type;
        this.bounding_ray = 7;
        switch (type)
        {
            case "life":
                frames.src = "assets/images/bonus-life.png";
                break;
            case "energy":
                frames.src = "assets/images/bonus-energy.png";
                break;
            case "power":
                frames.src = "assets/images/bonus-power.png";
                break;
            case "coin":
                frames.src = "assets/images/bonus-coin.png";
                break;
        }
        super(id, "bonus", x, y, frames);
    }

    collided(other_sprite: Sprite, game_level: GameLevel) {
        if (other_sprite instanceof ShipBullet)
        {
            switch (this.type) {
                case "life":
                    game_level.add_life();
                    break;
                case "energy":
                    game_level.main.add_energy(50);
                    break;
                case "power":
                    game_level.main.increase_shoot_power();
                    break;
                case "coin":
                    game_level.scores(100);
                    break;
            }
        }
        game_level.remove_bonus(this);
    }
}

class Animation extends Sprite {

    type: string;

    constructor(id: string, x: number, y: number, type: string) {
        var frames: HTMLImageElement = new Image();
        this.type = type;
        this.bounding_ray = 7;
        switch (type) {
            case "life":
                frames.src = "assets/images/bonus-life.png";
                break;
            case "energy":
                frames.src = "assets/images/bonus-energy.png";
                break;
            case "power":
                frames.src = "assets/images/bonus-power.png";
                break;
            case "coin":
                frames.src = "assets/images/bonus-coin.png";
                break;
        }
        super(id, "bonus", x, y, frames);
    }
}

class Enemy extends Sprite {
    constructor(id: string, type:string, x: number, y: number, frames: HTMLImageElement) {
        super(id, type, x, y, frames);

        this.bounding_ray = 20;
        this.energy = 10;
        this.score = 100;
    }

    energy: number;
    score: number;
}

class BaseEnemy extends Enemy {
    constructor(id: string, type: string, x: number, y: number, frames: HTMLImageElement) {
        this.direction_left_to_right = true;
        this.count = 30;
        this.down_times = 0;

        super(id, type, x, y, frames);

        this.bounding_ray = 15;
        this.energy = 10;
        this.score = 100;
    }

    direction_left_to_right: bool;
    count: number;
    down_times: number;

    update(game_level: GameLevel) {
        if (this.count > 0) {
            if (this.direction_left_to_right) {
                this.move(5, 0);
            } else {
                this.move(-5, 0);
            }
            this.count--;
        }
        else {
            this.move(0, 5);
            this.direction_left_to_right = !this.direction_left_to_right;
            this.count = 30;
            this.down_times++;
            if (this.down_times >= 100) {
                stop_game();
                // end game_level
            }
        }
    }

    collided(other_sprite: Sprite, game_level: GameLevel) {
        if (other_sprite instanceof ShipBullet) {
            var bullet = <ShipBullet>other_sprite;
            this.energy -= bullet.energy;
            if (this.energy <= 0) {
                game_level.scores(this.score);
                game_level.remove_enemy(this);
            }
        }
    }
}

class EnemyBlue extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-blue.png";

        super(id, "enemy", x, y, frames);
    }
}

class EnemyRed extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-red.png";

        super(id, "enemy", x, y, frames);
    }
}

class EnemyYellow extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-yellow.png";

        super(id, "enemy", x, y, frames);
    }
}

class EnemyGreen extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-green.png";

        super(id, "enemy", x, y, frames);
    }
}

class EnemyPink extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-pink.png";

        super(id, "enemy", x, y, frames);
    }
}

class EnemyCyan extends BaseEnemy {
    constructor(id: string, x: number, y: number) {
        var frames: HTMLImageElement = new Image();
        frames.src = "assets/images/enemy-cyan.png";

        super(id, "enemy", x, y, frames);
    }
}

class GameLevel {

    back_buffer_context: CanvasRenderingContext2D;
    main: Ship;
    enemies: Enemy[];
    ship_bullets: ShipBullet[];
    enemy_bullets: EnemyBullet[];
    bonuses: Bonus[];
    animations: Animation[];

    lives: number;
    score: number;

    constructor(back_buffer_context: CanvasRenderingContext2D) {
        this.back_buffer_context = back_buffer_context;
        this.enemies = [];
        this.enemy_bullets =[];
        this.ship_bullets = [];
        this.bonuses = [];
        this.animations = [];

        this.main = new Ship("main", 500, 500);
        var y = 0
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyBlue("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyRed("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyGreen("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyYellow("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyPink("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyCyan("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }

        this.lives = 3;
        this.score = 0;
    }

    render(game_level: GameLevel) {

        this.back_buffer_context.clearRect(0, 0, this.back_buffer_context.canvas.width, this.back_buffer_context.canvas.height);
        this.enemies.forEach(function (enemy: Sprite, index: number, array: Sprite[]) {
            enemy.render(game_level.back_buffer_context);
        });
        this.enemy_bullets.forEach(function (bullet: Sprite, index: number, array: Sprite[]) {
            bullet.render(game_level.back_buffer_context);
        });
        this.ship_bullets.forEach(function (bullet: Sprite, index: number, array: Sprite[]) {
            bullet.render(game_level.back_buffer_context);
        });
        this.bonuses.forEach(function (bonus: Sprite, index: number, array: Sprite[]) {
            bonus.render(game_level.back_buffer_context);
        });
        this.main.render(game_level.back_buffer_context);

        game_level.back_buffer_context.strokeText("SCORE: " + this.score.toString(), 10, 20);   
        game_level.back_buffer_context.strokeText("LIVES: " + this.lives.toString(), 10, 45);
   }

    update(game_level: GameLevel) {
        this.enemies.forEach(function (sprite: Sprite, index: number, array: Sprite[]) {
            sprite.update(game_level);
        });
        this.enemy_bullets.forEach(function (sprite: Sprite, index: number, array: Sprite[]) {
            sprite.update(game_level);
        });
        this.ship_bullets.forEach(function (sprite: Sprite, index: number, array: Sprite[]) {
            sprite.update(game_level);
        });
        this.bonuses.forEach(function (sprite: Sprite, index: number, array: Sprite[]) {
            sprite.update(game_level);
        });
        this.main.update(game_level);

        // test collisions
        var index = 0;
        while (true) {
            if (game_level.enemies.length == index) break;
            var enemy = game_level.enemies[index];
            if (this.main.collides(enemy)) {
                this.main.collided(enemy, this);
                enemy.collided(this.main, this);
                break;
            }
            else {
                var index2 = 0;
                while (true) {
                    if (game_level.ship_bullets.length == index2) break;
                    var bullet = game_level.ship_bullets[index2];
                    if (enemy.collides(bullet)) {
                        bullet.collided(enemy, this);
                        enemy.collided(bullet, this);
                    }
                    index2++;
                }

            }
            index++;
        }
    }

    // events

    add_ship_bullet(bullet: ShipBullet)
    {
        this.ship_bullets.push(bullet);
    }

    add_enemy_bullet(bullet: EnemyBullet) {
        this.enemy_bullets.push(bullet);
    }

    add_life()
    {
        this.lives++;
    }

    scores(score: number)
    {
        this.score += score;
    }

    loose_life()
    {
        this.lives--;
        if (this.lives == 0)
        {
            stop_game();
        }
    }

    remove_enemy_bullet(bullet: EnemyBullet)
    {
        this.enemy_bullets.splice(this.enemy_bullets.indexOf(bullet), 1);
    }

    remove_ship_bullet(bullet: ShipBullet) {
        this.ship_bullets.splice(this.ship_bullets.indexOf(bullet), 1);
    }

    remove_bonus(bonus: Bonus) {
        this.bonuses.splice(this.bonuses.indexOf(bonus), 1);
    }

    remove_enemy(enemy: Enemy) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }

    // commanding

    shoot() {
        this.main.shoot(this);
    }

    move_left() {
        this.main.move(-5, 0);
    }

    move_right() {
        this.main.move(+5, 0);
    }
}

var main_canvas: HTMLCanvasElement;
var main_context: CanvasRenderingContext2D;
var back_buffer_canvas: HTMLCanvasElement;
var back_buffer_context: CanvasRenderingContext2D;

var game_level: GameLevel;
var timerToken: number;

function start_game() {
    this.timerToken = setInterval(() => {
        this.game_level.render(game_level);
        // double buffer
        this.game_level.update(game_level);
    }, 33);
}

function stop_game() {
    clearTimeout(this.timerToken);
}

$(function () {

    // http://stackoverflow.com/questions/12686927/typescript-casting-htmlelement
    main_canvas = <HTMLCanvasElement>document.getElementById("main");
    main_context = main_canvas.getContext("2d");
    back_buffer_canvas = <HTMLCanvasElement>document.getElementById("back_buffer");
    back_buffer_context = back_buffer_canvas.getContext("2d");

    main_context.font = '12pt Calibri';
    main_context.lineWidth = 3;
    main_context.strokeStyle = 'blue';

    game_level = new GameLevel(main_context);
    
    start_game();
});

window.onkeydown = (e) => {
    if (e.keyCode == 77) {
        game_level.move_right();
    }
    else if (e.keyCode == 78) {
        game_level.move_left();
    }
    else if (e.keyCode == 90) {
        game_level.shoot();
    }
};