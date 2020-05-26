const functions = require('firebase-functions');

//Declaración de utilidades de firestore:
var admin = require("firebase-admin");
// var serviceAccount = require('./gram-dev-fd70b-firebase-adminsdk-231eh-ce974a1146.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://gram-dev-fd70b.firebaseio.com"
//   });

var serviceAccount = require('./4avux-dae4159740.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gram-1f446.firebaseio.com"
});


//Utilidad de base de datos:
const firestoreDB = admin.firestore();

exports.obtenerTodosLosPosts = functions.https.onCall(async (data, context) => {
    return (
        new Promise((resolve, reject) => {
            firestoreDB.collection("posts").orderBy("date", "desc").get()
                .then(snapshots => {
                    let postsList = [];
                    snapshots.forEach(snapshot => { postsList.push({ id: snapshot.id, ...snapshot.data() }) });
                    resolve({ "status": "SUCCESS", "posts": postsList });
                })
                .catch(error => { reject({ "status": "FAILED", "error": error.toString() }); });
        })
    );
});

exports.obtenerPosts = functions.https.onCall(async (data, context) => {
    return (
        new Promise((resolve, reject) => {
            firestoreDB.collection("posts").orderBy("date", "desc").offset(data.offset).limit(data.limit).get()
                .then(snapshots => {
                    let postsList = [];
                    snapshots.forEach(snapshot => { postsList.push({ id: snapshot.id, ...snapshot.data() }) });
                    resolve({ "status": "SUCCESS", "posts": postsList });
                })
                .catch(error => { reject({ "status": "FAILED", "error": error.toString() }); });
        })
    );
});

exports.crearPost = functions.https.onCall(async (data, context) => {
    return (
        new Promise((resolve, reject) => {
            firestoreDB.collection("posts").add({ ...data, date: new Date() })
                .then(() => { resolve({ "status": "SUCCESS" }); })
                .catch(error => { reject({ "status": "FAILED", "error": error.toString() }); });
        })
    );
});

exports.funcionDeEjemplo = functions.https.onCall(async (data, context) => {
    return ("Hola " + data.nombre + ". Esta es una función de ejemplo que al parecer funciona 🧐");
});