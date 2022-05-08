const users = [];

const addUser = (info) => {
    const id = info.id
    const name = info.name.trim().split(' ').join('').toLowerCase();
    const room = info.room.trim().split(' ').join('').toLowerCase();

    const existingUser = users.find((user) => user.name === name && user.room === room);
    if(existingUser){
        return {error: "Username is taken"};
    }

    const user = {id, name, room};
    users.push(user);
    return {user};

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index!==-1){
        return users.splice(index,1)[0]; // Returns the spliced user
    }

}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);

}


module.exports = {addUser, getUser, removeUser, getUsersInRoom};

