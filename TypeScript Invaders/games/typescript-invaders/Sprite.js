/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="SpriteSheet.ts" />
var Sprite = (function () {
    function Sprite(id, type, x, y, sprite_sheet) {
        this._id = id;
        this._type = type;
        this._x = x;
        this._y = y;
        this._sprite_sheet = sprite_sheet;
    }
    Sprite.prototype.collides = function (other_sprite, state) {
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
