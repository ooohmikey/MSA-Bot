var request = require('request');

exports.getFavouriteFood = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function(err,res,body){
        if (err) {
            console.log(err);
        }
        else {
            callback(body, session, username);
        }
    });
};

exports.postFavouriteFood = function sendData(url, username, favouriteFood){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "favouriteFood" : favouriteFood
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteFavouriteFood = function deleteData(url,session, username ,favouriteFood, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if ( !err && res.statusCode === 200) {
            console.log(body);
            callback(body, session, username, favouriteFood);
        }
        else {
            console.log(err);
            console.log(res);
        }
    })

};

exports.getYelpData = function getData(url,bearer,session, callback){
    
        request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
            if(err){
                console.log(err);
            }
            else {
                callback(body,session);
            }
        });
    };

exports.getNutritionData = function getData(url, session, foodName, callback){
    
        request.get(url, function(err,res,body){
            if(err){
                console.log(err);
            }
            else {
                callback(body, foodName, session);
            }
        });
    };

exports.postQnAResults = function getData(url, session, question, callback){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': '69cb65e425224113b3f9765b5f743f5c',
            'Content-Type':'application/json'
        },
        json: {
            "question" : question
        }
        };
    
        request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body, session, question);
        }
        else{
            console.log(error);
        }
        });
    };