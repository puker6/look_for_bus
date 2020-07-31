

'use strict';

locManModule
    .factory("locLayoutService", ["$http", "apiUrl", function ($http, apiUrl) {
        return {
            getMenu: function () {
                let url = config.schemaVersion === 'prod' ? './json/menu.json' : './app/mocks/menu.json';
                return $http.get(url);
            },
        }
    }]);