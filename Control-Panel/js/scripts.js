
// restarts the raspberryu pi server device
function restart()
{
    alert("TODO: run a script on the device in order to restart the device and the HTTP server");
    
}

function openSettings()
{
    alert("TODO: open a settings panel that allows the addition, removal, and re-arrangement of tiles");
}

function tileSettings()
{
    alert("TODO: open tile specific settings");
    // find the parent element and create a drop down box in the area of the respective tile
}

// restarts the raspberryu pi server device
function lock()
{
    
    
}

// toggles the lock state
function toggleLock()
{
    

    // perform the corret controlling function
    if(document.getElementById("door-state-button").innerHTML == "Unlock")
    {
        var request = new XMLHttpRequest();
        if("withCredentials" in request)
        {
            request.open("GET", "http://10.1.28.72/5/off/", true);
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("unlock command received!");
                }
            };
            request.send();
        }
        else
        {
            alert("Error Running X-Site Request");
        }
        document.getElementById("lock-status-box").innerHTML = "<div><p id=\"lock-status-box-text\" style=\"color: black\"><b>Unlocked<b/></p></div>"
        document.getElementById("lock-status-box").style = "background-color: rgb(152,251,152)"
        document.getElementById("door-state-button").innerHTML = "Lock";
    } else {
        var request = new XMLHttpRequest();
        if("withCredentials" in request)
        {
            request.open("GET", "http://10.1.28.72/5/on/", true);
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("lock command received!");
                }
            };
            request.send();
        }
        else
        {
            alert("Error Running X-Site Request");
        }
        document.getElementById("lock-status-box").innerHTML = "<div><p id=\"lock-status-box-text\" style=\"color: black\"><b>Locked<b/></p></div>";
        document.getElementById("lock-status-box").style = "background-color: rgb(238,99,99)"
        document.getElementById("door-state-button").innerHTML = "Unlock";
    }   
}

// method to receive server stats
function getAndSetServerInfo()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState = 4 && this.status == 200)
        {
                var response = this.responseText.split("\n");
                if (response.length = 3)
                {
                    document.getElementById("server-status-box").innerHTML = "<b>Last Login: " + response[0] + "</b><br/><b>IP: " + response[1] + "</b><br/><b>Latency: " + response[2] + " m/s</b><br/>";
                }   
        }
    };
    xhttp.open("GET", "media/data/server_status.txt", true);
    xhttp.send();
}

// method to receive face detection information
function getAndSetFaceDetectInfo()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState = 4 && this.status == 200)
        {
                var response = this.responseText.split("\n");
                if (response.length > 0)
                {
                    // TODO for loop to create the module content based on the length of the response object
                    document.getElementById("face-detect-status-box").innerHTML = response[0] + "<br/>" + response[1] + "<br/>" + response[2] + "<br/>" + response[3] + "<br/>" + response[4]+ "<br/>" + response[5];
                }   
        }
    };
    xhttp.open("GET", "media/data/face.log", true);
    xhttp.send();
}

function checkSensorStatuses()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState = 4 && this.status == 200)
        {
                var response = this.responseText.split("\n"); // creates array [lock status, room status, server status]

                // checking the lock status
                if (response[0] == "disconnected")
                {
                    document.getElementById("lock-status-dot").style.backgroundColor = "red";
                } 
                else if (response[0] = "connected")
                {
                    document.getElementById("lock-status-dot").style.backgroundColor = "green";
                }
                else 
                {
                    alert("Error reading lock status file");
                    document.getElementById("lock-status-dot").style.backgroundColor = "grey"; 
                }  
                
                // checking the room status
                if (response[1] == "disconnected")
                {
                    document.getElementById("room-status-dot").style.backgroundColor = "red";
                } 
                else if (response[1] = "connected")
                {
                    document.getElementById("room-status-dot").style.backgroundColor = "green";
                }
                else 
                {
                    alert("Error reading lock status file");
                    document.getElementById("room-status-dot").style.backgroundColor = "grey"; 
                } 

                // checking the server status
                if (response[2] == "disconnected")
                {
                    document.getElementById("server-status-dot").style.backgroundColor = "red";
                } 
                else if (response[2] = "connected")
                {
                    document.getElementById("server-status-dot").style.backgroundColor = "green";
                }
                else 
                {
                    alert("Error reading lock status file");
                    document.getElementById("server-status-dot").style.backgroundColor = "grey"; 
                } 

                if (response[3] == "disconnected")
                {
                    document.getElementById("face-detect-status-dot").style.backgroundColor = "red";
                } 
                else if (response[3] = "connected")
                {
                    document.getElementById("face-detect-status-dot").style.backgroundColor = "green";
                }
                else 
                {
                    alert("Error reading lock status file");
                    document.getElementById("lock-status-dot").style.backgroundColor = "grey"; 
                }  
        }
    };
    xhttp.open("GET", "media/data/sensor_statuses.txt", true);
    xhttp.send();
}

function checkStatuses()
{
    checkSensorStatuses();
    getAndSetServerInfo();
    getAndSetFaceDetectInfo();
}

setInterval(checkStatuses, 1000); // checking the lock's status every second