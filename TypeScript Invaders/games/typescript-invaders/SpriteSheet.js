var SpriteSheet = (function () {
    function SpriteSheet(asset_src) {
        this.frames = new Image();
        this.frames.src = asset_src;
    }
    return SpriteSheet;
})();
