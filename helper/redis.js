const redis = require("redis");
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
//create redis connection
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB
});

//create class for redis
let redisConnection = class {
    /**
     * constructor
     */
    constructor() {}
    /**
     * Function is used for set hash data in redis
     */
    hmset(key, value) {
        return new Promise((resolve, reject) => {
            let value_array = [];
            for (let i in value) {
                value_array.push(i);
                if (typeof value[i] == 'object') {
                    value[i] = JSON.stringify(value[i]);
                }
                value_array.push(value[i]);
                client.hmset(key, value_array, function(err, res) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                });
            }
        });
    }
    /**
     * Function is used for get value by field
     */
    hget(key, field) {
        return new Promise((resolve, reject) => {
            client.hget(key, field, function(err, res) {
                let obj = res;
                try {
                    obj = JSON.parse(res);
                } catch (e) {}
                if (err) {
                    reject(err)
                } else {
                    resolve(obj)
                }
            });
        });
    }
    /**
     * Function is used for add stack
     */
    sadd(key, value) {
        return new Promise((resolve, reject) => {
            client.sadd(key, value, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * Function is used for get all the members of the set value stored at key
     */
    smembers(key) {
        return new Promise((resolve, reject) => {
            client.smembers(key, function(err, result) {
                if (err) {
                    reject(err)
                } else {
                    reject(result)
                }
            });
        });
    }
    /**
     * Function is used for removes the specified keys. A key is ignored if it does not exist.
     */
    deleteKeys(pattern) {
        return new Promise((resolve, reject) => {
            client.keys(pattern, function(err, result) {
                if (err) {
                    return reject(err);
                }
                client.del(result, function(err, resultd) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(resultd);
                    }
                });
            });
        });
    }
    /**
     * Function is used for get value of key
     */
    hgetall(key) {
        return new Promise((resolve, reject) => {
            client.hgetall(key, function(err, res) {
                let value = {};
                for (let i in res) {
                    let obj = res[i];
                    try {
                        obj = JSON.parse(res[i]);
                    } catch (e) {}
                    value[i] = obj;
                }
                if (err) {
                    return reject(err);
                } else {
                    return resolve(value);
                }
            });
        });
    }
    /**
     * Function is used for get multiple value of key's
     */
    hgetallKey(keys) {
        return new Promise((resolve, reject) => {
            let client_multi = client.multi();
            for (let i in keys) {
                client_multi.hgetall(keys[i]);
            }
            client_multi.exec(function(err, res) {
                let value = [];
                for (let i in res) {
                    if (res[i] && Object.keys(res[i]).length > 0) {
                        let key = {};
                        for (let j in res[i]) {
                            let obj = res[i][j];
                            try {
                                obj = JSON.parse(res[i][j]);
                            } catch (e) {}
                            key[j] = obj;
                        }
                        value.push(key);
                    }
                }
                if (err) {
                    return reject(err);
                } else {
                    return resolve(value);
                }
            });
        });
    }
    /**
     * Function is used for remover member from member set
     */
    srem(key, value) {
        return new Promise((resolve, reject) => {
            client.srem(key, value, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            });
        });
    }
    /**
     * Function is used for delete hashset
     */
    delhash(key) {
        return new Promise((resolve, reject) => {
            client.del(key, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            });
        });
    }
    /**
     * Function is used for delete field of hash
     */
    hdel(key, field) {
        return new Promise((resolve, reject) => {
            client.hdel(key, field, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            });
        });
    }
    /**
     * Function is used for set expire time for redis key
     */
    expire(key, time) {
        return new Promise((resolve, reject) => {
            client.expire(key, time, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            });
        });
    }
    /**
     * Function is used for get key based on regex
     */
    keys(key) {
        return new Promise((resolve, reject) => {
            client.keys(key, function(err, value) {
                if (err) {
                    reject(err)
                } else {
                    resolve(value)
                }
            });
        });
    }

    sadd(key, value) {
        return new Promise((resolve, reject) => {
            client.sadd(key, value, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * Function is used for increment hash set's field value
     * @param {type} key
     * @param {type} field
     * @param {type} value
     */
    hincr(key, field, value) {
        return new Promise((resolve, reject) => {
            client.hincrby(key, field, value, function(err, value) {
                if (err) {
                    reject(err);
                } else {
                    resolve(value)
                }
            });
        });
    }
    /**
     * This function will return inter set of 2 set
     * @param {String} key1 
     * @param {String} key2 
     */
    sinter(key1, key2) {
        return new Promise((resolve, reject) => {
            client.sinter(key1, key2, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * This function will delete givenkey
     * @param {String} key
     */
    del(key1) {
        return new Promise((resolve, reject) => {
            client.del(key1, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};


module.exports = redisConnection;
