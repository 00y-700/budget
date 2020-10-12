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
function saved(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
              method: "POST",
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
              });
          }
        };
      }
    


