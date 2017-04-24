var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var expressValidator = require('express-validator')
var mongojs = require('mongojs')
//var db = mongojs('foods', ['foods'])
var ObjectId = mongojs.ObjectId
// mongodb://<dbuser>:<dbpassword>@ds111441.mlab.com:11441/scripting_lab_11_database
var db = mongojs(process.env.MONGODB_URI, ['foods'])
var app = express()

app.set('port', (process.env.PORT || 8080))

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null
    next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// SetUp Routes
app.get('/', function (req, res) {
    db.foods.find(function (err, docs) {
	    res.render('index', {
        title: 'Food',
        food: docs
        })
    })
})

app.post('/foods/add', function (req, res) {

    req.checkBody('food_name', 'Food Name is Required').notEmpty()
    req.checkBody('description', 'Description is Required').notEmpty()
    req.checkBody('category', 'Category is Required').notEmpty()
    req.checkBody('serving', 'Serving Size is Required').notEmpty()
    req.checkBody('units', 'Unit for Serving Size is Required').notEmpty()
    req.checkBody('calories', 'Calroies is Required').notEmpty()
    req.checkBody('meal', 'Meal is Required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        db.foods.find(function (err, docs) {
            res.render('index', {
                title: 'Food',
                food: docs,
                errors: errors
            })
        })
    } else {
        var food = {
            food_name: req.body.food_name,
            description: req.body.description,
            category: req.body.category,
            serving: req.body.serving,
            units: req.body.units,
            calories: req.body.calories,
            meal: req.body.meal
        }
        
        // insert the new food into the database
        db.foods.insert(food, function (err, result) {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})

app.delete('/foods/delete/:id', function(req, res) {
    db.foods.remove( { _id: ObjectId(req.params.id) }, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/foods/update/:id', function (req, res) {
    db.foods.find( { _id: ObjectId(req.params.id) }, function (err, docs) {
	    res.render('update-food', {
        food: docs[0]
        })
    })
})

app.put('/foods/update', function (req, res) {
    var food = {
        "food_name": req.body.food_name,
        "description": req.body.description,
        "category": req.body.category,
        "serving": req.body.serving,
        "units": req.body.units,
        "calories": req.body.calories,
        "meal": req.body.meal
    }
    db.foods.save(food, function (err, result) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port') + '. . .')
})