const path = require('path') // gestion fichiers locaux
const express = require('express') //framework mvc
const nunjucks = require('nunjucks') // templates
const session = require('express-session') // sessions
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator'); // Form validator

const config = require(path.join(__dirname, 'config.js'))

let MONGO_DB;
const DOCKER_DB=true; // Si docker mettre true sinon false

const PlanningSchema = new mongoose.Schema({
  label: { type: String, required: true },
  jour: { type: String },
  nbRepetitions: { type: Number },
  nbSeries: { type: Number },
  userPlanning: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})
const UserSchema = new mongoose.Schema({
  username: { type: String, unique:true, required: true },
  password: { type: String, require: true},
  role : { type: String, require: true, default:'user'}
})

// to fix all deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

const Planning = mongoose.model('Planning', PlanningSchema)
const User = mongoose.model('User',UserSchema)

if ( DOCKER_DB ){
  MONGO_DB = "mongodb://"+config.mongodb.docker.host+":"+config.mongodb.docker.port
}
else{
  MONGO_DB = "mongodb://"+config.mongodb.local.host+":"+config.mongodb.local.port
}

mongoose.connect(MONGO_DB);
mongoose.connection.on('error', err => {
  console.error(err)
})

let app = express()

nunjucks.configure('views', {
  express: app
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let sessionStore = new session.MemoryStore()

app.use(express.static(path.join(__dirname, '/views')))
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: config.express.cookieSecret
}))

app.use((req, res, next) => {
  next()
})

let router = express.Router()

router.route('/')
  .get((req, res) => {
    Planning.find().then(plannings => {
      res.render('planning.njk', { plannings: plannings })
    }).catch(err => {
      console.error(err)
    })
  })

router.route('/register')
  .get((req,res) =>
    res.render('register.njk')
  )
  .post([
    check("inputUsername")
      .notEmpty(),
    check("inputPassword")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Votre mot de passe doit comporter au moins 6 charactères")
  ],
    (req,res)=>{
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      new User({
        username: req.body.inputUsername,
        password: req.body.inputPassword,
      }).save().then(user => {
        console.log('User created');
        res.redirect('/')
      }).catch(err => {
        console.warn(err);
      })
    }
  )

router.route('/add')
  .post([
    // validate the input
    check("inputLabel").notEmpty(),
    check("inputJour")
      .notEmpty()
      .withMessage("Le champs ne doit pas être vide !")
      .isIn(["lundi", "mardi","mercredi","jeudi","vendredi","samedi","dimanche"])
      .withMessage("La valeur n'est pas comprise dans la liste disponible !"),
    check("inputNbRepetitions")
      .isInt({min:1})
      .withMessage("La valeur doit être superieur !"),
    check("inputNbSeries")
      .isInt({min:1})
      .withMessage("La valeur doit être superieur !")
  ],
    
    (req, res) => {

        // check the validation object for errors
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }
      console.log(errors);  

      new Planning({
        label: req.body.inputLabel,
        jour: req.body.inputJour,
        nbRepetitions: req.body.inputNbRepetitions,
        nbSeries: req.body.inputNbSeries
      }).save().then(planning => {
        console.log('Votre tâche a été ajoutée');
        res.redirect('/')
      }).catch(err => {
        console.warn(err);
      })
  })

router.route('/edit/:id')
  .get((req, res) => {
    Planning.findById(req.params.id).then(planning => {
      res.render('edit.njk', { planning: planning })
    }).catch(err => {
      console.error(err)
    })
  })
  .post((req, res) => {
    Planning.findByIdAndUpdate(req.params.id, req.body).then(planning => {
      planning.save().then(planning => {
        console.log('Votre tâche a été modifiée');
        res.redirect('/');
      }).catch(err => {
        console.error(err)
      });
    }).catch(err => {
      console.error(err)
    })
  })

router.route('/delete/all')
  .get((req, res) => {
    Planning.remove({}).then(() => {
      console.log('Toutes les tâches ont étés supprimées');
      res.redirect('/')
    }).catch(err => {
      console.error(err)
    })
  })

router.route('/delete/:id')
  .get((req, res) => {
    Planning.findByIdAndRemove({ _id: req.params.id }).then(() => {
      console.log('Votre tâche est finie');
      res.redirect('/')
    }).catch(err => {
      console.error(err)
    })
  })

app.use('/',router)
app.use('/pub', express.static('public'))
app.use((req, res) => {
  res.redirect('/')
})
if (DOCKER_DB){
  app.listen(config.express.port, config.express.docker.ip, () => {
    console.log('Server listening on ' + config.express.docker.ip + ':' + config.express.port)
  })
}
else{
  app.listen(config.express.port, config.express.local.ip, () => {
    console.log('Server listening on ' + config.express.local.ip + ':' + config.express.port)
  })
}
