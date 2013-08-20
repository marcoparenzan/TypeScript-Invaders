var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
var EnemyBullet = (function (_super) {
    __extends(EnemyBullet, _super);
    function EnemyBullet(id, x, y) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bullet.png");
        _super.call(this, id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 5;
    }
    EnemyBullet.prototype.update = function (context, state) {
        this.move(0, +5);
        if (this._y > 500)
            context.remove_enemy_bullet(this, state);
    };

    EnemyBullet.prototype.collided = function (other_sprite, context, state) {
        context.remove_enemy_bullet(this, state);
    };
    return EnemyBullet;
})(Sprite);
