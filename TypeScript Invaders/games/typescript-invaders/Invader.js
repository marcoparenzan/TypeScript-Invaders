var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Enemy.ts" />
/// <reference path="ShipBullet.ts" />
/// <reference path="Sprite.ts" />
var Invader = (function (_super) {
    __extends(Invader, _super);
    function Invader(id, type, x, y) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/enemy-" + type + ".png");
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
                context.remove_enemy(this, state);
            }
        }
    };
    return Invader;
})(Enemy);
