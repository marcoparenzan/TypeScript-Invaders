var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameContext.ts" />
var EndLevelContext = (function (_super) {
    __extends(EndLevelContext, _super);
    function EndLevelContext(level) {
        _super.call(this);

        var context = this;

        this._level = level;
    }
    EndLevelContext.prototype.render_common = function (game_screen, state) {
    };

    EndLevelContext.prototype.render = function (game_screen, state) {
        var context = this;

        game_screen.clear();

        game_screen.write("Hai completato il livello " + this._level.toString(), 270, 245);
        game_screen.write("Press C to continue", 280, 265);

        context.render_common(game_screen, state);
    };

    EndLevelContext.prototype.update = function (state) {
        var context = this;

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.name) {
                case "continue":
                    state.current_context = new StartLevelContext(state.level, state.level.toString());
                    break;
                default:
                    break;
            }
            ;
        }
    };
    return EndLevelContext;
})(GameContext);
