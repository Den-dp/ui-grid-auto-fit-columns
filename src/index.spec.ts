import uiGridAutoFitColumnModule from './index';

describe(`ui-grid-auto-fit-columns package`, () => {
    it(`should export 'ui.grid.autoFitColumns' angular module name via default export`, () => {
        expect(uiGridAutoFitColumnModule).toEqual('ui.grid.autoFitColumns');
    });
});
