import {test, expect, type Page} from '@playwright/test';
const { DateTimeHelper } = require('../Utils/DateTimeHelper');
import * as fs from "fs";
 
exports.Common =  class Common {

    readonly page: Page;
    readonly menuExpandButtonLocator = "//button[@data-pc-section='root']/span[@data-pc-section='icon']";
    readonly menuCloseButtonLocator = "//button[@data-pc-section='closebutton']";
    readonly userMenuButton = "Users";
    readonly departmentsMenuButton = "Departments";
    readonly rolesMenuButton = "Roles";
    readonly costCentersMenuButton = "Cost Centers";
    readonly employeesMenuButton = "Employees";
    readonly uploadEmployeesButton = "Upload Employees";
    readonly ownersMenuButton = "Owners";
    readonly vehiclesMenuButton = "Vehicles";
    readonly manageLocationsMenuButton = "Manage Locations";
    readonly passengerRequestsMenuButton = "Passenger Requests";
    readonly deliveryRequestsMenuButton = "Delivery Requests";
    readonly subordinateOnbehalfPassengerRequestsMenuButton = "Subordinate / On-behalf Passenger Requests";
    readonly subordinateOnbehalfDeliveryRequestsMenuButton = "Subordinate / On-behalf Delivery Requests";
    readonly managePassengerRequestsMenuButton = "Manage Passenger Requests";
    readonly manageDeliveryRequestsMenuButton = "Manage Delivery Requests";
    readonly manageVoyagesMenuButton = "Manage Voyages";
    readonly audittrailMenuButton = "Audit Trail";
    readonly toastMessageLocator = "//div[@class='Toastify__toast-body']//div";
    readonly pageLoaderBigSpinnerLocator = "//div[@data-pc-section='spinner']";
    readonly pageLoaderSmallSpinnerLocator = "//div[@data-pc-section='loadingoverlay']//*[local-name()='svg'][@aria-hidden='true' and @data-pc-section='loadingicon']";

    constructor(page: Page) {
        this.page = page;
    }

    /**
    * This method is used to expand the side menu
    */
    async expandMenu() {
        await this.page.click(this.menuExpandButtonLocator);
    }

    /**
    * This method is used to colse the side menu
    */
    async closeMenu() {
        await this.page.click(this.menuCloseButtonLocator);
    }

    /**
    * This method is used to click on the menu button
    * @param menuButton - Menu Button
    * 
    * Example: clickOnMenu('Users')
    * 
    * This will click on the menu button 'Users'
    */
    async clickOnMenu(menuButton: string) {
        await this.expandMenu();
        await this.page.waitForLoadState('load');
        await this.page.locator(`//span[text()="${menuButton}"]`).click();
        await this.waitForPageLoaderBigSpinnerToDisappear();
    }

    /**
    * This method is used to click on the add icon
    * @param buttonLoc - Locator of the add icon
    * 
    * Example: clickOnAddIcon('//i[@data-pr-tooltip="Add Passenger Request"]')
    * 
    * This will click on the add icon with locator '//i[@data-pr-tooltip="Add Passenger Request"]'
    */
    async clickOnAddIcon(buttonLoc: string) {
        await this.page.locator(buttonLoc).click({timeout: 90000});
        await this.page.waitForLoadState('load');
    }

    /**
    * This method is used to select the value from the dropdown
    * @param dropDownLabel - Dropdown Label
    * @param value - Value to select from the dropdown
    * 
    * Example: selectFromDropdown('Cost Centers*', 'Inivos')
    * 
    * This will select the value 'Inivos' from the dropdown with label 'Cost Centers*'
    */ 
    async selectFromDropdown(dropDownLabel: string, value: string) {
        const dropdownOpenerLoc = `//label[normalize-space(text())="${dropDownLabel}"]/..//div[@aria-hidden="true" or @role='button']`
        await this.page.locator(dropdownOpenerLoc).click();
        const dropdownOptionLoc = `//*[local-name()="div" or local-name()="li"][normalize-space(text())="${value}"]`
        await this.page.locator(dropdownOptionLoc).click();
    }

    /**
    * This method is used to insert and select the value from the dropdown
    * @param fiedlLabel - Dropdown Label
    * @param value - Value to select from the dropdown
    * 
    * Example: setValueAndSelectIntoField('Pickup Location*', 'Inivos')
    * 
    * This will select the value 'Inivos' from the dropdown with label 'Pickup Location*'
    */ 
    async setValueAndSelectIntoField(fiedlLabel: string, value: string) {
        const dropdownOpenerLoc = `//label[normalize-space(text())="${fiedlLabel}"]/..//div[contains(@class, "indicatorContainer") or @role="button"]`
        await this.page.locator(dropdownOpenerLoc).click();
        const inputFieldLoc = `//label[normalize-space(text())="${fiedlLabel}"]/..//input`
        await this.page.locator(inputFieldLoc).fill(value);
        const dropdownOptionLoc = `//*[local-name()="div" or local-name()="li"][normalize-space(text())="${value}"]`
        await this.page.locator(dropdownOptionLoc).click();
    }
    
    /**
    * This method is used to set the value in input field
    * @param inputFieldLabel - Input Field Label
    * @param value - Value to set in the input field
    * 
    * Example: setValueInInputField('Nearest City - Pickup*', 'KANDY')
    * 
    * This will set the value 'KANDY' in the input field with label 'Nearest City - Pickup*'
    */
    async setValueInInputField(inputFieldLabel: string, value: string) {
        const inputFieldLoc = `//label[normalize-space(text())="${inputFieldLabel}"]/../..//input`
        await this.page.locator(inputFieldLoc).fill(value);
    }

    /**
    * This method is used to set the value in textarea
    * @param textareaLabel - Textarea Label
    * @param value - Value to set in the textarea
    * 
    * Example: setValueInTextarea('Reason*', 'Test Reasons')
    * 
    * This will set the value 'Test Reasons' in the textarea with label 'Reason*' 
    */
    async setValueInTextarea(textareaLabel: string, value: string) {
        const textareaLoc = `//label[normalize-space(text())="${textareaLabel}"]/..//textarea`
        await this.page.locator(textareaLoc).fill(value);
    }

    /**
    * This method is used to set the value in input field
    * @param placeholder - Field Placeholder 
    * @param value - Value to set in the input field
    * 
    * Example: setValueInInputFieldWithPlaceholder('License Plate Number', 'XYZ')
    * 
    * This will set the value 'XYZ' in the input field with placeholder 'License Plate Number'
    */
    async setValueInInputFieldWithPlaceholder(placeholder: string, value: string){
        const inputFieldLoc = `//input[@placeholder='${placeholder}']`;
        await this.page.locator(inputFieldLoc).fill(value);
    }

    /**
    * This method is used to check or uncheck the checkbox
    * @param checkboxLabel - Checkbox Label
    * @param check - true to check the checkbox and false to uncheck the checkbox
    * 
    * Example: checkUncheckCheckbox('Auto-approve this request upon saving', true)
    * 
    * This will check the checkbox with label 'Auto-approve this request upon saving'
    * 
    * Example: checkUncheckCheckbox('Auto-approve this request upon saving', false)
    * 
    * This will uncheck the checkbox with label 'Auto-approve this request upon saving'
    */
    async checkUncheckCheckbox(checkboxLabel: string, check: boolean) {
        const checkboxLoc = `//*[normalize-space(text())="${checkboxLabel}"]/..//input[@type="checkbox"]`
        const isChecked = await this.page.locator(checkboxLoc).isChecked();
        if (isChecked != check) {
            await this.page.locator(checkboxLoc).click();
        }
    }

    /**
    * This method is used to click on the button
    * @param buttonLabel - Button Label
    * 
    * Example: clickOnButton('Save')
    * 
    * This will click on the button with label 'Save'
    */
    async clickOnButton(buttonLabel: string) {
        const buttonLoc = `//span[normalize-space(text())="${buttonLabel}"]`
        await this.page.locator(buttonLoc).click();
    }

    /**
    * This method is used to click on the date picker icon with label
    * @param datePickerLabel - Field Label of the date picker
    *  
    * Example: clickOnDatepickerIconWithLabel('Requested Start Date')
    * 
    * This will click on the date picker icon with Field name/label 'Requested Start Date'
    */
    async clickOnDatepickerIconWithLabel(datePickerLabel: string) {
        const datePickerLoc = `//*[local-name()="label" or local-name()="p" or local-name()="div"][normalize-space(text())="${datePickerLabel}"]/..//button`
        await this.page.locator(datePickerLoc).click();
        await this.page.waitForTimeout(1000);
    }

    /**
    * This method is used to click on the date picker icon without label
    * 
    * @param nth 
    * Example: clickOnDatepickerIconWithoutLabel() //if nth is not provided then it will set the date in the first date picker
    * Example: clickOnDatepickerIconWithoutLabel(1) //if nth is provided 1 then it will set the date in the second date picker
    * 
    * Note: This method is used to click on the date picker icon without label
    */
    async clickOnDatepickerIconWithoutLabel(nth: number = 0) {
        const datePickerLoc = `//span[@data-pc-name="calendar"]//button`;
        await this.page.locator(datePickerLoc).nth(nth).click({timeout: 90000});
        await this.page.waitForTimeout(1000);
    }

    /**
    * This method is used to select the value in date picker
    * @param value - Date value
    * @param nthElement - Index of the date picker element //default value is 0
    * 
    * Example: selectDateInDatePicker('01-01-2025') //if nthElement is not provided then it will set the date in the first date picker
    * Example: selectDateInDatePicker('01-01-2025', 1) //if nthElement=1 is provided then it will set the date in the second date picker
    * Example: selectDateInDatePicker('01-01-2025', 2) //if nthElement=2 is provided then it will set the date in the third date picker
    * 
    * This will set the date in the date picker as 01-01-2025 
    */
    async selectDateInDatePicker(value: string, nthElement: number = 0) {
        const dateTimeHealper = new DateTimeHelper();
        const year = dateTimeHealper.getYearFromDate(value);
        const month = dateTimeHealper.getMonthFromDate(value);
        const day = dateTimeHealper.getDayFromDate(value);
        const currentYear = await this.page.locator(`//button[@data-pc-section="yeartitle"]`).nth(nthElement).textContent();
        const currentMonth = await this.page.locator(`//button[@data-pc-section="monthtitle"]`).nth(nthElement).textContent();
        if (year != currentYear) {
            await this.page.locator(`//button[@data-pc-section="yeartitle"]`).nth(0).click();
            await this.page.locator(`//span[normalize-space(text())="${year}"]`).nth(0).click();
            await this.page.locator(`//span[normalize-space(text())="${dateTimeHealper.getMonthShortNameFromNumber(month)}"]`).nth(0).click();
            await this.page.locator(`//span[normalize-space(text())="${day}" and (@class="" or @class="p-highlight")]`).nth(0).click();
        }
        else if (year == currentYear && currentMonth != dateTimeHealper.getMonthNameFromNumber(month)) {
            await this.page.locator(`//button[@data-pc-section="monthtitle"]`).nth(0).click();
            await this.page.locator(`//span[normalize-space(text())="${dateTimeHealper.getMonthShortNameFromNumber(month)}"]`).nth(0).click();
            await this.page.locator(`//span[normalize-space(text())="${day}" and (@class="" or @class="p-highlight")]`).nth(0).click();
        }
        else {
            await this.page.locator(`//span[normalize-space(text())="${day}" and (@class="" or @class="p-highlight")]`).nth(0).click();
        }
    }
    
    /**
    * This method is used to set the date in date picker with clicking the date picker
    * @param datePickerLabel - Field Label of the date picker
    * @param value - Date value
    * @param nthElement - Index of the date picker element //default value is 0
    * 
    * Example: setDateInDateField('Requested Start Date', '01-01-2025') //if nthElement is not provided then it will set the date in the first date picker
    * Example: setDateInDateField('Requested Start Date', '01-01-2025', 1) //if nthElement=1 is provided then it will set the date in the second date picker
    * Example: setDateInDateField('Requested Start Date', '01-01-2025', 2) //if nthElement=2 is provided then it will set the date in the third date picker
    * 
    * This will set the date in the date picker with Field name/label 'Requested Start Date' as 01-01-2025
    */
    async setDateInDateField(datePickerLabel: string, value: string, nthElement: number = 0) {
        await this.clickOnDatepickerIconWithLabel(datePickerLabel);
        await this.selectDateInDatePicker(value, nthElement);
    }

    /**
    * This method is used to set the start and end date in date picker
    * @param start - Start date
    * @param end - End date
    * 
    * Example: setStartDateEndDateInFilters('01-01-2025', '01-02-2025')
    * 
    * This will set the start date as 01-01-2025 and end date as 01-02-2025 in the filters
    */
    async setStartDateEndDateInFilters(start: string, end : string) {
        await this.clickOnDatepickerIconWithoutLabel();
        await this.selectDateInDatePicker(start);
        await this.clickOnDatepickerIconWithoutLabel();
        await this.clickOnDatepickerIconWithoutLabel();
        await this.selectDateInDatePicker(end);
    }

    /**
    * This method is used to select the time in time picker
    * @param timePickerLabel - Field Label of the time picker
    * 
    * Example: selectTimeInTimePicker('Start Time')
    * 
    * This will select the time in the time picker with Field name/label 'Start Time'
    */
    async clickOnTimepickerIconWithLabel(timePickerLabel: string) {
        const timePickerLoc = `//*[local-name()="label" or local-name()="div"][normalize-space(text())="${timePickerLabel}"]/..//button`
        await this.page.locator(timePickerLoc).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * This method is to set data in timepicker fields inlcuding clicking on the Timepicker item
     * @param timePickerLabel 
     * @param value
     * @param nthElement 
     * 
     * Example: setTimeInTimePicker('Start Time') //if nthElement is not provided, default vlaue is 0 then it will set the time in the first time picker
     * Example: setTimeInTimePicker('Start Time', 1) //if nthElement is provided 1 then it will set the time in the second time picker
     * 
     * This will set the time in the time picker with Field name/label 'Start Time'
     */
    async setTimeInTimePicker(timePickerLabel: string, value: string, nthElement: number=0) {
        await this.clickOnTimepickerIconWithLabel(timePickerLabel);
        await this.selectTimeInTimePicker(value, nthElement);
        await this.clickOnTimepickerIconWithLabel(timePickerLabel);
    }

    /**
     * This method is to just select the time data in timepicker fields
     * @param timePickerLabel 
     * @param value 
     * @param nthElement 
     * 
     * Example: selectTimeInTimePicker('Start Time') //if nthElement is not provided, default vlaue is 0 then it will set the time in the first time picker
     * Example: selectTimeInTimePicker('Start Time', 1) //if nthElement is provided 1 then it will set the time in the second time picker
     * 
     * This will set the time in the time picker with Field name/label 'Start Time'
     */
    async selectTimeInTimePicker(value: string, nthElement: number=0) {
        const dateTimeHealper = new DateTimeHelper();
        const hour = dateTimeHealper.getHourFromTime(value);
        const min = dateTimeHealper.getMinFromTime(value);
        const ampm = dateTimeHealper.getAmPmFromTime(value);
        let currentHour = await this.page.locator(`//span[@data-pc-section="hour"]`).nth(nthElement).textContent();
        let currentMin = await this.page.locator(`//span[@data-pc-section="minute"]`).nth(nthElement).textContent();
        let currentAMPM = await this.page.locator(`//span[@data-pc-section="ampm"]`).nth(nthElement).textContent();

        if(currentAMPM == ampm && currentHour == hour && currentMin == min){
            await this.page.locator(`//div[@data-pc-section="ampmpicker"]//button[@data-pc-section="decrementbutton"]`).nth(0).click();
            await this.page.locator(`//div[@data-pc-section="ampmpicker"]//button[@data-pc-section="decrementbutton"]`).nth(0).click();
        }
        else{
            if(currentHour != hour){
                await this.hourIncrementDecrementLogic(currentHour, hour);
            }
            if(currentMin != min){
                await this.minIncrementDecrementLogic(currentMin, min);
            }
            currentAMPM = await this.page.locator(`//span[@data-pc-section="ampm"]`).nth(nthElement).textContent();
            if(currentAMPM != ampm){
                await this.page.locator(`//div[@data-pc-section="ampmpicker"]//button[@data-pc-section="decrementbutton"]`).nth(0).click();
            }
        }
    }

    /**
     * This method will change hour picker based on need
     * @param currentHour 
     * @param hour 
     */
    async hourIncrementDecrementLogic(currentHour, hour){
        let count = Number(currentHour) - Number(hour);
        const hourDecrementLoc = this.page.locator(`//div[@data-pc-section="hourpicker"]//button[@data-pc-section="decrementbutton"]`);
        const hourIncrementLoc = this.page.locator(`//div[@data-pc-section="hourpicker"]//button[@data-pc-section="incrementbutton"]`);
        if (count<0){
            count = count * (-1);
            for(let i= 0; i<count; i++){
                await hourIncrementLoc.nth(0).click();
            }
        }
        else{
            for(let i= 0; i<count; i++){
                await hourDecrementLoc.nth(0).click();
            }
        }
    }

    /**
     * This method will change min picker based on need
     * @param currentMin 
     * @param min 
     */
    async minIncrementDecrementLogic(currentMin, min){
        let count = (Number(currentMin) - Number(min))/10;
        const minDecrementLoc = this.page.locator(`//div[@data-pc-section="minutepicker"]//button[@data-pc-section="decrementbutton"]`);
        const minIncrementLoc = this.page.locator(`//div[@data-pc-section="minutepicker"]//button[@data-pc-section="incrementbutton"]`);
        if (count<0){
            count = count * (-1);
            for(let i= 0; i<count; i++){
                await minIncrementLoc.nth(0).click();
            }
        }
        else{
            for(let i= 0; i<count; i++){
                await minDecrementLoc.nth(0).click();
            }
        }
    }

    /**
     * This method is to just set the datetime data in date timepicker fields
     * @param dateValue 
     * @param timeValue 
     * @param nth 
     * 
     * Example: setDateTimeInFilter(startDate, startTime);//if nthElement is not provided, default vlaue is 0 then it will set the datetime in the first datetime picker
     * Example: setDateTimeInFilter(endDate, endTime, 1);//if nthElement is provided 1 then it will set the datetime in the second datetime picker
     */
    async setDateTimeInFilterWithoutLabel(dateValue: string, timeValue: string, nth: number=0){
        await this.clickOnDatepickerIconWithoutLabel(nth);
        await this.selectDateInDatePicker(dateValue);
        await this.selectTimeInTimePicker(timeValue);
        await this.clickOnDatepickerIconWithoutLabel(nth);
    }

    /**
     * This method is to just set the datetime data in date timepicker fields
     * @param datePickerLabel - Field Label of the date picker
     * @param dateValue 
     * @param timeValue 
     * @param nth 
     * 
     * Example: setDateTimeInFilterWithLabel('Date/Time - From :',startDate, startTime);//if nthElement is not provided, default vlaue is 0 then it will set the datetime in the first datetime picker
     * Example: setDateTimeInFilterWithLabel('Date/Time - To :',endDate, endTime, 1);//if nthElement is provided 1 then it will set the datetime in the second datetime picker
     */
    async setDateTimeWithFieldLabel(datePickerLabel: string, dateValue: string, timeValue: string){
        await this.clickOnDatepickerIconWithLabel(datePickerLabel);
        await this.selectDateInDatePicker(dateValue);
        await this.selectTimeInTimePicker(timeValue);
        await this.clickOnDatepickerIconWithLabel(datePickerLabel);
    }

    /**
    * This method is used to select the value in date picker
    * @param value - Date value
    * @param nthElement - Index of the date picker element //default value is 0
    * 
    * Example: selectDateInDatePicker('01-01-2025') //if nthElement is not provided then it will set the date in the first date picker
    * Example: selectDateInDatePicker('01-01-2025', 1) //if nthElement=1 is provided then it will set the date in the second date picker
    * Example: selectDateInDatePicker('01-01-2025', 2) //if nthElement=2 is provided then it will set the date in the third date picker
    * 
    * This will set the date in the date picker as 01-01-2025 
    */
    async setDateTimeWithFieldLabelInModal(datePickerLabel: string, dateValue: string, timeValue: string) {
        const datePickerLoc = `//*[local-name()="label" or local-name()="p" or local-name()="div"][normalize-space(text())="${datePickerLabel}"]/..//..//button`
        await this.page.locator(datePickerLoc).click();
        await this.page.waitForTimeout(1000);
        await this.selectDateInDatePicker(dateValue);
        await this.selectTimeInTimePicker(timeValue);
        await this.page.locator(datePickerLoc).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * This method is used to get toast message text 
     * @param toastMessageLocator 
     * @param nth 
     * @returns 
     */
    async getToastMessage(toastMessageLocator, nth=1){
        return this.page.locator(toastMessageLocator).nth(nth).textContent({timeout:90000});
    }

    async waitForPageLoaderBigSpinnerToDisappear(){
        //Waiting for page loader spinner to appear
        await this.page.waitForSelector(this.pageLoaderBigSpinnerLocator, {state: 'visible'});
        //Waiting for page loader spinner to disappear
        await this.page.waitForSelector(this.pageLoaderBigSpinnerLocator, {state: 'hidden',  timeout: 180000});
    }

    async waitForPageLoaderSmallSpinnerToDisappear(){
        //Waiting for page loader spinner to appear
        await this.page.waitForSelector(this.pageLoaderSmallSpinnerLocator, {state: 'visible'});
        //Waiting for page loader spinner to disappear
        await this.page.waitForSelector(this.pageLoaderSmallSpinnerLocator, {state: 'hidden', timeout: 180000});
    }

    /**
     * This will return specific column vlaue from first row
     * @param columnName 
     * @returns 
     */
    async getGridDataFromFirstRow(columnName: string){
        const gridHeaders = await this.page.locator("//table//th//span").allTextContents();
        const indexOfColumnHeader = gridHeaders.indexOf(columnName)+1;
        return await this.page.locator(`//table//tr[1]/td[@role="cell"][${indexOfColumnHeader}]`).innerText();
    }

    /**
     * This will return specific column vlaue from row based on the rowIdentifier
     * @param columnName 
     * @param rowIdentifier 
     * @returns 
     */
    async getGridDataFromSpecificRow(columnName: string, rowIdentifier: string){
        const gridHeaders = await this.page.locator("//table//th//span").allTextContents();
        const indexOfColumnHeader = gridHeaders.indexOf(columnName)+1;
        return await this.page.locator(`//td[normalize-space(.)='${rowIdentifier}']/..//td[${indexOfColumnHeader}]`).innerText();
    }

    /**
     * This method will read the JSON file and return JSON object
     * @param jsonFile // Json file location and name
     * @returns 
     */
    getJSONTestdata(jsonFile){
        return JSON.parse(fs.readFileSync(jsonFile, "utf-8"));
    }

    /*
    * This method is used to click on the button
    * @param tabLabel - Tab Label
    * 
    * Example: clickOnTab('New Request')
    * 
    * This will click on the button with label 'New Request'
    */
    async clickOnTab(tabLabel: string) {
        const buttonLoc = `//a//span[normalize-space(text())="${tabLabel}"]`
        await this.page.locator(buttonLoc).click();
    }

    /**
     * This will click on specific grid button based on the rowIdentifier
     * @param rowIdentifier 
     */
    async clickOnGridIcon(rowIdentifier: string, buttonHoverText: string){
        await this.page.locator(`//td[normalize-space(text())='${rowIdentifier}']/..//button[@data-pr-tooltip='${buttonHoverText}']`).click();
    }

    /**
     * This will click on specific grid button based on the rowIdentifier
     * @param rowIdentifier 
     */
    async clickOnGridButton(rowIdentifier: string, button: string){
        await this.page.locator(`//td[normalize-space(text())='${rowIdentifier}']/..//button[normalize-space(text())='${button}']`).click();
    }

    async clickOnModalButton(modalHeader:string, modalButton: string){
        await this.page.locator(`//div[normalize-space(text())='${modalHeader}']/../..//span[normalize-space(text())='${modalButton}']`).click();
    }
}  // Common class ends here
