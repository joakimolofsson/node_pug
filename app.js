const express = require('express'),
routes = require('./routes'),
bodyParser = require('body-parser'),
multer = require('multer'),
cookieParser = require('cookie-parser'),
mongoose = require('mongoose');

const app = express(),
port = 3000,
upload = multer();



//////////



mongoose.connect('mongodb://localhost/beehive', { useNewUrlParser: true });
const personSchema = mongoose.Schema(
    {
        name: String,
        age: Number,
        nationality: String,
    },
    {
        collection: 'people_coll'
    }
);
const Person = mongoose.model('Person', personSchema);



//////////



app.use('/', (req, res, next) => {
    console.log(`New request at ${Date()}`);
    next();
});

app.use('/', routes);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());



//////////



Person.find((err, res) => {
    console.log(`Err: ${err}`);
    console.log(res);
});

/* Person.find({name: "Ayush", age: 20}, (err, res) => {
    console.log(`Err: ${err}`);
    console.log(res);
});

Person.find({nationality: 'Sweden'}, 'name', (err, res) => {
    console.log(`Err: ${err}`);
    console.log(res);
});

Person.findOne({nationality: 'Sweden'}, 'name', (err, res) => {
    console.log(`Err: ${err}`);
    console.log(res);
});

Person.findById('5c33b29c75543324d43a8e28', (err, res) => {
    console.log(`Err: ${err}`);
    console.log(res);
}); */

app.get('/people', (req, res) => {
    Person.find((err, resp) => {
        res.json(resp);
    });
});

/* Person.updateMany({age: 30}, {nationality: "American"}, (err, resp) => {
    console.log(err);
    console.log(resp);
}); */

/* Person.findOneAndUpdate({name: "John Doe"}, {age: 40}, (err, res) => {
    console.log(res);
 });
*/
/*  Person.findByIdAndUpdate("5c361338bba91d1d7c740eb6", { $set: { name: 'Apple' }}, (err, res) => {
      console.log(res);
}); */

app.put('/people_coll/:id', (req, res) => {
    Person.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, resp) => {
        if(err) {
            res.send("Error in updating person with id " + req.params.id);
        }
        res.json('Updated: ' + resp);
    });
});

/* 
    Person.remove({age:20}); 

    Person.findOneAndRemove({name: "Ayush"});

    Person.findByIdAndRemove("507f1f77bcf86cd799439011");
*/

app.delete('/people_coll/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id, (err, resp) => {
        if(err) {
            res.json({message: 'error'});
        }
        res.json({message: 'deleted'});
    });
});



//////////



app.post('/form', (req, res) => {
    console.log(req.body);
    res.send('Form sent');
});

app.post('/personform', (req, res) => {
    console.log(req.body);
    const personInfo = req.body;

    if(!personInfo.name || !personInfo.age || !personInfo.nationality) {
        res.render('personforminfo', {
            message: 'Fill all fields',
            type: 'error'
        });
    } else {
        const newPerson = new Person({
            name: personInfo.name,
            age: personInfo.age,
            nationality: personInfo.nationality,
        });

        newPerson.save((err, Person) => {
            console.log(err);
            if(err) {
                res.render('personforminfo', {
                    message: 'Something went wrong',
                    type: 'error'
                });
            } else {
                res.render('personforminfo', {
                    message: 'New person added',
                    type: 'success',
                    person: personInfo
                });
            }
        });
    }
});



//////////



app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});