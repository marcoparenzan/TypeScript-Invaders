/// <reference path="Enemy.ts" />
/// <reference path="ShipBullet.ts" />
/// <reference path="Sprite.ts" />
class Invader extends Enemy {

    _direction_left_to_right: boolean;
    _count: number;
    _down_times: number;

    constructor(id: string, type: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/enemy-" + type + ".png");
        super(id, "enemy", x, y, sprite_sheet);

        this._direction_left_to_right = true;
        this._count = 30;
        this._down_times = 0;
    }

    update(context: InvasionLevel, state: GameState) {
        if (this._count > 0) {
            if (this._direction_left_to_right) {
                this.move(5, 0);
            } else {
                this.move(-5, 0);
            }
            this._count--;
        }
        else {
            this.move(0, 5);
            this._direction_left_to_right = !this._direction_left_to_right;
            this._count = 30;
            this._down_times++;
        }
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof ShipBullet) {
            var bullet = <ShipBullet>other_sprite;
            this._energy -= bullet._energy;
            if (this._energy <= 0) {
                state.add_score(this._score);
                context.remove_enemy(this, state);
            }
        }
    }
}