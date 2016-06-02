angular.module('app', ['ui.grid', 'ui.grid.pagination', 'ui.grid.autoFitColumns', 'ui.grid.resizeColumns'])
    .filter('tryCurrency', tryCurrency)
    .filter('tryFancy', tryFancy)
    .run(run);

function tryFancy(){
    return function(value){
        return value.replace(/(\w{3})+/g, '$&,');
    };
}

function tryCurrency() {
    return function(value) {
        return typeof (value) === 'number' ? value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : value;
    }
}

run.$inject = ['$http', '$rootScope'];
function run($http, $rootScope) {

    var sortingAlgorithm = function(a, b, rowA, rowB, direction) {
        return (a || '').length - (b || '').length;
    };
    $rootScope.gridOptions = {
        paginationPageSizes: [25, 50, 100, 200, 500],
        paginationPageSize: 500,
        useExternalPagination: false,
        enableFiltering: true,
        //flatEntityAccess: true,
        enableColumnResizing: true,
        enableColumnMenus: false,
        columnDefs: [
            /*{field: 'id'},
            {field: 'name', cellFilter: 'tryFancy'},
            {field: 'age', cellFilter: 'tryCurrency'},
            {field: 'address.city'},
            {field: 'address.state'},
            {field: 'age again', field: 'age'}*/
            { field:'id', type: 'number' },
            { field:'name', cellFilter: 'tryFancy', sortingAlgorithm: sortingAlgorithm },
            { field:'age', cellFilter: 'tryCurrency' },
            { field:'guid' },
            { field:'registered', cellFilter: 'date:"yyyy-MM-dd"'},
            { displayName:'registered2', field: 'registered', cellFilter: 'date:"medium"'},
            { field:'picture'},
            { field:'address.street' },
            { field:'address.city', width:20 },
            { field:'address.state' },
            { field:'address.zip' },
            { field:'company', sortingAlgorithm: sortingAlgorithm },
            { field:'email', sortingAlgorithm: sortingAlgorithm },
            { field:'phone' },
            { field:'about' },
            { field:'friends[0].name', displayName:'1st friend' },
            { field:'friends[1].name', displayName:'2nd friend' },
            { field:'friends[2].name', displayName:'3rd friend' },
        ],
    };

    //$http.get('http://ui-grid.info/data/10000_complex.json')
    $http.get('500_complex.json')
        .then(onHoldingsRecieved);

    $rootScope.reload = function(){
        $http.get('500_complex.json')
            .then(onHoldingsRecieved);
    };

    function onHoldingsRecieved(response) {
        $rootScope.gridOptions.data = response.data;
    }

}