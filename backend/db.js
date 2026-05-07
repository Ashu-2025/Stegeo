const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "database.json");

const initDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], activity: [] }, null, 2));
    }
};

const readDB = () => {
    initDB();
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    getUsers: () => readDB().users,
    addUser: (user) => {
        const db = readDB();
        db.users.push(user);
        writeDB(db);
    },
    findUser: (predicate) => readDB().users.find(predicate),
    
    // NEW: Delete User
    deleteUser: (username) => {
        const db = readDB();
        db.users = db.users.filter(u => u.username !== username);
        writeDB(db);
    },

    // NEW: Update Role
    updateUserRole: (username, newRole) => {
        const db = readDB();
        const user = db.users.find(u => u.username === username);
        if (user) user.role = newRole;
        writeDB(db);
    },

    countUsers: () => readDB().users.length,
    addActivity: (activity) => {
        const db = readDB();
        db.activity.unshift({ ...activity, timestamp: new Date() });
        writeDB(db);
    },
    getRecentActivity: (limit, filter = () => true) => {
        return readDB().activity.filter(filter).slice(0, limit);
    },
    countActivity: (filter) => {
        return readDB().activity.filter(filter).length;
    }
};
