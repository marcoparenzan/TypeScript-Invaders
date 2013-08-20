/// <reference path="GameContext.ts" />
class EndLevelContext extends GameContext {

    _level: number;

    constructor(level: number) {
        super();

        var context = this;

        this._level = level;
    }

    render_common(game_screen: GameScreen, state: GameState) {
    }

    render(game_screen: GameScreen, state: GameState) {
        var context = this;

        game_screen.clear();

        game_screen.write("Hai completato il livello " + this._level.toString(), 270, 245);
        game_screen.write("Press C to continue", 280, 265);

        context.render_common(game_screen, state);
    }

    update(state: GameState) {
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
            };
        }
    }
}