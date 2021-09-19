const fs = require("fs");
const request = require("request");

const jsonFilePath = "./config/imgur_config.json";
checkImgurAccessToken = () => {
    var imgurConfig = JSON.parse(fs.readFileSync(jsonFilePath).toString());
    var currentDate = new Date();
    var previousDate = new Date(imgurConfig.previous_refresh);
    const diffTime = Math.abs(currentDate - previousDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log("Difference in days: " + diffDays);
    if (diffDays >= 28) {
        var refreshAccessTokenRequest = {
            'method': 'POST',
            'url': 'https://api.imgur.com/oauth2/token',
            formData: {
                'refresh_token': imgurConfig.refresh_token,
                'client_id': process.env.IMGUR_CLIENT_ID,
                'client_secret': process.env.IMGUR_CLIENT_SECRET,
                'grant_type': 'refresh_token'
            }
        };
        request(refreshAccessTokenRequest, (error, response) => {
            if (error) {
                throw new Error(error);
            }
            const refreshAccessTokenResponse = JSON.parse(response.body);
            imgurConfig.refresh_token = refreshAccessTokenResponse.refresh_token;
            imgurConfig.access_token = refreshAccessTokenResponse.access_token;
            imgurConfig.previous_refresh = new Date();
            console.log(imgurConfig);
            fs.writeFileSync(jsonFilePath, JSON.stringify(imgurConfig));
        });

    }
};

module.exports = { checkImgurAccessToken };