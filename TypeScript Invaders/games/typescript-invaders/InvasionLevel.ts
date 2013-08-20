/// <reference path="EndLevelContext.ts" />
/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="Bonus.ts" />
/// <reference path="EnemyBullet.ts" />
/// <reference path="ShipBullet.ts" />
/// <reference path="Enemy.ts" />
/// <reference path="Invader.ts" />
/// <reference path="Ship.ts" />
class InvasionLevel extends GameContext {

    private _main: Ship;

    private _enemies: Enemy[];
    private _ship_bullets: ShipBullet[];
    private _enemy_bullets: EnemyBullet[];
    private _bonuses: Bonus[];

    constructor() {
        super();

        var context = this;

        context._main = new Ship("main", 500, 450);

        context._enemies = [];
        context._enemy_bullets = [];
        context._ship_bullets = [];
        context._bonuses = [];

        var y: number = 0
        var x: number = 0;
        for (x = 0; x < 8; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "blue", 70 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 8; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "red", 70 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 8; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "green", 70 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 8; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "yellow", 70 + x * 50, 20 + y * 50));
        }
        y++;
        for (x = 0; x < 8; x++) {
            context._enemies.push(new Invader("enemy" + y + x, "pink", 70 + x * 50, 20 + y * 50));
        }
    }

    render_common(game_screen: GameScreen, state: GameState) {
        game_screen.write("SCORE: " + state.score.toString(), 10, 20);
        game_screen.write("LIVES: " + state.lives.toString(), 10, 45);
        game_screen.write("TIME: " + state.time.toString(), 10, 70);

        if (state.paused)
        {
            game_screen.write("[ P A U S E D ]", 300, 245);
        }
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

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++)
        {
            var command = commands[i];
            switch (command.name)
            {
                case "move_left":
                    context._main.move(-5, 0);
                    break;
                case "move_right":
                    context._main.move(5, 0);
                    break;
                case "shoot":
                    context._main.shoot(context, state);
                    break;
                case "pause":
                    state.toggle_pause();
                    break;
                default:
                    break;
            };
        }

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
            if (context._main.collides(enemy, state)) {
                context._main.collided(enemy, context, state);
                enemy.collided(this._main, context, state);
                break;
            }
            else {
                var index2 = 0;
                while (true) {
                    if (context._ship_bullets.length <= index2) break;
                    var bullet = context._ship_bullets[index2];
                    if (enemy.collides(bullet, state)) {
                        bullet.collided(enemy, context, state);
                        enemy.collided(bullet, context, state);
                    }
                    index2++;
                }

            }
            index++;
        }
    }

    // API

    add_ship_bullet(bullet: ShipBullet, state: GameState)
    {
    
        this._ship_bullets.push(bullet);
    }

    add_enemy_bullet(bullet: EnemyBullet, state: GameState) {
        this._enemy_bullets.push(bullet);
    }

    remove_enemy_bullet(bullet: EnemyBullet, state: GameState)
    {
        var context: InvasionLevel = this;
        var i: number = context._enemy_bullets.indexOf(bullet);
        context._enemy_bullets.splice(i, 1);
    }

    remove_ship_bullet(bullet: ShipBullet, state: GameState) {
        var i: number = this._ship_bullets.indexOf(bullet);
        this._ship_bullets.splice(i, 1);
    }

    remove_bonus(bonus: Bonus, state: GameState) {
        var i: number = this._bonuses.indexOf(bonus);
        this._bonuses.splice(i, 1);
    }

    remove_enemy(enemy: Enemy, state: GameState) {
        var i: number = this._enemies.indexOf(enemy);
        this._enemies.splice(i, 1);
        if (this._enemies.length == 0)
        {
            state.current_context = new EndLevelContext(state.level);
        }
    }

    add_energy_to_main(energy: number, state: GameState) {
        this._main.add_energy(energy, state);
    }

    increase_shoot_power_to_main(state: GameState) {
        this._main.increase_shoot_power(state);
    }
}