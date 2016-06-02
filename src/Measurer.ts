export class Measurer {
    private static canvas: HTMLCanvasElement;

    static measureTextWidth(text: string, font: string): number{
        var canvas = Measurer.canvas || (Measurer.canvas = document.createElement('canvas'));
        var context = canvas.getContext('2d');
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    static measureRoundedTextWidth(text: string, font: string): number{
        const width = Measurer.measureTextWidth(text, font);
        return Math.floor(width) + 1;
    }
}

export default Measurer;