var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="InvasionLevel.ts" />
/// <reference path="GameState.ts" />
/// <reference path="SpriteSheet.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="ShipBullet.ts" />
var Bonus = (function (_super) {
    __extends(Bonus, _super);
    function Bonus(id, x, y, type) {
        this._type = type;
        this._bounding_ray = 6;

        var sprite_sheet = undefined;
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
        _super.call(this, id, "bonus", x, y, sprite_sheet);
    }
    Bonus.prototype.collided = function (other_sprite, context, state) {
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
    };
    return Bonus;
})(Sprite);
