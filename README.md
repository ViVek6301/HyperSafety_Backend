# HYPERSAFETY BACKEND
<img src="https://i.imgur.com/Elsibol.png" align="right" height="130px" width="130px" />

The NodeJS Backend of the [HyperSafety Frontend](https://github.com/ritviksharma4/HyperSafety) and the [HyperSafety ML Service](https://github.com/ritviksharma4/HyperSafety_Service), an Employee Management Project in which images and details of Employees can be uploaded, which would then be used to detect whether or not Employees are wearing a mask in the Workplace. The [HyperSafety Frontend](https://github.com/ritviksharma4/HyperSafety) can then be used by the Higher-ups to check which Employees have been caught without a mask.

## INSTALLATION
To run the Backend, first make sure you have NodeJS, NPM and MySQL installed.

Then, clone the Git Repository.

### Run 

    npm install 
    
To install all the necessary dependencies.

### Go to your MySQL Command Line and then create a Database and the following tables

```
CREATE TABLE Employees (
       EmployeeID nvarchar(255) NOT NULL PRIMARY KEY,
       EmployeeName nvarchar(255) NOT NULL,
       Warnings int DEFAULT 0,
       ImageID nvarchar(255) NOT NULL,
       ImageURL nvarchar(255) NOT NULL,
       LastWarned datetime NOT NULL default CURRENT_TIMESTAMP);
```

```      
CREATE TABLE Admins (
      ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
      Email nvarchar(255) NOT NULL,
      Password nvarchar(255) NOT NULL);
```

### Then create a .env file in the root directory of the project and insert the following details by making the necessary changes:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB=YOUR_DB_NAME
JWT_SECRET=YOUR_JWT_SECRET
IMGUR_ACCESS_TOKEN=YOUR_IMGUR_ACCESS_TOKEN
IMGUR_ALBUM_ID=YOUR_ALBUM_ID
IMGUR_CLIENT_ID=YOUR_IMGUR_CLIENT_ID
IMGUR_CLIENT_SECRET=YOUR_IMGUR_CLIENT_SECRET
```

### Then create a config folder in the root directory and create a file called imgur_config.json and insert the following details: 
```
{
    "access_token": "YOUR_IMGUR_ACCESS_TOKEN",
    "refresh_token": "YOUR_IMGUR_REFRESH_TOKEN",
    "previous_refresh": "DATE_TIME_OF_GENERATED_ACCESS_TOKEN"
}
```

### Refer to the [Imgur API Docs](https://apidocs.imgur.com/) to create an account and generate an access token.

## Finally, to start the server, navigate to the root directory of the project and run:
```
npm run HyperSafety_Server
```
