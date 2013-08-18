/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
// http://stackoverflow.com/questions/12682028/how-do-i-get-jquery-autocompletion-in-typescript

class Sprite {

    _id: string;
    _type: string;
    _x: number;
    _y: number;

    _sprite_sheet: SpriteSheet;
    _bounding_ray: number;

    collides(other_sprite: Sprite): boolean {
        if (this._bounding_ray == 0) return false;
        if (other_sprite._bounding_ray == 0) return false;
        var dx = this._x - other_sprite._x;
        var dy = this._y - other_sprite._y;
        var double_of = dx * dx + dy * dy;
        var d = Math.sqrt(double_of);
        if (d < (this._bounding_ray + other_sprite._bounding_ray))
            return true;
        else
            return false;
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
    }

    update(context: InvasionLevel, state: GameState) {
    }

    render(render_context: GameScreen) {
        render_context.draw(this._sprite_sheet, this._x, this._y);
    }

    move(dx: number, dy: number) {
        this._x += dx;
        this._y += dy;
    }

    constructor(id: string, type:string, x: number, y: number, sprite_sheet: SpriteSheet) {
        this._id = id;
        this._type = type;
        this._x = x;
        this._y = y;
        this._sprite_sheet = sprite_sheet;
    }
}

class Ship extends Sprite
{
    constructor(id: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("assets/images/ship.png");
        super(id, "ship", x, y, sprite_sheet);

        this._bounding_ray = 10;
        this._energy = 100;
        this._shoot_power = 10;
    }

    _energy: number;
    _shoot_power: number;

    add_energy(energy: number) {
        this._energy += energy;
        if (this._energy > 100) this._energy = 100;
    }

    increase_shoot_power()
    {
        this._shoot_power += 10;
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof Enemy)
        {
            var enemy = <Enemy>other_sprite;
            this._energy -= enemy._energy;
            if (this._energy <= 0) {
                context.loose_life(state);
            }
        }
    }

    shoot(context: InvasionLevel)
    {
        var bullet: ShipBullet = new ShipBullet("", this._x, this._y);
        context.add_ship_bullet(bullet);
    }
}

class ShipBullet extends Sprite {
    constructor(id: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("assets/images/bullet.png");
        super(id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 10;
    }

    _energy: number;

    update(context: InvasionLevel, state: GameState) {
        this.move(0, -5);
        if (this._y < 0) context.remove_ship_bullet(this);
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        context.remove_ship_bullet(this);
    }
}

class EnemyBullet extends Sprite {
    constructor(id: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("assets/images/bullet.png");
        super(id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 5;
    }

    _energy: number;

    update(context: InvasionLevel, state: GameState) {
        this.move(0, +5);
        if (this._y > 500) context.remove_enemy_bullet(this);
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        context.remove_enemy_bullet(this);
    }
}

class Bonus extends Sprite {

    _type: string;

    constructor(id: string, x: number, y: number, type: string) {
        this._type = type;
        this._bounding_ray = 7;

        var sprite_sheet: SpriteSheet = undefined;
        switch (type)
        {
            case "life":
                sprite_sheet = new SpriteSheet("assets/images/bonus-life.png");
                break;
            case "energy":
                sprite_sheet = new SpriteSheet("assets/images/bonus-energy.png");
                break;
            case "power":
                sprite_sheet = new SpriteSheet("assets/images/bonus-power.png");
                break;
            case "coin":
                sprite_sheet = new SpriteSheet("assets/images/bonus-coin.png");
                break;
        }
        super(id, "bonus", x, y, sprite_sheet);
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof ShipBullet)
        {
            switch (this._type) {
                case "life":
                    state.add_life();
                    break;
                case "energy":
                    context.add_energy_to_main(50);
                    break;
                case "power":
                    context.increase_shoot_power_to_main();
                    break;
                case "coin":
                    state.add_score(100);
                    break;
            }
        }
        context.remove_bonus(this);
    }
}

class Enemy extends Sprite {
    constructor(id: string, type: string, x: number, y: number, sprite_sheet: SpriteSheet) {
        super(id, type, x, y, sprite_sheet);

        this._energy = 10;
        this._score = 100;
        this._bounding_ray = 15;
    }

    _energy: number;
    _score: number;

    update(context: InvasionLevel, state: GameState) {
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
    }
}

class Invader extends Enemy {

