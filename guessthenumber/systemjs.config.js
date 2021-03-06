System.config({
    map : {
        'app': 'app',
        'rxjs': 'https://npmcdn.com/rxjs@5.0.0-beta.6',
        '@angular/common': 'https://npmcdn.com/@angular/common@2.0.0-rc.4',
        '@angular/compiler': 'https://npmcdn.com/@angular/compiler@2.0.0-rc.4',
        '@angular/core': 'https://npmcdn.com/@angular/core@2.0.0-rc.4',
        '@angular/platform-browser': 'https://npmcdn.com/@angular/platform-browser@2.0.0-rc.4',
        '@angular/platform-browser-dynamic': 'https://npmcdn.com/@angular/platform-browser-dynamic@2.0.0-rc.4'
    },
    packages:{
        'app':  { main: 'main.ts',  defaultExtension: 'ts' },
        '@angular/common': { main: 'bundles/common.umd.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'bundles/compiler.umd.js', defaultExtension: 'js' },
        '@angular/core': { main: 'bundles/core.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'bundles/platform-browser.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'bundles/platform-browser-dynamic.umd.js', defaultExtension: 'js' },
    },
    // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
    transpiler: 'typescript',
    typescriptOptions: {
        emitDecoratorMetadata: true
    }
});