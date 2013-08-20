class SpriteSheet
{
    frames: HTMLImageElement;

    constructor(asset_src: string)
    {
        this.frames = new Image();
        this.frames.src = asset_src;
    }
}