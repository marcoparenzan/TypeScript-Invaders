/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
class ShipBullet extends Sprite {
    constructor(id: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bullet.png");
        super(id, "bullet", x, y, sprite_sheet);

        this._bounding_ray = 7;
        this._energy = 10;
    }

    _energy: number;

    update(context: InvasionLevel, state: GameState) {
        this.move(0, -5);
        if (this._y < 0) context.remove_ship_bullet(this, state);
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        context.remove_ship_bullet(this, state);
    }
}