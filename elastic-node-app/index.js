var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'http://192.168.99.100:9200',
  });

//   var client = new elasticsearch.Client({
//     apiVersion: '2.1',
//     host: 'http://localhost:9200',
//     createNodeAgent(connection, config) {
//       return new AgentKeepAlive(connection.makeAgentConfig(config));
//     }
//   });

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
        client.search({
            index: 'parks',
            type: 'doc',
            body: {
                query: {
                    match: {
                        "visitors": 2365110
                    }
                }
            }
        }).then(function(resp) {
            console.log(JSON.stringify(resp));
        }, function(err) {
            console.trace(err.message);
        });


    }
});