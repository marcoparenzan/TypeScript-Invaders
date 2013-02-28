var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="jquery.d.ts" />
// http://stackoverflow.com/questions/12682028/how-do-i-get-jquery-autocompletion-in-typescript
var Sprite = (function () {
    function Sprite(id, type, x, y, frames) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.frames = frames;
    }
    Sprite.prototype.collides = function (other_sprite) {
        if(this.collides_callback != undefined) {
            return this.collides_callback(this, other_sprite);
        } else {
            if(this.bounding_ray == 0) {
                return false;
            }
            if(other_sprite.bounding_ray == 0) {
                return false;
            }
            var dx = this.x - other_sprite.x;
            var dy = this.y - other_sprite.y;
            var double_of = dx * dx + dy * dy;
            var d = Math.sqrt(double_of);
            if(d < (this.bounding_ray + other_sprite.bounding_ray)) {
                return true;
            } else {
                return false;
            }
        }
    };
    Sprite.prototype.collided = function (other_sprite, game_level) {
    };
    Sprite.prototype.render = function (context) {
        if(this.render_callback != undefined) {
            this.render_callback(this, context);
        } else {
            // http://www.w3schools.com/tags/canvas_drawimage.asp
            context.drawImage(this.frames, this.x - this.frames.width / 2, this.y - this.frames.height / 2);
        }
    };
    Sprite.prototype.update = function (game_level) {
        if(this.update_callback != undefined) {
            this.update_callback(this, game_level);
        } else {
        }
    };
    Sprite.prototype.move = function (dx, dy) {
        if(this.move_callback != undefined) {
            this.move_callback(this, dx, dy);
        } else {
            this.x += dx;
            this.y += dy;
        }
    };
    return Sprite;
})();
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/ship.png";
        _super.call(this, id, "ship", x, y, frames);
        this.bounding_ray = 10;
        this.energy = 100;
        this.shoot_power = 10;
    }
    Ship.prototype.add_energy = function (energy) {
        this.energy += energy;
        if(this.energy > 100) {
            this.energy = 100;
        }
    };
    Ship.prototype.increase_shoot_power = function () {
        this.shoot_power += 10;
    };
    Ship.prototype.collided = function (other_sprite, game_level) {
        if(other_sprite instanceof Enemy) {
            var enemy = other_sprite;
            this.energy -= enemy.energy;
            if(this.energy <= 0) {
                game_level.loose_life();
            }
        }
    };
    Ship.prototype.shoot = function (game_level) {
        var bullet = new ShipBullet("", this.x, this.y);
        game_level.add_ship_bullet(bullet);
    };
    return Ship;
})(Sprite);
var ShipBullet = (function (_super) {
    __extends(ShipBullet, _super);
    function ShipBullet(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/bullet.png";
        _super.call(this, id, "bullet", x, y, frames);
        this.bounding_ray = 7;
        this.energy = 10;
    }
    ShipBullet.prototype.update = function (game_level) {
        this.move(0, -5);
        if(this.y < 0) {
            game_level.remove_ship_bullet(this);
        }
    };
    ShipBullet.prototype.collided = function (other_sprite, game_level) {
        game_level.remove_ship_bullet(this);
    };
    return ShipBullet;
})(Sprite);
var EnemyBullet = (function (_super) {
    __extends(EnemyBullet, _super);
    function EnemyBullet(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/bullet.png";
        _super.call(this, id, "bullet", x, y, frames);
        this.bounding_ray = 7;
        this.energy = 5;
    }
    EnemyBullet.prototype.update = function (game_level) {
        this.move(0, 5);
        if(this.y > 500) {
            game_level.remove_enemy_bullet(this);
        }
    };
    EnemyBullet.prototype.collided = function (other_sprite, game_level) {
        game_level.remove_enemy_bullet(this);
    };
    return EnemyBullet;
})(Sprite);
var Bonus = (function (_super) {
    __extends(Bonus, _super);
    function Bonus(id, x, y, type) {
        var frames = new Image();
        this.type = type;
        this.bounding_ray = 7;
        switch(type) {
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
        _super.call(this, id, "bonus", x, y, frames);
    }
    Bonus.prototype.collided = function (other_sprite, game_level) {
        if(other_sprite instanceof ShipBullet) {
            switch(this.type) {
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
    };
    return Bonus;
})(Sprite);
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(id, x, y, type) {
        var frames = new Image();
        this.type = type;
        this.bounding_ray = 7;
        switch(type) {
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
        _super.call(this, id, "bonus", x, y, frames);
    }
    return Animation;
})(Sprite);
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(id, type, x, y, frames) {
        _super.call(this, id, type, x, y, frames);
        this.bounding_ray = 20;
        this.energy = 10;
        this.score = 100;
    }
    return Enemy;
})(Sprite);
var BaseEnemy = (function (_super) {
    __extends(BaseEnemy, _super);
    function BaseEnemy(id, type, x, y, frames) {
        this.direction_left_to_right = true;
        this.count = 30;
        this.down_times = 0;
        _super.call(this, id, type, x, y, frames);
        this.bounding_ray = 15;
        this.energy = 10;
        this.score = 100;
    }
    BaseEnemy.prototype.update = function (game_level) {
        if(this.count > 0) {
            if(this.direction_left_to_right) {
                this.move(5, 0);
            } else {
                this.move(-5, 0);
            }
            this.count--;
        } else {
            this.move(0, 5);
            this.direction_left_to_right = !this.direction_left_to_right;
            this.count = 30;
            this.down_times++;
            if(this.down_times >= 100) {
                stop_game();
                // end game_level
                            }
        }
    };
    BaseEnemy.prototype.collided = function (other_sprite, game_level) {
        if(other_sprite instanceof ShipBullet) {
            var bullet = other_sprite;
            this.energy -= bullet.energy;
            if(this.energy <= 0) {
                game_level.scores(this.score);
                game_level.remove_enemy(this);
            }
        }
    };
    return BaseEnemy;
})(Enemy);
var EnemyBlue = (function (_super) {
    __extends(EnemyBlue, _super);
    function EnemyBlue(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-blue.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyBlue;
})(BaseEnemy);
var EnemyRed = (function (_super) {
    __extends(EnemyRed, _super);
    function EnemyRed(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-red.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyRed;
})(BaseEnemy);
var EnemyYellow = (function (_super) {
    __extends(EnemyYellow, _super);
    function EnemyYellow(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-yellow.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyYellow;
})(BaseEnemy);
var EnemyGreen = (function (_super) {
    __extends(EnemyGreen, _super);
    function EnemyGreen(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-green.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyGreen;
})(BaseEnemy);
var EnemyPink = (function (_super) {
    __extends(EnemyPink, _super);
    function EnemyPink(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-pink.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyPink;
})(BaseEnemy);
var EnemyCyan = (function (_super) {
    __extends(EnemyCyan, _super);
    function EnemyCyan(id, x, y) {
        var frames = new Image();
        frames.src = "assets/images/enemy-cyan.png";
        _super.call(this, id, "enemy", x, y, frames);
    }
    return EnemyCyan;
})(BaseEnemy);
var GameLevel = (function () {
    function GameLevel(back_buffer_context) {
        this.back_buffer_context = back_buffer_context;
        this.enemies = [];
        this.enemy_bullets = [];
        this.ship_bullets = [];
        this.bonuses = [];
        this.animations = [];
        this.main = new Ship("main", 500, 500);
        var y = 0;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyBlue("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyRed("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyGreen("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyYellow("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyPink("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        y++;
        for(var x = 0; x < 10; x++) {
            this.enemies.push(new EnemyCyan("enemy" + y + x, 100 + x * 50, 20 + y * 50));
        }
        this.lives = 3;
        this.score = 0;
    }
    GameLevel.prototype.render = function (game_level) {
        this.back_buffer_context.clearRect(0, 0, this.back_buffer_context.canvas.width, this.back_buffer_context.canvas.height);
        this.enemies.forEach(function (enemy, index, array) {
            enemy.render(game_level.back_buffer_context);
        });
        this.enemy_bullets.forEach(function (bullet, index, array) {
            bullet.render(game_level.back_buffer_context);
        });
        this.ship_bullets.forEach(function (bullet, index, array) {
            bullet.render(game_level.back_buffer_context);
        });
        this.bonuses.forEach(function (bonus, index, array) {
            bonus.render(game_level.back_buffer_context);
        });
        this.main.render(game_level.back_buffer_context);
        game_level.back_buffer_context.strokeText("SCORE: " + this.score.toString(), 10, 20);
        game_level.back_buffer_context.strokeText("LIVES: " + this.lives.toString(), 10, 45);
    };
    GameLevel.prototype.update = function (game_level) {
        this.enemies.forEach(function (sprite, index, array) {
            sprite.update(game_level);
        });
        this.enemy_bullets.forEach(function (sprite, index, array) {
            sprite.update(game_level);
        });
        this.ship_bullets.forEach(function (sprite, index, array) {
            sprite.update(game_level);
        });
        this.bonuses.forEach(function (sprite, index, array) {
            sprite.update(game_level);
        });
        this.main.update(game_level);
        // test collisions
        var index = 0;
        while(true) {
            if(game_level.enemies.length == index) {
                break;
            }
            var enemy = game_level.enemies[index];
            if(this.main.collides(enemy)) {
                this.main.collided(enemy, this);
                enemy.collided(this.main, this);
                break;
            } else {
                var index2 = 0;
                while(true) {
                    if(game_level.ship_bullets.length == index2) {
                        break;
                    }
                    var bullet = game_level.ship_bullets[index2];
                    if(enemy.collides(bullet)) {
                        bullet.collided(enemy, this);
                        enemy.collided(bullet, this);
                    }
                    index2++;
                }
            }
            index++;
        }
    };
    GameLevel.prototype.add_ship_bullet = // events
    function (bullet) {
        this.ship_bullets.push(bullet);
    };
    GameLevel.prototype.add_enemy_bullet = function (bullet) {
        this.enemy_bullets.push(bullet);
    };
    GameLevel.prototype.add_life = function () {
        this.lives++;
    };
    GameLevel.prototype.scores = function (score) {
        this.score += score;
    };
    GameLevel.prototype.loose_life = function () {
        this.lives--;
        if(this.lives == 0) {
            stop_game();
        }
    };
    GameLevel.prototype.remove_enemy_bullet = function (bullet) {
        this.enemy_bullets.splice(this.enemy_bullets.indexOf(bullet), 1);
    };
    GameLevel.prototype.remove_ship_bullet = function (bullet) {
        this.ship_bullets.splice(this.ship_bullets.indexOf(bullet), 1);
    };
    GameLevel.prototype.remove_bonus = function (bonus) {
        this.bonuses.splice(this.bonuses.indexOf(bonus), 1);
    };
    GameLevel.prototype.remove_enemy = function (enemy) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    };
    GameLevel.prototype.shoot = // commanding
    function () {
        this.main.shoot(this);
    };
    GameLevel.prototype.move_left = function () {
        this.main.move(-5, 0);
    };
    GameLevel.prototype.move_right = function () {
        this.main.move(5, 0);
    };
    return GameLevel;
})();
var main_canvas;
var main_context;
var back_buffer_canvas;
var back_buffer_context;
var game_level;
var timerToken;
function start_game() {
    var _this = this;
    this.timerToken = setInterval(function () {
        _this.game_level.render(game_level);
        // double buffer
        _this.game_level.update(game_level);
    }, 33);
}
function stop_game() {
    clearTimeout(this.timerToken);
}
$(function () {
    // http://stackoverflow.com/questions/12686927/typescript-casting-htmlelement
    main_canvas = document.getElementById("main");
    main_context = main_canvas.getContext("2d");
    back_buffer_canvas = document.getElementById("back_buffer");
    back_buffer_context = back_buffer_canvas.getContext("2d");
    main_context.font = '12pt Calibri';
    main_context.lineWidth = 3;
    main_context.strokeStyle = 'blue';
    game_level = new GameLevel(main_context);
    start_game();
});
window.onkeydown = function (e) {
    if(e.keyCode == 77) {
        game_level.move_right();
    } else if(e.keyCode == 78) {
        game_level.move_left();
    } else if(e.keyCode == 90) {
        game_level.shoot();
    }
};
//@ sourceMappingURL=app.js.map
