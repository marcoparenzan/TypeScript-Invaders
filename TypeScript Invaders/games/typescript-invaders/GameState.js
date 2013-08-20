/// <reference path="SpriteSheet.ts" />
/// <reference path="InvasionLevel.ts" />
/// <reference path="EndGameContext.ts" />
/// <reference path="StartLevelContext.ts" />
/// <reference path="StartGameContext.ts" />
/// <reference path="GameCommand.ts" />
/// <reference path="GameContext.ts" />
var GameState = (function () {
    function GameState(game_screen) {
        this.initialize();
        this.paused = true;

        this.render = function (game_state) {
            game_state.current_context.render(game_screen, game_state);
        };
        this.update = function (game_state) {
            game_state.current_context.update(game_state);
        };

        this.current_context = new StartGameContext();
    }
    GameState.prototype.initialize = function () {
        this.level = 1;
        this.lives = 3;
        this.score = 0;
        this.time = 0;
        this.commands = [];
    };

    GameState.prototype._start = function () {
        var game_state = this;
        game_state._timerToken = setInterval(function () {
            game_state.render(game_state);
            game_state.update(game_state);
            game_state.time++;
        }, 33);
    };

    GameState.prototype._stop = function () {
        var game_state = this;
        clearTimeout(game_state._timerToken);
    };

    GameState.prototype.toggle_pause = function () {
        if (this.paused) {
            this._start();
            this.paused = false;
        } else {
            this._stop();
            this.paused = true;
            this.render(this);
        }
    };

    // public API
    GameState.prototype.push_command = function (name) {
        this.commands.push({
            name: name,
            time: this.time
        });
    };

    GameState.prototype.pop_all_commands = function () {
        var temp = this.commands;
        this.commands = [];
        return temp;
    };

    GameState.prototype.add_score = function (score) {
        this.score += score;
    };

    GameState.prototype.add_life = function () {
        this.lives++;
    };

    GameState.prototype.loose_life = function () {
        this.lives--;
        if (this.lives == 0) {
            this.current_context = new EndGameContext();
        }
        return (this.lives <= 0);
    };

    GameState.prototype.get_lives = function () {
        return this.lives;
    };
    return GameState;
})();