    _direction_left_to_right: boolean;
    _count: number;
    _down_times: number;

    constructor(id: string, type: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("assets/images/enemy-" + type + ".png");
        super(id, "enemy", x, y, sprite_sheet);

        this._direction_left_to_right = true;
        this._count = 30;
        this._down_times = 0;
    }

    update(context: InvasionLevel, state: GameState) {
        if (this._count > 0) {
            if (this._direction_left_to_right) {
                this.move(5, 0);
            } else {
                this.move(-5, 0);
            }
            this._count--;
        }
        else {
            this.move(0, 5);
            this._direction_left_to_right = !this._direction_left_to_right;
            this._count = 30;
            this._down_times++;
        }
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof ShipBullet) {
            var bullet = <ShipBullet>other_sprite;
            this._energy -= bullet._energy;
            if (this._energy <= 0) {
                state.add_score(this._score);
                context.remove_enemy(this);
            }
        }
    }
}

class GameState {
    lives: number;
    score: number;
    paused: boolean;
    on_end_game: () => void;
    game_loop: () => void;

    // suspension

    _timerToken: number;

    _resume() {
        var game_loop = this.game_loop;
        this._timerToken = setInterval(function () {
            game_loop();
        }, 33);

        this.paused = false;
    }

    _suspend() {
        clearTimeout(this._timerToken);
        this.paused = true;
    }

    // public API

    pause() {
        if (this.paused) {
            this._resume();
        }
        else {
            this._suspend();
        }
    }

    add_score(score: number) {
        this.score += score;
    }

    add_life() {
        this.lives++;
    }

    loose_life(): boolean {
        this.lives--;
        return (this.lives <= 0);
    }

    get_lives(): number {
        return this.lives;
    }
}

class InvasionLevel {

    private _main: Ship;

    private _enemies: Enemy[];
    private _ship_bullets: ShipBullet[];
    private _enemy_bullets: EnemyBullet[];
    private _bonuses: Bonus[];

