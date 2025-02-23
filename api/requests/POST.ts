import fs from 'fs';
import path from "path";
const urlsJsonFile = "./api/endPoints.json";

const tenantID = process.env.TENANT_ID;
const apiBaseURL = process.env.API_BASE_URL;

const postVoyagesIDOdometerImage = async(request, accessToken: string, voyageID: string, odometerImageCapturePoint, fileName: string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const VOYAGES_URL = urlsJSON["VOYAGES"];
    const ODOMETER_IMAGE_URL = urlsJSON["ODOMETER_IMAGE"];
    const filePath = path.resolve('api/Files', fileName);
    const fileType = "image/png";
    const fileBuffer = fs.readFileSync(filePath);
    
    let QUERY_PARAMS = new URLSearchParams({
        "odometerImageCapturePoint" : odometerImageCapturePoint
    }).toString();

    let URL = `${apiBaseURL}${VOYAGES_URL}/${voyageID}${ODOMETER_IMAGE_URL}?${QUERY_PARAMS}`;

    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
    };
    
    const BODY = {
        file : {
            name: filePath,
            mimeType: fileType,
            buffer: fileBuffer
        }
    };

    const response = await request.post(URL, {
        headers: HEADERS,
        multipart: BODY
    });

    console.log(response.status());
    return response;
}

const postVoyagesIDAbandonRequest = async(request, accessToken: string, voyageID: string, fileName: string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const VOYAGES_URL = urlsJSON["VOYAGES"];
    const ABANDON = urlsJSON["ABANDON"];
    const REQUEST = urlsJSON["REQUEST"];

    let URL = `${apiBaseURL}${VOYAGES_URL}/${voyageID}${ABANDON}${REQUEST}`;
    console.log(URL)

    let HEADERS = {
        "accept": "*/*",
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    
    const BODY = {
        "abandonReason": "Abandon reason test",
        "actualDistance": 100,
        "odometerReadingAbandon": 120923.12,
        "odometerAbandonImage": fileName,
        "waitingTimeInSeconds": 3600,
        "suggestedAddress": "33/A, Park Street, Colombo",
        "longitude": 79.86168422282104,
        "latitude": 6.893162283913919,
        "voyageAdditionalInfo": {
            "Driver_Notes": "Passenger left suddenly."
        }
    };

    const response = await request.post(URL, {
        headers: HEADERS,
        data: BODY
    });

    console.log(response.status());
    return response;
}

module.exports = {
    postVoyagesIDOdometerImage,
    postVoyagesIDAbandonRequest
}

