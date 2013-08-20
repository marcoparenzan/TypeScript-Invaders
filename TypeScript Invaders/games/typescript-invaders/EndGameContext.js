var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="GameContext.ts" />
var EndGameContext = (function (_super) {
    __extends(EndGameContext, _super);
    function EndGameContext() {
        _super.call(this);

        var context = this;
    }
    EndGameContext.prototype.render_common = function (game_screen, state) {
    };

    EndGameContext.prototype.render = function (game_screen, state) {
        var context = this;

        game_screen.clear();

        game_screen.write("Game is finished", 280, 245);
        game_screen.write("You scored " + state.score.toString() + " points", 280, 265);
        game_screen.write("Press r to restart", 280, 285);

        context.render_common(game_screen, state);
    };

    EndGameContext.prototype.update = function (state) {
        var context = this;

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.name) {
                case "restart":
                    state.initialize();
                    state.current_context = new StartGameContext();
                    break;
                default:
                    break;
            }
            ;
        }
    };
    return EndGameContext;
})(GameContext);