    constructor() {
        var context = this;

        context._main = new Ship("main", 500, 500);

        context._enemies = [];
        context._enemy_bullets = [];
        context._ship_bullets = [];
        context._bonuses = [];

        var y: number = 0
        var x: number = 0;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "blue", 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "red", 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "green", 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "yellow", 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "pink", 100 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 10; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "cyan", 100 + x * 50, 20 + y * 50));
        }
    }

    render_common(game_screen: GameScreen, state: GameState) {
        game_screen.write("SCORE: " + state.score.toString(), 10, 20);
        game_screen.write("LIVES: " + state.lives.toString(), 10, 45);
    }

    render(game_screen: GameScreen, state: GameState) {
        var context = this;

        game_screen.clear();

        context._enemies.forEach(function(enemy: Enemy, index: number, array: Enemy[]){
            enemy.render(game_screen);
        });
        context._enemy_bullets.forEach(function (bullet: EnemyBullet, index: number, array: EnemyBullet[]) {
            bullet.render(game_screen);
        });
        context._ship_bullets.forEach(function (bullet: ShipBullet, index: number, array: ShipBullet[]) {
            bullet.render(game_screen);
        });
        context._bonuses.forEach(function (bonus: Bonus, index: number, array: Bonus[]) {
            bonus.render(game_screen);
        });
        context._main.render(game_screen);

        context.render_common(game_screen, state);
    }

    update(state: GameState)
    {
        var context = this;

        context._enemies.forEach(function (sprite: Enemy, index: number, array: Enemy[]) {
            sprite.update(context, state);
        });
        context._enemy_bullets.forEach(function (sprite: EnemyBullet, index: number, array: EnemyBullet[]) {
            sprite.update(context, state);
        });
        context._ship_bullets.forEach(function (sprite: ShipBullet, index: number, array: ShipBullet[]) {
            sprite.update(context, state);
        });
        context._bonuses.forEach(function (sprite: Bonus, index: number, array: Bonus[]) {
            sprite.update(context, state);
        });
        context._main.update(context, state);

        // test collisions
        var index = 0;
        while (true) {
            if (context._enemies.length <= index) break;
            var enemy = context._enemies[index];
            if (context._main.collides(enemy)) {
                context._main.collided(enemy, context, state);
                enemy.collided(this._main, context, state);
                break;
            }
            else {
                var index2 = 0;
                while (true) {
                    if (context._ship_bullets.length <= index2) break;
                    var bullet = context._ship_bullets[index2];
                    if (enemy.collides(bullet)) {
                        bullet.collided(enemy, context, state);
                        enemy.collided(bullet, context, state);
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
        this._ship_bullets.push(bullet);
    }

    add_enemy_bullet(bullet: EnemyBullet) {
        this._enemy_bullets.push(bullet);
    }

    loose_life(state: GameState): boolean
    {
        var result : boolean = state.loose_life();
        if (state.get_lives() == 0)
        {
            state.on_end_game();
        }
        return result;
    }

    remove_enemy_bullet(bullet: EnemyBullet)
    {
        var context: InvasionLevel = this;
        var i: number = context._enemy_bullets.indexOf(bullet);
        context._enemy_bullets.splice(i, 1);
    }

    remove_ship_bullet(bullet: ShipBullet) {
        var i: number = this._ship_bullets.indexOf(bullet);
        this._ship_bullets.splice(i, 1);
    }

    remove_bonus(bonus: Bonus) {
        var i: number = this._bonuses.indexOf(bonus);
        this._bonuses.splice(i, 1);
    }

    remove_enemy(enemy: Enemy) {
        var i: number = this._enemies.indexOf(enemy);
        this._enemies.splice(i, 1);
    }

    //

    add_energy_to_main(energy: number) {
        this._main.add_energy(energy);
    }

    increase_shoot_power_to_main() {
        this._main.increase_shoot_power();
    }

    // commanding

    shoot() {
        this._main.shoot(this);
    }

    move_left() {
        this._main.move(-5, 0);
    }

    move_right() {
        this._main.move(5, 0);
    }
}

class SpriteSheet
{
    frames: HTMLImageElement;

    constructor(asset_src: string)
    {
        this.frames = new Image();
        this.frames.src = asset_src;
    }
}

class GameScreen {
    _render_context: CanvasRenderingContext2D;

    constructor(render_context: CanvasRenderingContext2D) {
        this._render_context = render_context;
    }

    clear() {
        this._render_context.clearRect(0, 0, this._render_context.canvas.width, this._render_context.canvas.height);
    }

    draw(sprite_sheet: SpriteSheet, x: number, y: number)
    {
        this._render_context.drawImage(sprite_sheet.frames, x, y);
    }

    write(text: string, x:number, y:number)
    {
        this._render_context.strokeText(text, x, y);
    }
}

class Game
{
    _game_context: InvasionLevel;
    _game_state: GameState;
    _game_screen: GameScreen;

    constructor(game_screen: GameScreen)
    {
        this._game_screen = game_screen;

        var game_context = new InvasionLevel();
        this._game_context = game_context;

        var game_state = new GameState();
        game_state.lives = 3;
        game_state.score = 0;
        game_state.paused = true;
        game_state.game_loop = function () {
            game_context.render(game_screen, game_state);
            game_context.update(game_state);
        };
        game_state.on_end_game = game_state._suspend;
        this._game_state = game_state;
    }

    // public API

    shoot() {
        this._game_context.shoot();
    }

    move_left() {
        this._game_context.move_left();
    }

    move_right() {
        this._game_context.move_right();
    }

    pause() {
        this._game_state.pause();
    }
}

$(function () {

    // http://stackoverflow.com/questions/12686927/typescript-casting-htmlelement
    var render_canvas = <HTMLCanvasElement>document.getElementById("main");
    var render_context = <CanvasRenderingContext2D>render_canvas.getContext("2d");
    render_context.font = '12pt Calibri';
    render_context.lineWidth = 3;
    render_context.strokeStyle = 'blue';

    var game_screen = new GameScreen(render_context);

    var game = new Game(game_screen);

    window.onkeydown = (e) => {
        switch (e.keyCode)
        {
            case 77:
                game.move_right();
                break;
            case 78:
                game.move_left();
                break;
            case 90:
                game.shoot();
                break;
            case 80:
                game.pause();
                break;
            default:
                // unhandled key
                break;
        }
    };

    window.onkeyup = (e) => {
        switch (e.keyCode) {
            case 77:
                break;
            case 78:
                break;
            case 90:
                break;
            default:
                // unhandled key
                break;
        }
    };

    game.pause();
});
