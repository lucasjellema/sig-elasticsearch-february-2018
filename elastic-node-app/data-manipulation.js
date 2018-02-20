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

        client.count({ index: 'parks', type: 'doc' }, function (err, resp, status) {
            console.log("Number of parks: ", resp);
        });
        client.index({
            index: 'parks',
            id: '100',
            type: 'doc',
            body: {
                "area": {
                    "acres": "43740",
                    "square_km": "177"
                },
                "coordinates": {
                    "lat": 38.9,
                    "lon": -77.04
                },
                "date_established_readable": "February 20, 2018",
                "date_established_unix": 604599200,
                "description": "Washington, DC, the U.S. capital, is a compact city on the Potomac River, bordering the states of Maryland and Virginia. It’s defined by imposing neoclassical monuments and buildings – including the iconic ones that house the federal government’s 3 branches: the Capitol, White House and Supreme Court. It's also home to iconic museums and performing-arts venues such as the Kennedy Center.",
                "states": [
                    {
                        "id": "state_dc",
                        "title": "DC"
                    }
                ],
                "title": "Washington DC - The Political Zoo",
                "id": "park_dc",
                "visitors": "23303393",
                "world_heritage_site": false
            }
        }, function (err, resp, status) {
            console.log(resp);
            client.count({ index: 'parks', type: 'doc' }, function (err, resp, status) {
                console.log("Number of parks after insert: ", resp);


                // update all parks in the states specified
                // increase number of visitors by a random number
                client.updateByQuery({
                    index: 'parks',
                    type: 'doc',
                    conflicts:"proceed",                    
                    body: {
                        "script": {
                            "source": "ctx._source.visitors =  ctx._source.visitors +new Random().nextInt(50000)",
                            "lang": "painless"             }
                    }
                }).then(function (result) {
                    console.log("Result " + JSON.stringify(result))
                //uncomment the next lines if you want to clean up after yourself:
                // client.delete({
                //     index: 'parks',
                //     id: '100',
                //     type: 'doc'
                // }, function (err, resp, status) {
                //     console.log(resp);
                // });

                }).catch(function (error) {
                    console.log("Error " + error)
                });




            });

        }
        );
    }//else
})//ping
