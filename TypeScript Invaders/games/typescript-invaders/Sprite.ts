/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="SpriteSheet.ts" />
class Sprite {

    _id: string;
    _type: string;
    _x: number;
    _y: number;

    _sprite_sheet: SpriteSheet;
    _bounding_ray: number;

    collides(other_sprite: Sprite, state: GameState): boolean {
        if (this._bounding_ray == 0) return false;
        if (other_sprite._bounding_ray == 0) return false;
        var dx = this._x - other_sprite._x;
        var dy = this._y - other_sprite._y;
        var double_of = dx * dx + dy * dy;
        var d = Math.sqrt(double_of);
        if (d < (this._bounding_ray + other_sprite._bounding_ray))
            return true;
        else
            return false;
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
    }

    update(context: InvasionLevel, state: GameState) {
    }

    render(render_context: GameScreen) {
        render_context.draw(this._sprite_sheet, this._x, this._y);
    }

    move(dx: number, dy: number) {
        this._x += dx;
        this._y += dy;
    }

    constructor(id: string, type: string, x: number, y: number, sprite_sheet: SpriteSheet) {
        this._id = id;
        this._type = type;
        this._x = x;
        this._y = y;
        this._sprite_sheet = sprite_sheet;
    }
}