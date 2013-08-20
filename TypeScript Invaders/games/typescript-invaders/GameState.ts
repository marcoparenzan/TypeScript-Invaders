/// <reference path="SpriteSheet.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="EndGameContext.ts" />
/// <reference path="StartLevelContext.ts" />
/// <reference path="StartGameContext.ts" />
/// <reference path="GameCommand.ts" />
/// <reference path="GameContext.ts" />
class GameState
{
    constructor(game_screen: GameScreen) {

        this.initialize();
        this.paused = true;

        this.render = function (game_state: GameState) {
            game_state.current_context.render(game_screen, game_state);
        };
        this.update = function (game_state: GameState) {
            game_state.current_context.update(game_state);
        };

        this.current_context = new StartGameContext();
    }

    initialize()
    {
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.time = 0;
        this.commands = [];
    }

    level: number;
    lives: number;
    score: number;
    time: number;
    commands: GameCommand[];

    paused: boolean;

    render: (GameState) => void;
    update: (GameState) => void;

    current_context: GameContext;

    // suspension

    _timerToken: number;

    _start() {
        var game_state = this;
        game_state._timerToken = setInterval(function () {
            game_state.render(game_state);
            game_state.update(game_state);
            game_state.time++;
        }, 33);
    }

    _stop()
    {
        var game_state = this;
        clearTimeout(game_state._timerToken);
    }

    toggle_pause() {
        if (this.paused) {
            this._start();
            this.paused = false;
        }
        else {
            this._stop();
            this.paused = true;
            this.render(this);
       }
    }

    // public API

    push_command(name: string) {
        this.commands.push({
            name: name
            ,
            time: this.time
        });
    }

    pop_all_commands(): GameCommand[] {
        var temp = this.commands;
        this.commands = [];
        return temp;
    }

    add_score(score: number) {
        this.score += score;
    }

    add_life() {
        this.lives++;
    }

    loose_life(): boolean {
        this.lives--;
        if (this.lives == 0) {
            this.current_context = new EndGameContext();
        }
        return (this.lives <= 0);
    }

    get_lives(): number {
        return this.lives;
    }
}