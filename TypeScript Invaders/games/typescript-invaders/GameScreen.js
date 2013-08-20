/// <reference path="SpriteSheet.ts" />
var GameScreen = (function () {
    function GameScreen(render_context) {
        this._render_context = render_context;
    }
    GameScreen.prototype.clear = function () {
        this._render_context.clearRect(0, 0, this._render_context.canvas.width, this._render_context.canvas.height);
    };

    GameScreen.prototype.draw = function (sprite_sheet, x, y) {
        this._render_context.drawImage(sprite_sheet.frames, x, y);
    };

    GameScreen.prototype.draw_frame = function (sprite_sheet, x, y, fx, fy, width, height) {
        this._render_context.drawImage(sprite_sheet.frames, fx, fy, width, height, x, y, width, height);
    };

    GameScreen.prototype.write = function (text, x, y) {
        this._render_context.strokeText(text, x, y);
    };
    return GameScreen;
})();
