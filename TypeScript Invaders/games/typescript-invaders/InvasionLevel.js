var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="EndLevelContext.ts" />
/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="Bonus.ts" />
/// <reference path="EnemyBullet.ts" />
/// <reference path="ShipBullet.ts" />
/// <reference path="Enemy.ts" />
/// <reference path="Invader.ts" />
/// <reference path="Ship.ts" />
var InvasionLevel = (function (_super) {
    __extends(InvasionLevel, _super);
    function InvasionLevel() {
        _super.call(this);

        var context = this;

        context._main = new Ship("main", 500, 450);

        context._enemies = [];
        context._enemy_bullets = [];
        context._ship_bullets = [];
        context._bonuses = [];

        var y = 0;
        var x = 0;
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
    InvasionLevel.prototype.render_common = function (game_screen, state) {
        game_screen.write("SCORE: " + state.score.toString(), 10, 20);
        game_screen.write("LIVES: " + state.lives.toString(), 10, 45);
        game_screen.write("TIME: " + state.time.toString(), 10, 70);

        if (state.paused) {
            game_screen.write("[ P A U S E D ]", 300, 245);
        }
    };

    InvasionLevel.prototype.render = function (game_screen, state) {
        var context = this;

        game_screen.clear();

        context._enemies.forEach(function (enemy, index, array) {
            enemy.render(game_screen);
        });
        context._enemy_bullets.forEach(function (bullet, index, array) {
            bullet.render(game_screen);
        });
        context._ship_bullets.forEach(function (bullet, index, array) {
            bullet.render(game_screen);
        });
        context._bonuses.forEach(function (bonus, index, array) {
            bonus.render(game_screen);
        });
        context._main.render(game_screen);

        context.render_common(game_screen, state);
    };

    InvasionLevel.prototype.update = function (state) {
        var context = this;

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.name) {
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
            }
            ;
        }

        context._enemies.forEach(function (sprite, index, array) {
            sprite.update(context, state);
        });
        context._enemy_bullets.forEach(function (sprite, index, array) {
            sprite.update(context, state);
        });
        context._ship_bullets.forEach(function (sprite, index, array) {
            sprite.update(context, state);
        });
        context._bonuses.forEach(function (sprite, index, array) {
            sprite.update(context, state);
        });
        context._main.update(context, state);

        // test collisions
        var index = 0;
        while (true) {
            if (context._enemies.length <= index)
                break;
            var enemy = context._enemies[index];
            if (context._main.collides(enemy, state)) {
                context._main.collided(enemy, context, state);
                enemy.collided(this._main, context, state);
                break;
            } else {
                var index2 = 0;
                while (true) {
                    if (context._ship_bullets.length <= index2)
                        break;
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
    };

    // API
    InvasionLevel.prototype.add_ship_bullet = function (bullet, state) {
        this._ship_bullets.push(bullet);
    };

    InvasionLevel.prototype.add_enemy_bullet = function (bullet, state) {
        this._enemy_bullets.push(bullet);
    };

    InvasionLevel.prototype.remove_enemy_bullet = function (bullet, state) {
        var context = this;
        var i = context._enemy_bullets.indexOf(bullet);
        context._enemy_bullets.splice(i, 1);
    };

    InvasionLevel.prototype.remove_ship_bullet = function (bullet, state) {
        var i = this._ship_bullets.indexOf(bullet);
        this._ship_bullets.splice(i, 1);
    };

    InvasionLevel.prototype.remove_bonus = function (bonus, state) {
        var i = this._bonuses.indexOf(bonus);
        this._bonuses.splice(i, 1);
    };

    InvasionLevel.prototype.remove_enemy = function (enemy, state) {
        var i = this._enemies.indexOf(enemy);
        this._enemies.splice(i, 1);
        if (this._enemies.length == 0) {
            state.current_context = new EndLevelContext(state.level);
        }
    };

    InvasionLevel.prototype.add_energy_to_main = function (energy, state) {
        this._main.add_energy(energy, state);
    };

    InvasionLevel.prototype.increase_shoot_power_to_main = function (state) {
        this._main.increase_shoot_power(state);
    };
    return InvasionLevel;
})(GameContext);
