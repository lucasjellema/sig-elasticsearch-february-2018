var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'http://192.168.99.100:9200',
});

client.ping({
    requestTimeout: 30000,
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Connection to Elastic Search is established');
        client.search(queryParksWithinVisitorRangeEstablishedInRangeInStateWithFirstLetterM
        ).then(function (resp) {
            console.log("Parks with visitors in specified range and in State with first letter M");
            var hits = resp.hits.hits;
            hits.forEach(function (hit) {
                console.log(`${hit._source.title} (${hit._score}) in ${hit._source.states[0].title}, visitors: ${hit._source.visitors}, date established: ${hit._source.date_established_readable}`)
            })
        }, function (err) {
            console.trace(err.message);
        });

        client.search(queryParksWithin1000kmFromSanFranciscoWithForestOrTrees
        ).then(function (resp) {
            console.log("Parks Within 1000km From San Francisco With Forest Or Trees");
            var hits = resp.hits.hits;
            hits.forEach(function (hit) {
                console.log(`${hit._source.title} (${hit._score}) : ${hit._source.description}`)
            })
        }, function (err) {
            console.trace(err.message);
        });

        // get a number of documents by id
        // TODO: include some fields! 
        client.mget({
            "index": "parks",
            "type": "doc",
            "stored_fields": ["title"] // this does not work!
            , "body": {
                "ids": [1, 2, 3, 12, 32, 45, 55]
            }
        }, function (error, response) {
            console.log(response);
            var doc = response.docs[0];
            console.log(doc);

        });
    }
});

var queryParksWithinVisitorRangeEstablishedInRangeInStateWithFirstLetterM = {
    index: 'parks',
    type: 'doc',
    body: {
        "query": {
            "bool": {
                "filter": {
                    "query_string": { "query": "M*", "fields": ["states.title"] }
                },
                "must": [{
                    "range":
                        {
                            "date_established_readable": {
                                "gte": "1900",
                                "lt": "1940",
                                "format": "yyyy"
                            }
                        }
                }
                    , {
                    "range": {
                        "visitors": {
                            "gte": 2000000,
                            "lt": 3000000
                        }
                    }
                }]


            }
        }
    }
}
var queryParksWithin1000kmFromSanFranciscoWithForestOrTrees = {
    index: 'parks',
    type: 'doc',
    body: {
        "query": {
            "bool": {
                "should": {
                    "match": { "description": "forest trees" }
                },
                "filter": {
                    "geo_distance": {
                        "distance": "1000km",
                        "coordinates": {
                            "lat": 37.7,
                            "lon": -122.4
                        }
                    }
                }
            }
        }
    }
};