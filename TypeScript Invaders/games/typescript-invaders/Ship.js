var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameScreen.ts" />
/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(id, x, y) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/ship.png");
        _super.call(this, id, "ship", x, y, sprite_sheet);

        this._bounding_ray = 10;
        this._energy = 100;
        this._shoot_power = 10;
    }
    Ship.prototype.render = function (render_context) {
        render_context.draw_frame(this._sprite_sheet, this._x, this._y, 0, 0, 56, 33);
    };

    Ship.prototype.add_energy = function (energy, state) {
        this._energy += energy;
        if (this._energy > 100)
            this._energy = 100;
    };

    Ship.prototype.increase_shoot_power = function (state) {
        this._shoot_power += 10;
    };

    Ship.prototype.collided = function (other_sprite, context, state) {
        if (other_sprite instanceof Enemy) {
            var enemy = other_sprite;
            this._energy -= enemy._energy;
            if (this._energy <= 0) {
                state.loose_life();
            }
        }
    };

    Ship.prototype.shoot = function (context, state) {
        var bullet = new ShipBullet("", this._x + 24, this._y + 4);
        context.add_ship_bullet(bullet, state);
    };
    return Ship;
})(Sprite);
