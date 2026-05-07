const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

const initDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], activity: [] }, null, 2));
    }
};

const getData = () => {
    initDB();
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    getUsers: () => getData().users,
    getActivity: () => getData().activity,
    addUser: (user) => {
        const data = getData();
        data.users.push(user);
        saveData(data);
    },
    addActivity: (activity) => {
        const data = getData();
        data.activity.push({ ...activity, timestamp: new Date() });
        saveData(data);
    },
    findUser: (predicate) => getData().users.find(predicate),
    countUsers: () => getData().users.length,
    countActivity: (filter) => getData().activity.filter(filter).length,
    getRecentActivity: (limit = 10, filter = null) => {
        let act = getData().activity;
        if (filter) act = act.filter(filter);
        return act.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
    }
};
