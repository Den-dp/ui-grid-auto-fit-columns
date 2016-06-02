import * as angular from 'angular';
import { UiGridAutoFitColumnsService } from './UiGridAutoFitColumnsService';
import { UiGridAutoFitColumnsDirective } from './UiGridAutoFitColumnsDirective';

export default angular.module('ui.grid.autoFitColumns', ['ui.grid'])
    .service('uiGridAutoFitColumnsService', UiGridAutoFitColumnsService)
    .directive('uiGridAutoFitColumns', UiGridAutoFitColumnsDirective)
    .name;
