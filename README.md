# Todolist

## Infos

- Pour le front Bootstrap 4 a été utilisé (CDN).
- On peut ajouter une taĉhe, la modifier et la supprimer.
- Les tâches ont un nom, une date de début, une date de fin et une priorité.
- On marquer les tâches comme 'effectuées' et les modifier (les boutons à droite du tableau).
- Les tâches peuvent êtres exportées en CSV.
- Un bouton est disponible pour supprimer toutes les tâches d'un coup (avec une confirmation avant).
- Un tri des tâches est disponible.
- Si une tâche à une priorité supérieure à 8, alors la ligne sera mise en avant.

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
