import {test, expect, type Page} from '@playwright/test';
const { Common } = require('./common');
const { Generate } = require('../Utils/Generate');
const { DateTimeHelper } = require('../Utils/DateTimeHelper');
const fs = require("fs");


export class PassengerRequestPage extends Common {
    readonly page: Page
    readonly passengerRequestAddIconLocator = "//i[@data-pr-tooltip='Add Passenger Request']";

    readonly costCenterDropdownLabel = "Cost Centers*";
    readonly pickupLocationDropdownLabel = "Pickup Location*";
    readonly dropLocationDropdownLabel = "Drop Location*";

    readonly nearestCityPickupTextFieldLabel = "Nearest City - Pickup*";
    readonly nearestCityDropTextFieldLabel = "Nearest City - Drop*";
    readonly reasonTextareaLabel = "Reason*";

    readonly passengerRequestStartDate = "Requested Start Date";
    readonly passengerRequestEndDate = "Requested End Date";
    readonly passengerRequestStartTime = "Requested Start Time";
    readonly passengerRequestEndTime = "Requested End Time";
    readonly fromDate = "From:";
    readonly toDate = "To:";

    readonly autoApproveThisRequestUponSavingCheckbox = "Auto-approve this request upon saving";

    readonly saveButton = "Save";
    readonly resetButton = "Reset";
    readonly filterButton = "Filter";
    readonly applyNowButton = "Apply Now";

    readonly filterModalHeader = "Filter";

    readonly passengerRequestAddedSuccessfullyToast ="Passenger Request added successfully!";

    readonly requestIdColumnLabel = "Request ID";
    readonly requestedStartDateTimeColumnLabel = "Requested Start Date & Time";
    readonly requestedEndDateTimeColumnLabel = "Requested End Date & Time";
    readonly completedDateTimeColumnLabel = "Completed Date & Time";
    readonly locationColumnLabel = "Location";
    readonly statusColumnLabel = "Status";
    readonly nearestCityPickupColumnLabel = "Nearest City - Pickup";
    readonly nearestCityDropColumnLabel = "Nearest City - Drop";

    readonly testdataJSONLocation1 = "./testdata/PassengerRequest/1.json";
    readonly testdataJSONLocation2 = "./testdata/PassengerRequest/2.json";
    readonly testdataJSONLocation3 = "./testdata/PassengerRequest/3.json";
    readonly testdataJSONLocation4 = "./testdata/PassengerRequest/4.json";

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    createAndSavePassengerRequestData(jsonFile){
        const generate = new Generate();
        const dateTimeHelper = new DateTimeHelper();
        const testdate = dateTimeHelper.getFutureDateAfterAddingXdays(generate.getRandomNumber(1, 60));
        const data ={
            [this.costCenterDropdownLabel] : "Manual Testing",
            [this.pickupLocationDropdownLabel] : "INIVOS WAREHOUSEE",
            [this.dropLocationDropdownLabel] : "LOCAAAAAAAAAATION",
            [this.nearestCityPickupTextFieldLabel] : generate.generateRandomString(),
            [this.nearestCityDropTextFieldLabel] : generate.generateRandomString(),
            [this.passengerRequestStartDate] : testdate,
            [this.passengerRequestEndDate] : testdate,
            [this.passengerRequestStartTime] : generate.getRandomNumber(10,11)+":"+generate.getRandomNumber(0,5)+"0"+" AM",
            [this.passengerRequestEndTime] : "0"+generate.getRandomNumber(1,5)+":"+generate.getRandomNumber(0,5)+"0"+" PM",
            [this.reasonTextareaLabel] : generate.generateRandomString(10),
        }

        const formattedData = JSON.stringify(data);
        fs.writeFileSync(jsonFile, formattedData);
    }

    async clickOnModalButtonInPassengerRequestPage(modalHeader:string, modalButton: string){
        await this.page.locator(`//h3[normalize-space(text())='${modalHeader}']/../..//button[normalize-space(text())='${modalButton}']`).click();
    }
}
