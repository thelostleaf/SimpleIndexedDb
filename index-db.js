// indexedDB wrapper by Canyon Digital Solutions 2020
// Create a callback for use with methods, some methods require a starting parameter

// set alternative names for indexedDB api
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

var Database = {
    // internal methods
    notSupportedMessage: "Your browser doesn't support a stable version of IndexedDB.",
    dbName: "dashDb",
    dbStore: "dashStore",
    dbKey: "dashId",
    dbVersion: 1,
    indexName: "value",
    indexValue: "value",
    onupgradeneeded: function (e) {
        let db = e.target.result,
            store = db.createObjectStore(this.dbStore, { keyPath: this.dbKey }),
            index = store.createIndex(this.indexName, this.indexValue, { unique: false });
        // autoincrement optional
        //let db = e.target.result, store = db.createObjectStore(Database.dbStore, { keyPath: Database.dbKey, autoIncrement: true}), index = store.createIndex("value", "value", { unique: false });
        // feedback on db creation
        callback({ val: Database.dbName, message: "Created Database" });
        callback({ val: Database.dbStore, message: "Created Store" });

    },
    onerror: function (e) {
        alert('error: ' + e.target.errorCode);
    },
    ondberror: function (e) {
        alert('error: ' + e.target.errorCode);
    },
    oncomplete: function (e) {
        e.target.db.close();
    },
    addListners: function (request) {
        request.addEventListener('error', this.onerror);
        request.addEventListener('upgradeneeded', this.onupgradeneeded);
    },

    // public use methods
    DeleteDatabase: function (name, callback) {
        window.indexedDB.deleteDatabase(name);
        callback({ val: name, message: "Deleted Database" });
    },

    Add: function (obj, callback) {

        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore, "readwrite");
            tx.addEventListener('complete', Database.oncomplete);
            store = tx.objectStore(Database.dbStore);
            store.put(obj);// change put to add if you want it to fail instead of overwrite
            callback({ val: obj.value, message: "Added Data", db: db, tx: tx, store: store, obj: obj, request: request });
        };
    },

    AddTestData: function (objectCount, callback) {

        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore, "readwrite");
            tx.addEventListener('complete', Database.oncomplete);
            store = tx.objectStore(Database.dbStore);

            for (var i = 0; i < objectCount; i++) {
                var obj = { dashId: i, value: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) }
                store.put(obj);
            }

            callback({ val: obj.value, message: "Added " + objectCount + " Test Data objects.", db: db, tx: tx, store: store, obj: obj, request: request });
        };

    },

    Get: function (key, callback) {

        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore);
            tx.addEventListener('complete', Database.oncomplete);
            store = tx.objectStore(Database.dbStore);
            let g1 = store.get(key);

            g1.onsuccess = function () {
                var returnData;
                if (g1.result) {
                    returnData = { val: g1.result.value, message: "Got Data", db: db, tx: tx, store: store, g1: g1, request: request };
                } else {
                    returnData = { val: key, message: "Data not found.", db: db, tx: tx, store: store, g1: g1, request: request };
                }
                return callback(returnData);
            }

        };
    },

    GetIndex: function (value, callback) {

        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore);
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            index = store.index("value");

            let g1 = index.get(value);

            g1.onsuccess = function () {
                var returnData;
                if (g1.result) {
                    returnData = { val: g1.result.value, message: "Got Data by Index.", db: db, tx: tx, store: store, request: request, index: index, g1: g1 };
                } else {
                    returnData = { val: value, message: "Data not found.", db: db, tx: tx, store: store, request: request, index: index, g1: g1 };
                }
                return callback(returnData);
            }

        };
    },

    GetCount: function (callback) {
        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore);
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            var allInfo = "";
            var count = 0;
            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    count++;
                    cursor.continue();
                } else {
                    callback({ val: count, message: "Total Objects", db: db, tx: tx, store: store, request: request, cursor: cursor });
                }
            };

        };
    },

    GetSize: function (callback) {
        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore);
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            var allInfo = "";
            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    allInfo += ("Name for id " + cursor.key + " is " + cursor.value.value + "<br/>");

                    cursor.continue();

                } else {
                    callback({ val: allInfo.length, message: "Size", db: db, tx: tx, store: store, request: request, cursor: cursor });
                }
            };

        };
    },

    ReadAll: function (callback) {
        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore);
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            var allInfo = "";
            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    allInfo += ("Name for id " + cursor.key + " is " + cursor.value.value + "<br/>");

                    cursor.continue();

                } else {
                    callback({ val: allInfo, message: "All Data Found:<br/>", db: db, tx: tx, store: store, request: request, cursor: cursor });
                }
            };
        };
    },

    Remove: function (key, callback) {
        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore, "readwrite");
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            let g1 = store.delete(key);

            g1.onsuccess = function () {
                callback({ val: key, message: "Deleted Data", db: db, tx: tx, store: store, g1: g1, request: request });
            }
        };

    },

    RemoveAll: function (callback) {
        if (!window.indexedDB) {
            callback({ val: obj.value, message: Database.notSupportedMessage });
        }

        let request = window.indexedDB.open(Database.dbName, Database.dbVersion), db, tx, store, index;
        Database.addListners(request);

        request.onsuccess = function (e) {
            db = request.result;
            db.addEventListener('error', Database.ondberror);
            tx = db.transaction(Database.dbStore, "readwrite");
            tx.addEventListener('complete', Database.oncomplete);

            store = tx.objectStore(Database.dbStore);

            var allInfo = [];
            store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;

                if (cursor) {
                    allInfo.push(cursor.key);
                    Database.Remove(cursor.key, callback)
                    cursor.continue();

                } else {
                    callback({ val: "Done.", message: "All Data Removed", db: db, tx: tx, store: store, request: request, cursor: cursor });
                }

            };

        };
    }

}

function callback(e) {
    divResults.innerHTML += (e.message + " : " + e.val) + "<hr/>";
}