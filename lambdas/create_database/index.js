var wrapper = require('cfn-wrapper');
const pg = require('pg');

$worker = {
  init: (context) => {},
  pool: () => {
    return new pg.Pool({
      host: process.env.DBHostname,
      port: process.env.DBPort,
      user: process.env.MasterUser,
      password: process.env.MasterPassword,
      database: 'postgres'
    });
  },
  create: (params) => {
    fail = err => { reply(err.message) };
    $worker.pool().connect().then(client => {
      client.query("CREATE USER " + params.DBUser + " WITH PASSWORD '" + params.DBPassword + "';").then(res => {
        client.query("GRANT " + params.DBUser + " TO " + process.env.MasterUser + ";").then(res => {
          client.query("CREATE DATABASE " + params.DBName + " OWNER " + params.DBUser + ";").then(res => {
            var outputs = {
              "EndpointAddress" : process.env.DBHostname,
              "EndpointPort" : process.env.DBPort,
              "DatabaseName" : params.DBName
            }
            reply(null, process.env.DBHostname+"/"+params.DBName, outputs);
          }).catch(fail);
        }).catch(fail);
      }).catch(fail);
    }).catch(fail);
  },
  update: (params, physicalResourceId) => {
    var outputs = {
      "EndpointAddress" : process.env.DBHostname,
      "EndpointPort" : process.env.DBPort,
      "DatabaseName" : params.DBName
    }
    reply(null, physicalResourceId, outputs);
  },
  delete: (params, physicalResourceId) => {
    if (physicalResourceId != process.env.DBHostname+"/"+params.DBName) {
      reply(null, physicalResourceId, {});
      return;
    }

    fail = err => { reply(err.message) };
    $worker.pool().connect().then(client => {
      client.query('DROP DATABASE ' + params.DBName + ';').then(res => {
        client.query('DROP USER ' + params.DBUser + ';').then(res => {
          reply(null, physicalResourceId, {});
        }).catch(fail);
      }).catch(fail);
    }).catch(fail);
  }
};

exports.handler = wrapper($worker);
