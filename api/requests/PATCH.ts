import fs from 'fs';
const urlsJsonFile = "./api/endPoints.json";

const tenantID = process.env.TENANT_ID;
const apiBaseURL = process.env.API_BASE_URL;

const patchVoyagesIDStart = async(request, accessToken: string, voyageID: string, startDateTime:string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const VOYAGES_URL = urlsJSON["VOYAGES"];
    const START = urlsJSON["START"];

    let URL = `${apiBaseURL}${VOYAGES_URL}/${voyageID}${START}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {    
        "voyageStartDateTime": startDateTime,
        "odometerReadingStart": 10923.12,
        "startLongitude": 79.861472200000000,
        "startLatitude": 6.893118300000000
    };
    console.log(BODY)

    const response = await request.patch(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

const patchVoayagesIDComplete = async(request, accessToken: string, voyageID: string, endDateTIme:string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const VOYAGES_URL = urlsJSON["VOYAGES"];
    const COMPLETE = urlsJSON["COMPLETE"];

    let URL = `${apiBaseURL}${VOYAGES_URL}/${voyageID}${COMPLETE}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {    
        "endTime": endDateTIme,
        "odometerReadingEnd": 120923.12,
        "actualDistance": 120.01,
        "waitingTimeInSeconds": 0,
        "voyageAdditionalInfo": {
          "Driver_Notes": "test driver notes"
        },
        "endLongitude": 79.9472,
        "endLatitude": 6.89806
    };
    console.log(BODY)

    const response = await request.patch(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

const patchTransportRequestIDComplete = async(request, accessToken: string, passengerRequestID: string, startTime:string, longtitude, latitude, version)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const TRANSPORT_REQUESTS = urlsJSON["TRANSPORT_REQUESTS"];
    const COMPLETE = urlsJSON["COMPLETE"];

    let URL = `${apiBaseURL}${TRANSPORT_REQUESTS}/${passengerRequestID}${COMPLETE}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {
        "actualTime": startTime,
        "actualLongitude": longtitude,
        "actualLatitude": latitude,
        "version": version
      };
    console.log(BODY)

    const response = await request.patch(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

const patchTransportRequestsIDPresent = async(request, accessToken: string, passengerRequestID: string, startTime:string, longtitude, latitude, version)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const TRANSPORT_REQUESTS = urlsJSON["TRANSPORT_REQUESTS"];
    const PRESENT = urlsJSON["PRESENT"];

    let URL = `${apiBaseURL}${TRANSPORT_REQUESTS}/${passengerRequestID}${PRESENT}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {
        "actualTime": startTime,
        "actualLongitude": longtitude,
        "actualLatitude": latitude,
        "version": version
      };
    console.log(BODY)

    const response = await request.patch(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

const patchVoyagesIDAbandonCancel = async(request, accessToken: string, voyageID: string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const VOYAGES_URL = urlsJSON["VOYAGES"];
    const ABANDON = urlsJSON["ABANDON"];
    const CANCEL = urlsJSON["CANCEL"];

    let URL = `${apiBaseURL}${VOYAGES_URL}/${voyageID}${ABANDON}${CANCEL}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
    };

    const response = await request.patch(URL, {
        headers: HEADERS,
    });

    console.log(response.status());
    return response;
}
const patchTransportRequestIDAbsent = async(request, accessToken: string, passengerRequestID: string,  startTime:string, longtitude, latitude, version)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const TRANSPORT_REQUESTS = urlsJSON["TRANSPORT_REQUESTS"];
    const ABSENT = urlsJSON["ABSENT"];

    let URL = `${apiBaseURL}${TRANSPORT_REQUESTS}/${passengerRequestID}${ABSENT}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {
        "actualTime": startTime,
        "actualLongitude": longtitude,
        "actualLatitude": latitude,
        "version": version
      };
    console.log(BODY)

    const response = await request.patch(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

module.exports = {
    patchVoyagesIDStart,
    patchVoayagesIDComplete,
    patchTransportRequestIDComplete,
    patchTransportRequestsIDPresent,
    patchVoyagesIDAbandonCancel,
    patchTransportRequestIDAbsent
}