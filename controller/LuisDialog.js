var builder = require('botbuilder');
var food = require('./FavouriteFoods');
// Some sections have been omitted
var restaurant = require('./RestaurantCard');
var nutrition = require('./nutritionCard');

exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d4f47427-9822-4519-a20b-357b5244f6e0?subscription-key=888f92d3200d4bfd860966250cda354a&verbose=true&timezoneOffset=0&q=');
    
        bot.recognizer(recognizer);
    
        bot.dialog('GetCalories', function (session, args) {
            //if (!isAttachment(session)) {
    
                // Pulls out the food entity from the session if it exists
                var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
    
                // Checks if the for entity was found
                if (foodEntity) {
                    session.send('Calculating calories in %s...', foodEntity.entity);
                    nutrition.displayNutritionCards(foodEntity.entity, session);
    
                } else {
                    session.send("No food identified! Please try again");
                }
            //}
        }).triggerAction({
            matches: 'GetCalories'
        });

        bot.dialog('GetFavouriteFood', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username to setup your account.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
                //if (!isAttachment(session)) {
    
                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
    
                    session.send("Retrieving your favourite foods");
                    food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED
                //}
            }
        ]).triggerAction({
            matches: 'GetFavouriteFood'
        });

        bot.dialog('LookForFavourite', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username to setup your account.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
                //if (!isAttachment(session)) {
    
                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
                    // Pulls out the food entity from the session if it exists
                    var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
        
                    // Checks if the food entity was found
                    if (foodEntity) {
                        session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                        food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
        
                    } else {
                        session.send("No food identified!!!");
                    }
                //}
            }
        ]).triggerAction({
            matches: 'LookForFavourite'
        });

        bot.dialog('WantFood', function (session, args) {
            
                    //if (!isAttachment(session)) {
                        // Pulls out the food entity from the session if it exists
                        var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
            
                        // Checks if the for entity was found
                        if (foodEntity) {
                            session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                            restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
                        } else {
                            session.send("No food identified! Please try again");
                        }
                    //}
            
                }).triggerAction({
                    matches: 'WantFood'
                });

        bot.dialog('DeleteFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
        //if (!isAttachment(session)) {
            if (results.response){
                session.conversationData["username"] = result.response;
            }
            session.send("You want to delete one of your favourite foods.");

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Deleting \'%s\'...', foodEntity.entity);
                food.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No food identified! Please try again");
            }
        //}  

        }]).triggerAction({
            matches: 'DeleteFavourite'
        });

         bot.dialog('AddUsername', function (session, args) {
            session.send("Get Username intent found") //To do
         }).triggerAction({
             matches: 'AddUsername'
         });
}