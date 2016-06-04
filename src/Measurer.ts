export class Measurer {
    private static canvas: HTMLCanvasElement;

    static measureTextWidth(text: string, font: string): number{
        const canvas = Measurer.canvas || (Measurer.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    static measureRoundedTextWidth(text: string, font: string): number{
        const width = Measurer.measureTextWidth(text, font);
        return Math.floor(width) + 1;
    }
}

export default Measurer;
