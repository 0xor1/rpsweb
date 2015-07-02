require.config({
    baseUrl: 'component',
    paths: {
        'ng': '../lib/angular-1.4.1',
        'ngRoute': '../lib/angular-route-1.4.1',
        'text': '../lib/require-text-2.0.14',
        'service': '../service',
        'registry': '../registry'
    },
    shim: {
        'ngRoute': {
            deps: ['ng'],
            exports: 'angular'
        },
        'ng': {
            exports: 'angular'
        }
    }
});