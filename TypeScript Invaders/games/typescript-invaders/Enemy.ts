/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
class Enemy extends Sprite {
    constructor(id: string, type: string, x: number, y: number, sprite_sheet: SpriteSheet) {
        super(id, type, x, y, sprite_sheet);

        this._energy = 10;
        this._score = 100;
        this._bounding_ray = 15;
    }

    _energy: number;
    _score: number;

    update(context: InvasionLevel, state: GameState) {
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
    }
}