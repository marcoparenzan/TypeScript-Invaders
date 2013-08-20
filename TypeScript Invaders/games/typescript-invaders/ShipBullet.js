var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
var ShipBullet = (function (_super) {
    __extends(ShipBullet, _super);
    function ShipBullet(id, x, y) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bullet.png");
        _super.call(this, id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 10;
    }
    ShipBullet.prototype.update = function (context, state) {
        this.move(0, -5);
        if (this._y < 0)
            context.remove_ship_bullet(this, state);
    };

    ShipBullet.prototype.collided = function (other_sprite, context, state) {
        context.remove_ship_bullet(this, state);
    };
    return ShipBullet;
})(Sprite);
