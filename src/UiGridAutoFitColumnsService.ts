import * as get from 'lodash/object/get';
import Measurer from './Measurer';

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
    (value: any, firstFlag?:any, secondFlag?: any): string;
}

export class UiGridAutoFitColumnsService {

    /*@ngInject*/
    constructor (private $q: angular.IQService, private $filter: angular.IFilterService) {
    }


    initializeGrid(grid: IExtendedGridInstance) {
        grid.registerColumnBuilder(this.colAutoFitColumnBuilder.bind(this));
        grid.registerColumnsProcessor(this.columnsProcessor.bind(this), 60);

        UiGridAutoFitColumnsService.defaultGridOptions(grid.options);
        
    }

    static defaultGridOptions(gridOptions: IExtendedGridOptions){
        // true by default
        gridOptions.enableColumnAutoFit = gridOptions.enableColumnAutoFit !== false;
    }

    private getFilterIfExists<T>(filterName): any {
        try {
            return this.$filter<IAnyFilterPredicateFunc>(filterName);
        } catch (e){
            return null;
        }
    }

    private getFilteredValue(value: string, cellFilter: string){
        if (cellFilter && cellFilter !== ''){
            const filter = this.getFilterIfExists(cellFilter);
            if (filter) {
                value = filter(value);
            } else {
                // https://regex101.com/r/rC5eR5/3
                const re = /([^:]*):["']([^:]*)["']:?([\s\S]+)?/;
                let matches;
                if ((matches = re.exec(cellFilter)) !== null) {
                    value = this.$filter<IAnyFilterPredicateFunc>(matches[1])(value, matches[2], matches[3]);
                }
            }
        }
        return value;
    }

    colAutoFitColumnBuilder(colDef: IExtendedColumnDef, col: IExtendedGridColumn, gridOptions: IExtendedGridOptions){
        var promises = [];

        if(colDef.enableColumnAutoFit === undefined) {
            //TODO: make it as col.isResizable()
            if(UiGridAutoFitColumnsService.isResizable(colDef)) {
                colDef.enableColumnAutoFit = gridOptions.enableColumnAutoFit;
            } else {
                colDef.enableColumnAutoFit = false;
            }
        }
        
        return this.$q.all(promises);
    }
    
    static isResizable(colDef: IExtendedColumnDef): boolean{
        return !colDef.hasOwnProperty('width');
    }

    columnsProcessor(renderedColumnsToProcess?: Array<IExtendedGridColumn>, rows?: Array<uiGrid.IGridRow>){
        if(!rows.length){
            return renderedColumnsToProcess;
        }

        // TODO: respect existing colDef options
        // if (col.colDef.enableColumnAutoFitting === false) return; 

        // TODO: try not to be tied to the class names
        const computedCellStyle = getComputedStyle(document.querySelector('.ui-grid-cell') || document.querySelector('.ui-grid-header-cell'));
        const computedCellContentStyle = getComputedStyle(document.querySelector('.ui-grid-cell-contents'));
        const font = computedCellContentStyle.font;
        const padding = parseInt(computedCellStyle.borderRightWidth) + parseInt(computedCellContentStyle.paddingRight) + parseInt(computedCellContentStyle.paddingLeft);
        const HEADER_BUTTONS_WIDTH = 25;

        const displayNames = renderedColumnsToProcess.map(col=>({key: col.name, displayName: col.displayName}));
        let optimalWidths: {
            [name: string]: number 
        } = {};

        renderedColumnsToProcess.forEach(column => {
            
            if(column.colDef.enableColumnAutoFit) {
                const columnKey = column.name;
                optimalWidths[columnKey] = Measurer.measureTextWidth(column.displayName, font) + HEADER_BUTTONS_WIDTH;
                //this.$log.info(`${optimalWidths[pair.key]} ${pair.displayName}`);

                rows.forEach((row) => {
                    let formatedCell;
                    const rawText = get(row.entity, columnKey, row.entity[column.field]);

                    if(!!column.colDef.cellFilter){
                        formatedCell = this.getFilteredValue(rawText, column.colDef.cellFilter);
                    }

                    const currentCellWidth = Measurer.measureTextWidth(formatedCell || rawText, font);
                    const optimalCellWidth = currentCellWidth > 300 ? 300 : currentCellWidth;

                    if (optimalCellWidth > optimalWidths[columnKey]) {
                        optimalWidths[columnKey] = optimalCellWidth;
                        //this.$log.info(`${optimalWidths[columnKey]} ${formatedCell || rawText}`);
                    }
                });

                column.colDef.width = optimalWidths[column.name]+padding;
                column.updateColumnDef(column.colDef, false);
            }
        });
    
        return renderedColumnsToProcess;
    }

}
