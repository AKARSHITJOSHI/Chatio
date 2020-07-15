//keeping the list of users
[{
    id: '123312',
    name: 'Akarshit',
    room: 'The office '
}]

class Users {
    constructor() {
        this.users = [];
    }

    adduser(id, name, room) {
        var user = { id, name, room };
        //pushing it to our user array
        this.users.push(user);
        return user;
    }

    removeuser(id) {
        var user = this.getuser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id); //if id does not match

        }
        return user;
    }

    getuser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }

    getuserlist(room) {
        var users = this.users.filter((user) => {
            return user.room === room;
        });
        var namesArray = users.map((user) => {
            return user.name;
        });
        return namesArray;
    }

}
module.exports = { Users };
/*
//class does not need comma
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getuser() {
        return `You are ${this.age} old`;
    }
}
var p1 = new Person('Akarshit', 22);
console.log(p1.name + p1.age);
var des = p1.getuser();
console.log(des);
*/