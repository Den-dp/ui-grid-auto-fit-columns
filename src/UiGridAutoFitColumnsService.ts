import * as get from 'lodash/object/get';
import Measurer from './Measurer';
import UiGridMetrics from './UiGridMetrics';

interface IExtendedColumnDef extends uiGrid.IColumnDef {
    enableColumnAutoFit: boolean;
}

interface IExtendedGridColumn extends uiGrid.IGridColumn {
    colDef: IExtendedColumnDef;
}

interface IExtendedGridInstance extends uiGrid.IGridInstance {
    options: IExtendedGridOptions;
}

interface IExtendedGridOptions extends uiGrid.IGridOptions {
    enableColumnAutoFit: boolean;
}

interface IAnyFilterPredicateFunc {
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
        // TODO: respect existing colDef options
        // if (col.colDef.enableColumnAutoFitting === false) return;

        let optimalWidths: {
            [name: string]: number
        } = {};


        renderedColumnsToProcess.forEach(column => {

            if (column.colDef.enableColumnAutoFit) {
                const columnKey = column.field || column.name;
                optimalWidths[columnKey] = Measurer.measureRoundedTextWidth(column.displayName, this.gridMetrics.getHeaderFont()) + this.gridMetrics.getHeaderButtonsWidth();

                rows.forEach((row) => {
                    let cellText = get(row.entity, columnKey);

                    if (!!column.colDef.cellFilter) {
                        cellText = this.getFilteredValue(cellText, column.colDef.cellFilter);
                    }

                    const currentCellWidth = Measurer.measureRoundedTextWidth(cellText, this.gridMetrics.getCellFont());
                    const optimalCellWidth = currentCellWidth > 300 ? 300 : currentCellWidth;

                    if (optimalCellWidth > optimalWidths[columnKey]) {
                        optimalWidths[columnKey] = optimalCellWidth;
                    }
                });

                column.colDef.width = optimalWidths[columnKey] + this.gridMetrics.getPadding() + this.gridMetrics.getBorder();
                column.updateColumnDef(column.colDef, false);
            }
        });
        return renderedColumnsToProcess;
    }

}
