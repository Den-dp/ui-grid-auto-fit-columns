export class UiGridMetrics {
    private headerFont: string;
    private cellFont: string;
    private padding: number;
    private border: number;

    getHeaderFont(){
        if(this.headerFont){
            return this.headerFont;
        }

        let header = document.querySelector('.ui-grid-header-cell .ui-grid-cell-contents');

        if(!header) {
            throw new Error('not found: .ui-grid-header-cell .ui-grid-cell-contents');
        }

        let headerStyle = getComputedStyle(header);
        this.headerFont = UiGridMetrics.getFontStringFrom(headerStyle);
        return this.headerFont;
    }

    getCellFont(){
        if(this.cellFont){
            return this.cellFont;
        }

        let cell = document.querySelector('.ui-grid-cell > .ui-grid-cell-contents');

        if(!cell){
            let element = document.createElement('div');
            element.className = 'ui-grid-cell-contents';
            element.style.cssFloat = 'left';
            angular.element(document.body).append(element);
            let cellStyle = getComputedStyle(element);
            this.cellFont = UiGridMetrics.getFontStringFrom(cellStyle);
            angular.element(element).remove();
            return this.cellFont;
        }

        let cellStyle = getComputedStyle(cell);
        this.cellFont = UiGridMetrics.getFontStringFrom(cellStyle);
        return this.cellFont;
    }

    getPadding(){
        if(this.padding){
            return this.padding;
        }

        let header = document.querySelector('.ui-grid-header-cell .ui-grid-cell-contents');

        if(!header) {
            throw new Error('not found: .ui-grid-header-cell .ui-grid-cell-contents');
        }

        let {paddingLeft, paddingRight} = getComputedStyle(header);
        this.padding = parseInt(paddingLeft) + parseInt(paddingRight);
        return this.padding;
    }

    getBorder(){
        if(this.border){
            return this.border;
        }

        let header = document.querySelector('.ui-grid-header-cell');

        if(!header) {
            throw new Error('not found: .ui-grid-header-cell');
        }

        let {borderRightWidth} = getComputedStyle(header);
        this.border = parseInt(borderRightWidth);
        return this.border;
    }

    getHeaderButtonsWidth(){
        // TODO: lets be more precise
        const HEADER_BUTTONS_WIDTH = 25;
        return HEADER_BUTTONS_WIDTH;
    }

    private static getFontStringFrom({fontStyle, fontVariant, fontWeight, fontSize, fontFamily}: CSSStyleDeclaration): string {
        // in FF cssStyle.font may be '' so we need to collect it manually
        // font: [font-style||font-variant||font-weight] font-size [/line-height] font-family | inherit
        return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;
    }

}

export default UiGridMetrics;
