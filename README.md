# gulp-flbuild
Gulp плагин для сборки проектов написанных на Adobe Flash.

## Инсталляция
Via npm:

```bash
$ npm install [-g] gulp-flbuild
```
## Пример использования
Для сборки в функцию надо передать объект конфигурации, например:
```javascript
{
    PROJECT_HOME:'./',
    sourceDirectory:'$PROJECT_HOME/src',
    libraryDirectory:[
        '$PROJECT_HOME/libs/'
    ],
    args:[
        '-static-link-runtime-shared-libraries=true',
        '-debug='+param_debug,
        '-define=CONFIG::debug,'+param_debug,
        '-link-report ./out/module.xml',
        '-size-report ./out/module.size.xml'
    ],
    output:'$PROJECT_HOME/out/module.swf'
}
```
- PROJECT_HOME - параметр путь до папки проект, обязательный
- FLEX_HOME - путь до папки с дистрибутивом  Adobe Flex , обязательный
- sourceDirectory - путь до папки с исходниками проекта
- libraryDirectory - массив путей до папок с библиотеками .swc
- args - дополнительные параметры компиляции
- output - путь куда сохранится собранный файл

```javascript
var gulp    = require('gulp');
var flbuild = require('gulp-flbuild');

gulp.task('player-swf-prodaction',function (){
    var param_debug = debug;
    var swf_conf = {
        PROJECT_HOME:'./',
        sourceDirectory:'$PROJECT_HOME/src',
        libraryDirectory:[
            '$PROJECT_HOME/libs/'
        ],
        args:[
            '-static-link-runtime-shared-libraries=true',
            '-debug='+param_debug,
            '-define=CONFIG::debug,'+param_debug,
            '-link-report ./out/module.xml',
            '-size-report ./out/module.size.xml'
        ],
        output:'$PROJECT_HOME/out/module.swf'
    }

    return gulp.src('./project/src/Main.as')
        .pipe(flbuild(swf_conf));
});
```

В gulp.src() передается путь до главного класса проекта или .mxml


