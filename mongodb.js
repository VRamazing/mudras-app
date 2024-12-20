// CRUD Operations

const {MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://localhost:27017";
const dbName = "task-manager";


MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log("Unable to connect to DB");
    }

    const db = client.db(dbName);

    // db.collection("users").insertOne({
    //     name: "Veer",
    //     age: "29"
    // }, (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert user")
    //     }
    //     console.log(result.ops);
    // });

    // db.collection("users").insertMany([
    //     {
    //         name: "Mai",
    //         age: "27"
    //     },
    //     {
    //         name: "Vanisha",
    //         age: "23"
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert users")
    //     }
    //     console.log(result.ops);
    // });

    // db.collection("tasks").insertMany([
    //     {
    //         description: "Buy groceries",
    //         completed: true
    //     },
    //     {
    //         description: "Stich clothes",
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log("Unable to insert tasks")
    //     }
    //     console.log(result.ops);
    // });

    // db.collection("users").findOne({_id: new ObjectID("65b11ebc450f910be4173f20")}, (error, user) => {
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(user);
    // })

    // db.collection("users").find({age: "29"}).toArray((error, users) => {
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(users);
    // })

    // fetching last task
    // db.collection("tasks").findOne({_id: new ObjectID("65b1208f9dd5b8791b8d3103")}, (error, task) => {
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(task);
    // })

    // fetching last task
    // db.collection("tasks").find({completed: false}).toArray((error, tasks) => {
    //     if(error){
    //         return console.log(error);
    //     }
    //     console.log(tasks);
    // })

    //    db.collection("users").updateOne({_id: new ObjectID("65b11e715ede9716248169cf")}, {
    //     $set: {
    //         age: "23"
    //        }
    //    })
    //    .then(result => console.log(result))
    //    .catch(error=> console.log(error));

    
    db.collection("tasks").updateMany({}, {
        $set: {
            completed: true
           }
       })
       .then(result => console.log(result))
       .catch(error=> console.log(error));
})