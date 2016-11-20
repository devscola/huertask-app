# Huertask App #

Aplicación móvil para gestión de huertos urbanos comunitarios

Desarrollada en Ionic2.

Esta aplicación hace uso de [Huertask API](../api/README.md)

Info proyecto: http://parcellesnostres.com/ 

Desarrollado por http://www.devscola.org/


## i18n ##
Este proyecto usa ng2-translate. La información respecto en la [documentación de Ionic2](https://ionicframework.com/docs/v2/resources/ng2-translate/) resulta incompleta. Se recomienda consultar la [documentación del proyecto ng2-translate](https://github.com/ocombe/ng2-translate)

Las traducciones se guardan en el directorio src/assets/i18n en archivos llamados XX.json (donde XX es el código de idioma). Al estar en la carpeta assets se copiarán a la carpeta pública www.

El idioma a usar se configura de la siguiente forma: ```translate.use('es');```

Se puede definir un idioma por defecto en caso de que no se encuentre la cadena en el idioma deseado: ```translate.use('en');```

En ambos casos, translate hace referencia a TranslateService de ng2-translate.
translate.setDefaultLang('es');


Para la diferenciación de mensajes en singular/plural se usa [I18nPluralPipe](https://angular.io/docs/ts/latest/api/common/index/I18nPluralPipe-pipe.html)

### Ejemplos ###
#### Simple ####
Dado el siguiente archivo es.json
```json
{
  "TASKS" : {
    "TITLE" : "Tareas"
  }
}
```
En la plantilla: ```{{ "TASKS.TITLE" | translate }}```

#### Variables ####
Si la cadena usa variables

```json
{
  "TASK" : {
    "PEOPLE_LEFT" : {
      "MSG" : "Faltan {{count}} personas"
    }
  }
}
```
```"TASK.PEOPLE_LEFT.MSG" | translate:{count: task.people_left}```

#### etiquetas HTML ####
Si la cadena usa la propiedad [innerHTML] de Angular2 en el elemento que lo incluya:

```json
{
  "TASK" : {
    "PEOPLE_LEFT" : {
      "MSG" : "Faltan <span>{{count}}<span> personas"
    }
  }
}
```
```<ion-col [innerHTML]='"TASK.PEOPLE_LEFT.MSG" | translate:{count: task.people_left}'>```


## Coding Standards ##
Este proyecto usa [editorconfig](http://editorconfig.org) para definir y mantener la consistencia del estilo de código.
