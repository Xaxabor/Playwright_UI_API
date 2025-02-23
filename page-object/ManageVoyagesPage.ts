import {type Page} from '@playwright/test';
const { Common } = require('./common');

export class ManageVoyagesPage extends Common {
    readonly page: Page

    readonly allocateVoyageAddIconLocator = '//i[@data-pr-tooltip="Allocate Voyage"]';

    readonly allTabLabel = 'All';
    readonly scheduledTabLabel = 'Scheduled';
    readonly onGoingTabLabel = 'On-going';
    readonly completedTabLabel = 'Completed';
    readonly abandonedTabLabel = 'Abandoned';
    readonly deletedTabLabel = 'Deleted';

    readonly voyageIdColumnLabel = "Voyage ID";
    readonly scheduledDateTimeColumnLabel = "Scheduled Date & Time";
    readonly vehicleNumberColumnLabel = "Vehicle Number";
    readonly routeColumnLabel = "Route";
    readonly requestCountColumnLabel = "Request Count";
    readonly statusColumnLabel = "Status";
    readonly licensePlateNumberColumnLabel = "License Plate Number";
    readonly dateColumnLabel = "Date";
    readonly requestedStartDateColumnLabel = "Requested Start Date";
    readonly requestedEndDateColumnLabel = "Requested End Date";
    readonly requestedStartTimeColumnLabel = "Requested Start Time";
    readonly requestedEndTimeColumnLabel = "Requested End Time";
    readonly locationColumnLabel = "Location";
    readonly requestTypeColumnLabel = "Request Type";
    readonly nearestCityPickupColumnLabel = "Nearest City - Pickup";
    readonly nearestCityDropColumnLabel = "Nearest City - Drop";
    readonly actionsColumnLabel = "Actions";
    readonly nameColumnLabel = "Name";

    readonly dateTimeFromField = "Date/Time - From :";
    readonly dateTimeToField = "Date/Time - To :";
    readonly licensePlateNumberplaceholder="License Plate Number";
    readonly voyageStartDateField = "Voyage Start Date:";
    readonly voyageStartTimeField = "Voyage Start Time:";

    readonly allocateButton = "Allocate";
    readonly proceedButton = "Proceed";
    readonly availableButton = "Available";
    readonly yesButton = "Yes";
    readonly noButton = "No";
    readonly scheduleManuallyButton = "Schedule Manually";
    readonly viewMapButton = "View Map";
    readonly abandonCurrentAndCreateNewVoyageButton = "Abandon Current and Create New Voyage";

    readonly chooseVoyageSchedulingMethodHeader = "Choose Voyage Scheduling Method";
    readonly allocateHeader = "Allocate Request";
    readonly abandonVoyageHeader = "Abandon Voyage";

    readonly abandonVaoyageAgreementCheckboxLabel = "I understand and agree that by abandoning this voyage, the decision is final and cannot be reversed."

    readonly successfullyDoneToast ='Successfully Done!';
    readonly voyageAddedSuccessfullyToast ="Voyage added successfully!";
    readonly successfullyAbandonedTheAbandonedRequestToast ="Successfully Abandoned the abandoned request";

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    /**
     * This will return specific column vlaue from row based on the rowIdentifier
     * @param columnName 
     * @param rowIdentifier 
     * @returns 
     */
    async getCurrentSelectionGridDataFromSpecificRow(columnName: string, rowIdentifier: string){
        const gridHeaders = await this.page.locator("//div[text()='Current Selection']/..//following-sibling::div//table//th").allTextContents();
        const indexOfColumnHeader = gridHeaders.indexOf(columnName)+1;
        return await this.page.locator(`//div[text()='Current Selection']/..//following-sibling::div//table//td[normalize-space(text())='${rowIdentifier}']/..//td[${indexOfColumnHeader}]`).innerText();
    }

    /**
     * This will click on specific grid button based on the rowIdentifier
     * @param rowIdentifier 
     */
    async clickOnAbandonIcon(rowIdentifier: string){
        await this.page.locator(`//td[normalize-space(text())='${rowIdentifier}']/..//*[@alt='Abandon Voyage']`).click();
    }
}