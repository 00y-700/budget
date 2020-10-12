let db;
      
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
     const db = event.target.result;
     db.createObjectStore("pending", { autoIncrement: true });
};
request.onerror = function(event) {
     console.log("error");
};
request.onsuccess = function(event) {
     db = event.target.result;

     if (navigator.onLine) {
      checkDatabase();
     }
     db.onerror = function(e) {
        console.log("error");
     };
      
};
function saveRecord(record) {
    console.log(record);
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}


window.addEventListener("online", checkDatabase);

