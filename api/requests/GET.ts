import fs from 'fs';
const urlsJsonFile = "./api/endPoints.json";

const tenantID = process.env.TENANT_ID;
const apiBaseURL = process.env.API_BASE_URL;

const getTransportRequestsPassengersID = async(request, accessToken: string, passengerRequestID: string)=>{
    const urlsJSON = JSON.parse(fs.readFileSync(urlsJsonFile, "utf-8"));
    const TRANSPORT_REQUESTS_PASSENGERS = urlsJSON["TRANSPORT_REQUESTS_PASSENGERS"];

    let URL = `${apiBaseURL}${TRANSPORT_REQUESTS_PASSENGERS}/${passengerRequestID}`;
    console.log(URL)

    let HEADERS = {
        "x-tenant-id" : tenantID,
        "Authorization": `Bearer ${accessToken}`,
        "accept": "application/json"
    };

    const response = await request.get(URL, {
        headers: HEADERS
    });

    console.log(response.status());
    return response;
}

module.exports = {
    getTransportRequestsPassengersID
}

