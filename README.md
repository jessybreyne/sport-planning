# Sport planning

## Infos

- Pour le front Bootstrap 4 a été utilisé (CDN).
- On peut ajouter une activité sportive, la modifier et la supprimer.
- Les activités ont un nom, un jour de la semaine, un nombre de répétition et un nombre de série.
- Le planning des activités sportives peut être exporté en CSV.
- Un bouton est disponible pour supprimer tout le planning d'un coup (avec une confirmation avant).
- Un tri des activités est disponible.

## Installation

```shell
yarn install
```

## Lancement

Dans un autre terminal, lancez mongo:

```shell
mongo
```

Dans le dossier de votre app, lancez-là:

```shell
yarn start
```

## Paquets utilisés

### Node

- body-parser
- express
- express-flash
- express-session
- json2csv
- mongoose
- nunjucks

### Front

- Bootstrap 4
- sorttablejs
