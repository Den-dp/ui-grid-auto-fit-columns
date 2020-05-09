import { UiGridAutoFitColumnsService } from './UiGridAutoFitColumnsService';

export function UiGridAutoFitColumnsDirective (uiGridAutoFitColumnsService: UiGridAutoFitColumnsService) {
    return {
        replace: true,
        priority: 0,
        require: '^uiGrid',
        scope: false,
        compile: function () {
            return {
                pre: function ($scope, $elm, $attrs, uiGridCtrl) {
                    uiGridAutoFitColumnsService.initializeGrid(uiGridCtrl.grid);
                }
            };
        }
    };
}
UiGridAutoFitColumnsDirective.$inject = ['uiGridAutoFitColumnsService'];
