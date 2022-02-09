const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema } = require('graphql');
const axios = require('axios');

// Launch Type

const userList = [
    { name: "张三", id: 1, age: 18 },
    { name: "李四", id: 2, age: 19 },
    { name: "王五", id: 3, age: 20 },
]

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    })
});

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: { type: RocketType },
    })
});

// Rocket Type

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // launches
        launches: {
            type: new GraphQLList(LaunchType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/launches').then(res => res.data);
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`).then(res => res.data);
            }
        },
        
        // rockets
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parent, args) {
                return axios.get('https://api.spacexdata.com/v3/rockets').then(res => res.data);
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`).then(res => res.data);
            }
        },
        userList: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return userList;
            }
        },
        getUserById: {
            type: UserType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return userList.find(user => user.id === args.id);
            }
        }
    }
});

const RootMutations = new GraphQLObjectType({
    name: 'RootMutations',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const id = userList.length + 1;
                userList.push({ name: args.name, id, age: args.age });
                return {
                    name: args.name,
                    age: args.age,
                    id
                }
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const idx = userList.findIndex(user => user.id === args.id);
                if (idx === -1) {
                    throw new Error('User not found');
                }
                return userList[idx];
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const idx = userList.findIndex(user => user.id === args.id);
                if (idx > -1) {
                    userList[idx] = {
                        name: args.name,
                        age: args.age,
                        id: args.id
                    }
                }
                return userList[idx];
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutations
});
