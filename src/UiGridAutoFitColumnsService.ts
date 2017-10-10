
import Measurer from './Measurer';
import UiGridMetrics from './UiGridMetrics';

export interface IExtendedColumnDef extends uiGrid.IColumnDef {
    enableColumnAutoFit: boolean;
}

export interface IExtendedGridColumn extends uiGrid.IGridColumn {
    colDef: IExtendedColumnDef;
    hasCustomWidth: boolean;
    minWidth: number;
    maxWidth: number;
    grid: IExtendedGridInstance;
}

export interface IExtendedGridInstance extends uiGrid.IGridInstance {
    options: IExtendedGridOptions;
    id: number;
}

export interface IExtendedGridOptions extends uiGrid.IGridOptions {
    enableColumnAutoFit: boolean;
}

export interface IAnyFilterPredicateFunc {
    (value: any, firstFlag?: any, secondFlag?: any): string;
}

export class UiGridAutoFitColumnsService {
    private gridMetrics: UiGridMetrics;

    /*@ngInject*/
    constructor (private $q: angular.IQService, private $filter: angular.IFilterService) {
        this.gridMetrics = new UiGridMetrics();
    }

    initializeGrid(grid: IExtendedGridInstance) {
        grid.registerColumnBuilder(this.colAutoFitColumnBuilder.bind(this));
        grid.registerColumnsProcessor(this.columnsProcessor.bind(this), 60);

        UiGridAutoFitColumnsService.defaultGridOptions(grid.options);
    }

    static defaultGridOptions(gridOptions: IExtendedGridOptions) {
        // true by default
        gridOptions.enableColumnAutoFit = gridOptions.enableColumnAutoFit !== false;
    }

    private getFilterIfExists<T>(filterName): any {
        try {
            return this.$filter<IAnyFilterPredicateFunc>(filterName);
        } catch (e) {
            return null;
        }
    }

    private getFilteredValue(value: string, cellFilter: string) {
        if (cellFilter && cellFilter !== '') {
            const filter = this.getFilterIfExists(cellFilter);
            if (filter) {
                value = filter(value);
            } else {
                // https://regex101.com/r/rC5eR5/2
                const re = /([^:]*):([^:]*):?([\s\S]+)?/;
                let matches;
                if ((matches = re.exec(cellFilter)) !== null) {
                    value = this.$filter<IAnyFilterPredicateFunc>(matches[1])(value, matches[2], matches[3]);
                }
            }
        }
        return value;
    }

    colAutoFitColumnBuilder(colDef: IExtendedColumnDef, col: IExtendedGridColumn, gridOptions: IExtendedGridOptions) {
        const promises = [];

        if (colDef.enableColumnAutoFit === undefined) {
            //TODO: make it as col.isResizable()
            if (UiGridAutoFitColumnsService.isResizable(colDef)) {
                colDef.enableColumnAutoFit = gridOptions.enableColumnAutoFit;
            } else {
                colDef.enableColumnAutoFit = false;
            }
        }

        return this.$q.all(promises);
    }

    static isResizable(colDef: IExtendedColumnDef): boolean {
        return !colDef.hasOwnProperty('width');
    }

    columnsProcessor(renderedColumnsToProcess?: Array<IExtendedGridColumn>, rows?: Array<uiGrid.IGridRow>) {
    
        if (!rows.length) {
            return renderedColumnsToProcess;
        }

        let optimalWidths: {
            [name: string]: number
        } = {};

        /* to be able to calculate the width of a column in any browser, we need to temporarily deactivate the min-width and max-width attributes set before */
        let tempCSS = '';
        renderedColumnsToProcess.forEach(function (column) {
            //30px and 9000px are the default values for minWidth and maxWidth in UI Grid.
            tempCSS += ' .grid' + column.grid.id + ' ' + column.getColClass(true) + ' { min-width: 30px !important; max-width: 9000px !important; }';
        });
        let tempStyle = $('<style>').text(tempCSS).appendTo('body');

        renderedColumnsToProcess.forEach(column => {

            if (column.colDef.enableColumnAutoFit && !column.hasCustomWidth) {
                const columnKey = column.field || column.name;
                
                let currentHeaderWidth = 0;
                if($('.ui-grid-header-cell' + column.getColClass(true))[0] !== undefined) {
                    currentHeaderWidth = $('.ui-grid-header-cell' + column.getColClass(true))[0].scrollWidth;
                } 
                let optimalHeaderWidth = currentHeaderWidth < column.minWidth ? column.minWidth : currentHeaderWidth;
                optimalHeaderWidth = optimalHeaderWidth > column.maxWidth ? column.maxWidth : optimalHeaderWidth;
                optimalWidths[columnKey] = optimalHeaderWidth;

                $(column.getColClass(true)).each(function () {
                    let currentCellWidth = this.scrollWidth;
                    let optimalCellWidth = currentCellWidth < column.minWidth ? column.minWidth : currentCellWidth;
                    optimalCellWidth = optimalCellWidth > column.maxWidth ? column.maxWidth : optimalCellWidth;
                    if (optimalCellWidth > optimalWidths[columnKey]) {
                        optimalWidths[columnKey] = optimalCellWidth;
                    }
                });

                column.colDef.width = optimalWidths[columnKey] + this.gridMetrics.getPadding() + this.gridMetrics.getBorder();
                column.updateColumnDef(column.colDef, false);
            }
        });

        tempStyle.remove();

        return renderedColumnsToProcess;
    }

}
