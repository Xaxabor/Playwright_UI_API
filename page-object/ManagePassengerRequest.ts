import {type Page} from '@playwright/test';
const { Common } = require('./Common');

export class ManagePassengerRequestPage extends Common {
    readonly page: Page

    readonly allRequestsTabLabel = "All Requests";
    readonly newRequestsTabLabel = "New Requests";
    readonly reviewedRequestsTabLabel = "Reviewed Requests";
    
    readonly requestIdColumnLabel = "Request ID";
    readonly employeeIdColumnLabel = "Employee ID";
    readonly employeeIdNameColumnLabel = "Employee Name";
    readonly requestedStartDateColumnLabel = "Requested Start Date";
    readonly requestedStartTimeColumnLabel = "Requested Start Time";
    readonly requestedEndDateColumnLabel = "Requested End Date";
    readonly requestedEndTimeColumnLabel = "Requested End Time";
    readonly locationColumnLabel = "Location";

    readonly approveRequestmodalHeader = "Approve Request";
    
    readonly yesButton = "Yes";
    readonly noButton = "No";
    readonly successfullyDoneToast ="Successfully done!";
    readonly approveIconTooltip = "Approve";
    readonly declineIconTooltip = "Decline";

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

}
