/// <reference path="GameScreen.ts" />
/// <reference path="GameState.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="Sprite.ts" />
class Ship extends Sprite {
    constructor(id: string, x: number, y: number) {
        var sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/ship.png");
        super(id, "ship", x, y, sprite_sheet);

        this._bounding_ray = 10;
        this._energy = 100;
        this._shoot_power = 10;
    }

    render(render_context: GameScreen) {
        render_context.draw_frame(this._sprite_sheet, this._x, this._y, 0, 0, 56, 33);
    }

    _energy: number;
    _shoot_power: number;

    add_energy(energy: number, state: GameState) {
        this._energy += energy;
        if (this._energy > 100) this._energy = 100;
    }

    increase_shoot_power(state: GameState) {
        this._shoot_power += 10;
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof Enemy) {
            var enemy = <Enemy>other_sprite;
            this._energy -= enemy._energy;
            if (this._energy <= 0) {
                state.loose_life();
            }
        }
    }

    shoot(context: InvasionLevel, state: GameState) {
        var bullet: ShipBullet = new ShipBullet("", this._x + 24, this._y + 4);
        context.add_ship_bullet(bullet, state);
    }
}