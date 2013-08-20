var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
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
