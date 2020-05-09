angular.module('autoFitColumnsExample', [
    'ui.grid.autoFitColumns',
    'ui.grid.pagination',
    'ui.grid.resizeColumns'
])
    .controller('MainController', MainController);

MainController.$inject = ['$http'];
function MainController($http){
    function sortByLength(a, b) {
        return (a || '').length - (b || '').length;
    }
    this.gridOptions = {
        paginationPageSizes: [25, 50, 100, 200, 500],
        paginationPageSize: 500,
        enableFiltering: true,
        enableColumnMenus: false,
        columnDefs: [
            { name: 'id', type: 'number' },
            { name: 'name' },
            { name: 'address.city', width: 100 }, //respect width
            { name: 'address.state' },
            { name: 'address.zip' },
            { name: 'age' },
            { name: 'age again', field: 'age', displayName: 'age again' }, //works ok with aliases
            { field: 'age', displayName: 'third age in a row' }, //works ok with aliases
            { name: 'guid' },
            { name: 'registered', cellFilter: 'date:"yyyy-MM-dd"' }, //can handle filters
            { name: 'registered', displayName: 'registered2', cellFilter: 'date:"medium"' },
            { name: 'picture' },
            { name: 'company' },
            { name: 'email' },
            { name: 'phone' },
            { name: 'about' },
            { name: 'friends[0].name', displayName: '1st friend' }, //works fine with "flat entities"
            { name: 'friends[1].name', displayName: '2nd friend' },
            { name: 'friends[2].name', displayName: '3rd friend' }
        ]
    };

    this.gridOptions.columnDefs = this.gridOptions.columnDefs.map(function (colDef) {
        colDef.sortingAlgorithm = sortByLength;
        return colDef;
    });

    $http.get('https://raw.githubusercontent.com/angular-ui/ui-grid/master/misc/site/data/500_complex.json')
        .then(function(response) {
            this.gridOptions.data = response.data;
        }.bind(this));

}
