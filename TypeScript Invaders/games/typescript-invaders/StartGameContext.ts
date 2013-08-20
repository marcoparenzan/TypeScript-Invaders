/// <reference path="GameContext.ts" />
/// <reference path="GameState.ts" />
/// <reference path="GameScreen.ts" />
class StartGameContext extends GameContext
{
    constructor() {
        super();

        var context = this;
    }

    render_common(game_screen: GameScreen, state: GameState) {
    }

    render(game_screen: GameScreen, state: GameState) {
        var context = this;

        game_screen.clear();

        game_screen.write("TypeScript Invaders", 270, 245);
        game_screen.write("Press s to start", 280, 265);

        context.render_common(game_screen, state);
    }

    update(state: GameState) {
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
            };
        }
    }
}