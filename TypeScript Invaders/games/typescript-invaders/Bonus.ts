/// <reference path="InvasionLevel.ts" />
/// <reference path="GameState.ts" />
/// <reference path="SpriteSheet.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="ShipBullet.ts" />
class Bonus extends Sprite {

    _type: string;

    constructor(id: string, x: number, y: number, type: string) {
        this._type = type;
        this._bounding_ray = 6;

        var sprite_sheet: SpriteSheet = undefined;
        switch (type) {
            case "life":
                sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bonus-life.png");
                break;
            case "energy":
                sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bonus-energy.png");
                break;
            case "power":
                sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bonus-power.png");
                break;
            case "coin":
                sprite_sheet = new SpriteSheet("games/typescript-invaders/assets/images/bonus-coin.png");
                break;
        }
        super(id, "bonus", x, y, sprite_sheet);
    }

    collided(other_sprite: Sprite, context: InvasionLevel, state: GameState) {
        if (other_sprite instanceof ShipBullet) {
            switch (this._type) {
                case "life":
                    state.add_life();
                    break;
                case "energy":
                    context.add_energy_to_main(50, state);
                    break;
                case "power":
                    context.increase_shoot_power_to_main(state);
                    break;
                case "coin":
                    state.add_score(100);
                    break;
            }
        }
        context.remove_bonus(this, state);
    }
}