/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
// http://stackoverflow.com/questions/12682028/how-do-i-get-jquery-autocompletion-in-typescript
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sprite = (function () {
    function Sprite(id, type, x, y, sprite_sheet) {
        this._id = id;
        this._type = type;
        this._x = x;
        this._y = y;
        this._sprite_sheet = sprite_sheet;
    }
    Sprite.prototype.collides = function (other_sprite) {
        if (this._bounding_ray == 0)
            return false;
        if (other_sprite._bounding_ray == 0)
            return false;
        var dx = this._x - other_sprite._x;
        var dy = this._y - other_sprite._y;
        var double_of = dx * dx + dy * dy;
        var d = Math.sqrt(double_of);
        if (d < (this._bounding_ray + other_sprite._bounding_ray))
            return true;
else
            return false;
    };

    Sprite.prototype.collided = function (other_sprite, context, state) {
    };

    Sprite.prototype.update = function (context, state) {
    };

    Sprite.prototype.render = function (render_context) {
        render_context.draw(this._sprite_sheet, this._x, this._y);
    };

    Sprite.prototype.move = function (dx, dy) {
        this._x += dx;
        this._y += dy;
    };
    return Sprite;
})();

var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(id, x, y) {
        var sprite_sheet = new SpriteSheet("assets/images/ship.png");
        _super.call(this, id, "ship", x, y, sprite_sheet);

        this._bounding_ray = 10;
        this._energy = 100;
        this._shoot_power = 10;
    }
    Ship.prototype.add_energy = function (energy) {
        this._energy += energy;
        if (this._energy > 100)
            this._energy = 100;
    };

    Ship.prototype.increase_shoot_power = function () {
        this._shoot_power += 10;
    };

    Ship.prototype.collided = function (other_sprite, context, state) {
        if (other_sprite instanceof Enemy) {
            var enemy = other_sprite;
            this._energy -= enemy._energy;
            if (this._energy <= 0) {
                context.loose_life(state);
            }
        }
    };

    Ship.prototype.shoot = function (context) {
        var bullet = new ShipBullet("", this._x, this._y);
        context.add_ship_bullet(bullet);
    };
    return Ship;
})(Sprite);

