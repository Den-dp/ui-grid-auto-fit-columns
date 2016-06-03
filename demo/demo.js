angular.module('autoFitColumnsExample', [
    'ui.grid.autoFitColumns',
    'ui.grid.pagination',
    'ui.grid.resizeColumns'
])
    .controller('MainController', MainController);

MainController.$inject = ['$http'];
function MainController($http){

    this.gridOptions = {
        paginationPageSizes: [25, 50, 100, 200, 500],
        paginationPageSize: 500,
        enableColumnMenus: false,
        columnDefs: [
            { field: 'id', type: 'number' },
            { field: 'name' },
            { field: 'address.city', width: 100 }, //respect width
            { field: 'address.state' },
            { field: 'age' },
            { displayName: 'age again', field: 'age' }, //works ok with aliases
            { field: 'guid' },
            { field: 'registered', cellFilter: 'date:"yyyy-MM-dd"' }, //can handle filters
            { field: 'registered', displayName: 'registered2', cellFilter: 'date:"medium"' },
            { field: 'picture' },
            { field: 'address.street' },
            { field: 'address.city' },
            { field: 'address.state' },
            { field: 'address.zip' },
            { field: 'company' },
            { field: 'email' },
            { field: 'phone' },
            { field: 'about' },
            { field: 'friends[0].name', displayName: '1st friend' }, //works fine with "flat entities"
            { field: 'friends[1].name', displayName: '2nd friend' },
            { field: 'friends[2].name', displayName: '3rd friend' }
        ]
    };

    $http.get('500_complex.json')
        .then(function(response) {
            this.gridOptions.data = response.data;
        }.bind(this));

}