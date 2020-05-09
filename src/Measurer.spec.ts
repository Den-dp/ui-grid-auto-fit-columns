import { Measurer } from './Measurer';

describe(`Measurer`, () => {
    it(`should calculate text width`, () => {
        const width = Measurer.measureRoundedTextWidth('test', 'Arial 10px')
        expect(width).toEqual(17);
    });
});