var ShipBullet = (function (_super) {
    __extends(ShipBullet, _super);
    function ShipBullet(id, x, y) {
        var sprite_sheet = new SpriteSheet("assets/images/bullet.png");
        _super.call(this, id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 10;
    }
    ShipBullet.prototype.update = function (context, state) {
        this.move(0, -5);
        if (this._y < 0)
            context.remove_ship_bullet(this);
    };

    ShipBullet.prototype.collided = function (other_sprite, context, state) {
        context.remove_ship_bullet(this);
    };
    return ShipBullet;
})(Sprite);

var EnemyBullet = (function (_super) {
    __extends(EnemyBullet, _super);
    function EnemyBullet(id, x, y) {
        var sprite_sheet = new SpriteSheet("assets/images/bullet.png");
        _super.call(this, id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 5;
    }
    EnemyBullet.prototype.update = function (context, state) {
        this.move(0, +5);
        if (this._y > 500)
            context.remove_enemy_bullet(this);
    };

    EnemyBullet.prototype.collided = function (other_sprite, context, state) {
        context.remove_enemy_bullet(this);
    };
    return EnemyBullet;
})(Sprite);

var Bonus = (function (_super) {
    __extends(Bonus, _super);
    function Bonus(id, x, y, type) {
        this._type = type;
        this._bounding_ray = 7;

        var sprite_sheet = undefined;
        switch (type) {
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
        _super.call(this, id, "bonus", x, y, sprite_sheet);
    }
    Bonus.prototype.collided = function (other_sprite, context, state) {
        if (other_sprite instanceof ShipBullet) {
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
    };
    return Bonus;
})(Sprite);

var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(id, type, x, y, sprite_sheet) {
        _super.call(this, id, type, x, y, sprite_sheet);

        this._energy = 10;
        this._score = 100;
        this._bounding_ray = 15;
    }
    Enemy.prototype.update = function (context, state) {
    };

    Enemy.prototype.collided = function (other_sprite, context, state) {
    };
    return Enemy;
})(Sprite);

var Invader = (function (_super) {
    __extends(Invader, _super);
    function Invader(id, type, x, y) {
        var sprite_sheet = new SpriteSheet("assets/images/enemy-" + type + ".png");
        _super.call(this, id, "enemy", x, y, sprite_sheet);

        this._direction_left_to_right = true;
        this._count = 30;
        this._down_times = 0;
    }
    Invader.prototype.update = function (context, state) {
        if (this._count > 0) {
            if (this._direction_left_to_right) {
                this.move(5, 0);
            } else {
                this.move(-5, 0);
            }
            this._count--;
        } else {
            this.move(0, 5);
            this._direction_left_to_right = !this._direction_left_to_right;
            this._count = 30;
            this._down_times++;
        }
    };

    Invader.prototype.collided = function (other_sprite, context, state) {
        if (other_sprite instanceof ShipBullet) {
            var bullet = other_sprite;
            this._energy -= bullet._energy;
            if (this._energy <= 0) {
                state.add_score(this._score);
                context.remove_enemy(this);
            }
        }
    };
    return Invader;
})(Enemy);

var GameState = (function () {
    function GameState() {
    }
    GameState.prototype._resume = function () {
        var game_loop = this.game_loop;
        this._timerToken = setInterval(function () {
            game_loop();
        }, 33);

        this.paused = false;
    };

    GameState.prototype._suspend = function () {
        clearTimeout(this._timerToken);
        this.paused = true;
    };

    // public API
    GameState.prototype.pause = function () {
        if (this.paused) {
            this._resume();
        } else {
            this._suspend();
        }
    };

    GameState.prototype.add_score = function (score) {
        this.score += score;
    };

    GameState.prototype.add_life = function () {
        this.lives++;
    };

    GameState.prototype.loose_life = function () {
        this.lives--;
        return (this.lives <= 0);
    };

    GameState.prototype.get_lives = function () {
        return this.lives;
    };
    return GameState;
})();

var InvasionLevel = (function () {
    function InvasionLevel() {
        var context = this;

        context._main = new Ship("main", 500, 500);

        context._enemies = [];
        context._enemy_bullets = [];
        context._ship_bullets = [];
        context._bonuses = [];

        var y = 0;
        var x = 0;
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
    InvasionLevel.prototype.render_common = function (game_screen, state) {
        game_screen.write("SCORE: " + state.score.toString(), 10, 20);
        game_screen.write("LIVES: " + state.lives.toString(), 10, 45);
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
            if (context._main.collides(enemy)) {
                context._main.collided(enemy, context, state);
                enemy.collided(this._main, context, state);
                break;
            } else {
                var index2 = 0;
                while (true) {
                    if (context._ship_bullets.length <= index2)
                        break;
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
    };

    // events
    InvasionLevel.prototype.add_ship_bullet = function (bullet) {
        this._ship_bullets.push(bullet);
    };

    InvasionLevel.prototype.add_enemy_bullet = function (bullet) {
        this._enemy_bullets.push(bullet);
    };

    InvasionLevel.prototype.loose_life = function (state) {
        var result = state.loose_life();
        if (state.get_lives() == 0) {
            state.on_end_game();
        }
        return result;
    };

    InvasionLevel.prototype.remove_enemy_bullet = function (bullet) {
        var context = this;
        var i = context._enemy_bullets.indexOf(bullet);
        context._enemy_bullets.splice(i, 1);
    };

    InvasionLevel.prototype.remove_ship_bullet = function (bullet) {
        var i = this._ship_bullets.indexOf(bullet);
        this._ship_bullets.splice(i, 1);
    };

    InvasionLevel.prototype.remove_bonus = function (bonus) {
        var i = this._bonuses.indexOf(bonus);
        this._bonuses.splice(i, 1);
    };

    InvasionLevel.prototype.remove_enemy = function (enemy) {
        var i = this._enemies.indexOf(enemy);
        this._enemies.splice(i, 1);
    };

    //
    InvasionLevel.prototype.add_energy_to_main = function (energy) {
        this._main.add_energy(energy);
    };

    InvasionLevel.prototype.increase_shoot_power_to_main = function () {
        this._main.increase_shoot_power();
    };

    // commanding
    InvasionLevel.prototype.shoot = function () {
        this._main.shoot(this);
    };

    InvasionLevel.prototype.move_left = function () {
        this._main.move(-5, 0);
    };

    InvasionLevel.prototype.move_right = function () {
        this._main.move(5, 0);
    };
    return InvasionLevel;
})();

var SpriteSheet = (function () {
    function SpriteSheet(asset_src) {
        this.frames = new Image();
        this.frames.src = asset_src;
    }
    return SpriteSheet;
})();

var GameScreen = (function () {
    function GameScreen(render_context) {
        this._render_context = render_context;
    }
    GameScreen.prototype.clear = function () {
        this._render_context.clearRect(0, 0, this._render_context.canvas.width, this._render_context.canvas.height);
    };

    GameScreen.prototype.draw = function (sprite_sheet, x, y) {
        this._render_context.drawImage(sprite_sheet.frames, x, y);
    };

    GameScreen.prototype.write = function (text, x, y) {
        this._render_context.strokeText(text, x, y);
    };
    return GameScreen;
})();

var Game = (function () {
    function Game(game_screen) {
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
    Game.prototype.shoot = function () {
        this._game_context.shoot();
    };

    Game.prototype.move_left = function () {
        this._game_context.move_left();
    };

    Game.prototype.move_right = function () {
        this._game_context.move_right();
    };

    Game.prototype.pause = function () {
        this._game_state.pause();
    };
    return Game;
})();

$(function () {
    // http://stackoverflow.com/questions/12686927/typescript-casting-htmlelement
    var render_canvas = document.getElementById("main");
    var render_context = render_canvas.getContext("2d");
    render_context.font = '12pt Calibri';
    render_context.lineWidth = 3;
    render_context.strokeStyle = 'blue';

    var game_screen = new GameScreen(render_context);

    var game = new Game(game_screen);

    window.onkeydown = function (e) {
        switch (e.keyCode) {
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
                break;
        }
    };

    window.onkeyup = function (e) {
        switch (e.keyCode) {
            case 77:
                break;
            case 78:
                break;
            case 90:
                break;
            default:
                break;
        }
    };

    game.pause();
});
