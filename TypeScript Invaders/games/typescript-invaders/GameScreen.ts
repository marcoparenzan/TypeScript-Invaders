/// <reference path="SpriteSheet.ts" />
class GameScreen {
    _render_context: CanvasRenderingContext2D;

    constructor(render_context: CanvasRenderingContext2D) {
        this._render_context = render_context;
    }

    clear() {
        this._render_context.clearRect(0, 0, this._render_context.canvas.width, this._render_context.canvas.height);
    }

    draw(sprite_sheet: SpriteSheet, x: number, y: number)
    {
        this._render_context.drawImage(sprite_sheet.frames, x, y);
    }

    draw_frame(sprite_sheet: SpriteSheet, x: number, y: number, fx: number, fy: number, width: number, height: number) {
        this._render_context.drawImage(sprite_sheet.frames, fx, fy, width, height, x, y, width, height);
    }

    write(text: string, x:number, y:number)
    {
        this._render_context.strokeText(text, x, y);
    }

/*
    to_image(callback: (Image) => void) {
        var image = new HTMLImageElement();
        image.onload = function () {
            callback(image);
        }
        image.src = this._render_context.canvas.toDataURL("image/png");
    }

    download(image: HTMLImageElement) {
        // atob to base64_decode the data-URI
        var image_data = atob(image.src.split(',')[1]);
        // Use typed arrays to convert the binary data to a Blob
        var arraybuffer = new ArrayBuffer(image_data.length);
        var view = new Uint8Array(arraybuffer);
        for (var i = 0; i < image_data.length; i++) {
            view[i] = image_data.charCodeAt(i) & 0xff;
        }
        try {
            // This is the recommended method:
            var blob = new Blob([arraybuffer], { type: 'application/octet-stream' });
        } catch (e) {
            // The BlobBuilder API has been deprecated in favour of Blob, but older
            // browsers don't know about the Blob constructor
            // IE10 also supports BlobBuilder, but since the `Blob` constructor
            //  also works, there's no need to add `MSBlobBuilder`.
            var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
            bb.append(arraybuffer);
            var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
        }

        // Use the URL object to create a temporary URL
        var url = (window.webkitURL || window.URL).createObjectURL(blob);
        location.href = url; // <-- Download!
    }
*/
}