/*  mongodb - основы
*
* Написать консольное приложение которое должно:
*   1) Добавлять список имён в коллекцию;
*   2) Выводить этот список;
*   3) Изменять несколько имён на другие;
*   4) Отображать изменённый список;
*   5) Удалять новые имена из п.3.
*/
let mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/test";
const log = console.log;

// список для добавления
const users = [{name: "Максим", age: 10} , {name: "Виктор", age: 20}, {name: "Пётр", age: 30}, {name: "Леонид", age: 55}];
// список изменяемых имён на другие
const newUsers = [{nameOld: "Максим", nameNew: "МАКСИМ-XXXXX"}, {nameOld: "Пётр", nameNew: "ПЁТР-XXXXX"}];

mongoClient.connect(url, function(err, db) {
    if (err) {
        log('Ошибка подключения к серверу MongDB, error:', err);
    } else {
        log('Соединение установлено, url:', url);
        const col = db.collection('users');
        col.remove();
        
        // 1) добавляем список имён в коллекцию
        col.insertMany(users, (err, result) => {
            if (err) {
                log('Ошибка:', err);
            } else {
                // 2) выводим этот список
                showList(col, '// первоначальный список:');

                // 3) изменить несколько имён на другие
                for (let user of newUsers) {
                    col.updateMany({name: user.nameOld}, {$set: {name:user.nameNew}}, (err, result) => {
                        if (err) log(err);
                    });
                }

                // 4) Отобразить изменённый список;
                showList(col, '// изменённый список:');

                // 5) Удалять новые имена из п.3.
                for (let user of newUsers) {
                    col.deleteMany({name: user.nameNew}, (err, result) => {
                        if (err) log(err);
                    });
                }

                showList(col, '//  Удалили изменённые имена, изменённый список:');
            }
            db.close();
        });
    }
}); 

// отображает список имён из коллекции
function showList(collection, message) {
    collection.find().toArray((err, result) => {
        if (err) {
            log('Ошибка:', err)
        } else {
            if (result.length) {
                log(message);
                log(result);
            }
        }
    });
} 