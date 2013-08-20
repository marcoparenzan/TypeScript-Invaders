var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameContext.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="GameState.ts" />
var StartLevelContext = (function (_super) {
    __extends(StartLevelContext, _super);
    function StartLevelContext(level, text) {
        _super.call(this);

        var context = this;

        this._level = level;
        this._text = text;
    }
    StartLevelContext.prototype.render_common = function (game_screen, state) {
    };

    StartLevelContext.prototype.render = function (game_screen, state) {
        var context = this;

        game_screen.clear();

        game_screen.write("Inizia il livello " + this._level.toString(), 270, 245);
        game_screen.write(this._text, 270, 265);
        game_screen.write("Press s to start", 280, 285);

        context.render_common(game_screen, state);
    };

    StartLevelContext.prototype.update = function (state) {
        var context = this;

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.name) {
                case "start":
                    state.current_context = new InvasionLevel();
                    break;
                default:
                    break;
            }
            ;
        }
    };
    return StartLevelContext;
})(GameContext);
