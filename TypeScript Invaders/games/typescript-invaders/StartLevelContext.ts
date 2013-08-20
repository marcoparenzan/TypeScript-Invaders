/// <reference path="GameContext.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="GameState.ts" />
class StartLevelContext extends GameContext {

    _level: number;
    _text: string

    constructor(level: number, text: string) {
        super();

        var context = this;

        this._level = level;
        this._text = text;
    }

    render_common(game_screen: GameScreen, state: GameState) {
    }

    render(game_screen: GameScreen, state: GameState) {
        var context = this;

        game_screen.clear();

        game_screen.write("Inizia il livello " + this._level.toString(), 270, 245);
        game_screen.write(this._text, 270, 265);
        game_screen.write("Press s to start", 280, 285);

        context.render_common(game_screen, state);
    }

    update(state: GameState) {
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
            };
        }
    }
}