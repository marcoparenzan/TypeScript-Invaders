var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="GameContext.ts" />
/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
var StartGameContext = (function (_super) {
    __extends(StartGameContext, _super);
    function StartGameContext() {
        _super.call(this);

        var context = this;
    }
    StartGameContext.prototype.render_common = function (game_screen, state) {
    };

    StartGameContext.prototype.render = function (game_screen, state) {
        var context = this;

        game_screen.clear();

        game_screen.write("TypeScript Invaders", 270, 245);
        game_screen.write("Press s to start", 280, 265);

        context.render_common(game_screen, state);
    };

    StartGameContext.prototype.update = function (state) {
        var context = this;

        var commands = state.pop_all_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            switch (command.name) {
                case "start":
                    state.current_context = new StartLevelContext(state.level, state.level.toString());
                    break;
                default:
                    break;
            }
            ;
        }
    };
    return StartGameContext;
})(GameContext);
