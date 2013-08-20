// http://stackoverflow.com/questions/12682028/how-do-i-get-jquery-autocompletion-in-typescript
/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="GameScreen.ts" />
/// <reference path="GameState.ts" />

$(function () {

    // http://stackoverflow.com/questions/12686927/typescript-casting-htmlelement
    var render_canvas = <HTMLCanvasElement>document.getElementById("main");
    var render_context = <CanvasRenderingContext2D>render_canvas.getContext("2d");
    render_context.font = '12pt Calibri';
    render_context.lineWidth = 3;
    render_context.strokeStyle = 'blue';

    var game_screen = new GameScreen(render_context);

    var game_state = new GameState(game_screen);

    window.onkeydown = (e) => {
        switch (e.keyCode)
        {
            case 78: // n
                game_state.push_command("move_left");
                break;
            case 77: // m
                game_state.push_command("move_right");
                break;
            case 90: // z
                game_state.push_command("shoot");
                break;
            case 82: // r
                game_state.push_command("restart");
                break;
            case 83: // s
                game_state.push_command("start");
                break;
            case 67: // c
                game_state.push_command("continue");
                break;
           case 80: // p
                game_state.toggle_pause();
                break;
            default:
                // unhandled key
                break;
        }
    };

    game_state.toggle_pause();
});
