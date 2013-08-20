/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="GameContext.ts" />
class EndGameContext extends GameContext {
    constructor() {
        super();

        var context = this;
    }

    render_common(game_screen: GameScreen, state: GameState) {
    }

    render(game_screen: GameScreen, state: GameState) {
        var context = this;

        game_screen.clear();

        game_screen.write("Game is finished", 280, 245);
        game_screen.write("You scored " + state.score.toString() + " points", 280, 265);
        game_screen.write("Press r to restart", 280, 285);

        context.render_common(game_screen, state);
    }

    update(state: GameState) {
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
            };
        }
    }
}
