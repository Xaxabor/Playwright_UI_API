import {test, request, expect, type Page} from '@playwright/test';
import { ManagePassengerRequestPage } from '../page-object/ManagePassengerRequest';
const { waitForConsoleMessages } = require('../Utils/AccessTokenHelper');
const { DateTimeHelper } = require('../Utils/DateTimeHelper');
const { PassengerRequestPage } = require('../page-object/PassengerRequestPage');
const { ManageVoyagesPage } = require('../page-object/ManageVoyagesPage');
const { postVoyagesIDOdometerImage, postVoyagesIDAbandonRequest } = require('../api/requests/POST');
const { getTransportRequestsPassengersID } = require('../api/requests/GET');
const { patchVoyagesIDStart, patchVoayagesIDComplete, patchTransportRequestIDComplete, patchTransportRequestsIDPresent, patchVoyagesIDAbandonCancel, patchTransportRequestIDAbsent } = require('../api/requests/PATCH');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('TN-TC-4233: [Regression] [Passenger Request] [Complete] Verify whether the user able to complete the passenger request.', 
  async ({ page, request }) => {
  // Generating the random test data and saving it in the given location 
  const passengerRequestPage = new PassengerRequestPage(page);
  passengerRequestPage.createAndSavePassengerRequestData(passengerRequestPage.testdataJSONLocation1);

  // Read and get the JSON file 
  const testData = passengerRequestPage.getJSONTestdata(passengerRequestPage.testdataJSONLocation1);
  const costCenter = testData[passengerRequestPage.costCenterDropdownLabel],
        pickupLocation = testData[passengerRequestPage.pickupLocationDropdownLabel],
        dropLocation = testData[passengerRequestPage.dropLocationDropdownLabel],
        nearestPickup = testData[passengerRequestPage.nearestCityPickupTextFieldLabel],
        nearestDrop =  testData[passengerRequestPage.nearestCityDropTextFieldLabel],
        reasons = testData[passengerRequestPage.reasonTextareaLabel],
        startDate = testData[passengerRequestPage.passengerRequestStartDate],
        endDate = testData[passengerRequestPage.passengerRequestEndDate],
        startTime = testData[passengerRequestPage.passengerRequestStartTime],
        endTime = testData[passengerRequestPage.passengerRequestEndTime];
  const vehicle = "CSJ-2004";

  //Creating and Validating created Passenger Request
  await passengerRequestPage.clickOnMenu(passengerRequestPage.passengerRequestsMenuButton);
  await passengerRequestPage.clickOnAddIcon(passengerRequestPage.passengerRequestAddIconLocator);
  const accessToken = await waitForConsoleMessages(page, 15000);
  await passengerRequestPage.selectFromDropdown(passengerRequestPage.costCenterDropdownLabel, costCenter);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.pickupLocationDropdownLabel, pickupLocation);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.dropLocationDropdownLabel, dropLocation);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityPickupTextFieldLabel, nearestPickup);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityDropTextFieldLabel, nearestDrop);
  await passengerRequestPage.setValueInTextarea(passengerRequestPage.reasonTextareaLabel, reasons);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestStartDate, startDate);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestEndDate, endDate);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestStartTime, startTime);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestEndTime, endTime);
  await passengerRequestPage.checkUncheckCheckbox(passengerRequestPage.autoApproveThisRequestUponSavingCheckbox, false);
  await passengerRequestPage.clickOnButton(passengerRequestPage.saveButton);
  expect.soft(await passengerRequestPage.getToastMessage(passengerRequestPage.toastMessageLocator))
  .toStrictEqual(passengerRequestPage.passengerRequestAddedSuccessfullyToast);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await passengerRequestPage.clickOnButton(passengerRequestPage.filterButton);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.toDate, endDate, endTime);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.fromDate, startDate, startTime);
  await passengerRequestPage.clickOnModalButtonInPassengerRequestPage(passengerRequestPage.filterModalHeader, passengerRequestPage.applyNowButton);
  // await passengerRequestPage.setStartDateEndDateInFilters(startDate, endDate);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedStartDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(startDate + ' | ' + startTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedEndDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(endDate + ' | ' + endTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.statusColumnLabel, nearestPickup))
  .toStrictEqual('Approval Pending');
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  //Saving the Request ID
  const requestID = await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestIdColumnLabel, nearestPickup);
  console.log(requestID);

  //Approving from Manage Passenger Request
  const managePassengerRequestPage = new ManagePassengerRequestPage(page);
  await managePassengerRequestPage.clickOnMenu(managePassengerRequestPage.managePassengerRequestsMenuButton);
  await managePassengerRequestPage.clickOnTab(managePassengerRequestPage.newRequestsTabLabel);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(startDate, startTime);
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(endDate, endTime, 1);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartDateColumnLabel, requestID))
  .toStrictEqual(startDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndDateColumnLabel, requestID))
  .toStrictEqual(endDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartTimeColumnLabel, requestID))
  .toStrictEqual(startTime);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndTimeColumnLabel, requestID))
  .toStrictEqual(endTime);

  await managePassengerRequestPage.clickOnGridIcon(requestID, managePassengerRequestPage.approveIconTooltip);
  await managePassengerRequestPage.clickOnModalButton(managePassengerRequestPage.approveRequestmodalHeader, managePassengerRequestPage.yesButton);
  expect.soft(await managePassengerRequestPage.getToastMessage(managePassengerRequestPage.toastMessageLocator))
  .toStrictEqual(managePassengerRequestPage.successfullyDoneToast);

  //Managing voyage
  const manageVoyagesPage = new ManageVoyagesPage(page);
  await manageVoyagesPage.clickOnMenu(manageVoyagesPage.manageVoyagesMenuButton);
  await manageVoyagesPage.clickOnAddIcon(manageVoyagesPage.allocateVoyageAddIconLocator);
  await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.chooseVoyageSchedulingMethodHeader, manageVoyagesPage.scheduleManuallyButton);
  await manageVoyagesPage.setDateInDateField(manageVoyagesPage.voyageStartDateField, startDate);
  await manageVoyagesPage.setTimeInTimePicker(manageVoyagesPage.voyageStartTimeField, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeFromField, startDate, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeToField, endDate, endTime);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  await manageVoyagesPage.clickOnGridButton(nearestPickup, manageVoyagesPage.allocateButton);
  //await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.allocateHeader, manageVoyagesPage.yesButton);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestPickup))
  .toStrictEqual('Pickup');
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestDrop))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestDrop))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestDrop))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestDrop))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestDrop))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestDrop))
  .toStrictEqual(nearestDrop);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestDrop))
  .toStrictEqual('Drop');

  await manageVoyagesPage.clickOnButton(manageVoyagesPage.proceedButton);
  await manageVoyagesPage.waitForPageLoaderBigSpinnerToDisappear();
  await manageVoyagesPage.setValueInInputFieldWithPlaceholder(manageVoyagesPage.licensePlateNumberplaceholder, vehicle);
  await page.keyboard.press('Enter');
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.clickOnGridButton(vehicle, manageVoyagesPage.availableButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.viewMapButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.allocateButton);
  await page.waitForTimeout(3000);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.voyageAddedSuccessfullyToast);

  //Saving the Voyage ID
  //Make sure vehicle 10.00 am to 6:00 pm
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.scheduledTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  const voyageID = await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.voyageIdColumnLabel, `${startDate} | ${startTime}`);
  console.log(voyageID);

  //api
  const dateTimeHelper = new DateTimeHelper();
  let response;
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 0, "start.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDStart(request, accessToken, voyageID, dateTimeHelper.getDateInISOFormat( startDate, startTime));
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, requestID);
  await expect(response.status()).toEqual(200);

  let responseJSON = await response.json();
  let version = responseJSON.version;
  let longitude = responseJSON.longitude;
  let latitude = responseJSON.latitude;
  let dropRequestID = responseJSON.dropRequest.id;
  let timeStart = dateTimeHelper.addingXminWithTime(startTime, 3);
  console.log(timeStart)
  let dateTime = dateTimeHelper.getDateInISOFormat(startDate, timeStart);
  console.log(dateTime)
  console.log(version);
  console.log(longitude);
  console.log(latitude);

  response = await patchTransportRequestsIDPresent(request, accessToken, requestID, dateTime, longitude, latitude, version);
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, dropRequestID);
  await expect(response.status()).toEqual(200);

  responseJSON = await response.json();
  let dropRequestVersion = responseJSON.version;
  let dropRequestLongitude = responseJSON.longitude;
  let dropRequestLatitude = responseJSON.latitude;
  let endDateTime = dateTimeHelper.getDateInISOFormat(endDate, endTime);

  response = await patchTransportRequestIDComplete(request, accessToken, dropRequestID, dateTime, dropRequestLongitude, dropRequestLatitude, dropRequestVersion);
  await expect(response.status()).toEqual(200);

  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 1, "end.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoayagesIDComplete(request, accessToken, voyageID, endDateTime);
  await expect(response.status()).toEqual(200);

  //UI
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.completedTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
});

test('TN-TC-4235: [Regression] [Passenger Request] [Abandoned - Cancel] Verify whether the user able to Abandon - Cancel the passenger request.', 
  async ({ page, request }) => {
  // Generating the random test data and saving it in the given location 
  const passengerRequestPage = new PassengerRequestPage(page);
  passengerRequestPage.createAndSavePassengerRequestData(passengerRequestPage.testdataJSONLocation2);

  // Read and get the JSON file 
  const testData = passengerRequestPage.getJSONTestdata(passengerRequestPage.testdataJSONLocation2);
  const costCenter = testData[passengerRequestPage.costCenterDropdownLabel],
        pickupLocation = testData[passengerRequestPage.pickupLocationDropdownLabel],
        dropLocation = testData[passengerRequestPage.dropLocationDropdownLabel],
        nearestPickup = testData[passengerRequestPage.nearestCityPickupTextFieldLabel],
        nearestDrop =  testData[passengerRequestPage.nearestCityDropTextFieldLabel],
        reasons = testData[passengerRequestPage.reasonTextareaLabel],
        startDate = testData[passengerRequestPage.passengerRequestStartDate],
        endDate = testData[passengerRequestPage.passengerRequestEndDate],
        startTime = testData[passengerRequestPage.passengerRequestStartTime],
        endTime = testData[passengerRequestPage.passengerRequestEndTime];
  const vehicle = "AA-1234";

  //Creating and Validating created Passenger Request
  await passengerRequestPage.clickOnMenu(passengerRequestPage.passengerRequestsMenuButton);
  await passengerRequestPage.clickOnAddIcon(passengerRequestPage.passengerRequestAddIconLocator);
  const accessToken = await waitForConsoleMessages(page, 15000);
  await passengerRequestPage.selectFromDropdown(passengerRequestPage.costCenterDropdownLabel, costCenter);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.pickupLocationDropdownLabel, pickupLocation);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.dropLocationDropdownLabel, dropLocation);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityPickupTextFieldLabel, nearestPickup);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityDropTextFieldLabel, nearestDrop);
  await passengerRequestPage.setValueInTextarea(passengerRequestPage.reasonTextareaLabel, reasons);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestStartDate, startDate);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestEndDate, endDate);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestStartTime, startTime);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestEndTime, endTime);
  await passengerRequestPage.checkUncheckCheckbox(passengerRequestPage.autoApproveThisRequestUponSavingCheckbox, false);
  await passengerRequestPage.clickOnButton(passengerRequestPage.saveButton);
  expect.soft(await passengerRequestPage.getToastMessage(passengerRequestPage.toastMessageLocator))
  .toStrictEqual(passengerRequestPage.passengerRequestAddedSuccessfullyToast);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await passengerRequestPage.clickOnButton(passengerRequestPage.filterButton);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.toDate, endDate, endTime);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.fromDate, startDate, startTime);
  await passengerRequestPage.clickOnModalButtonInPassengerRequestPage(passengerRequestPage.filterModalHeader, passengerRequestPage.applyNowButton);
  // await passengerRequestPage.setStartDateEndDateInFilters(startDate, endDate);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedStartDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(startDate + ' | ' + startTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedEndDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(endDate + ' | ' + endTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.statusColumnLabel, nearestPickup))
  .toStrictEqual('Approval Pending');
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  //Saving the Request ID
  const requestID = await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestIdColumnLabel, nearestPickup);
  console.log(requestID);

  //Approving from Manage Passenger Request
  const managePassengerRequestPage = new ManagePassengerRequestPage(page);
  await managePassengerRequestPage.clickOnMenu(managePassengerRequestPage.managePassengerRequestsMenuButton);
  await managePassengerRequestPage.clickOnTab(managePassengerRequestPage.newRequestsTabLabel);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(startDate, startTime);
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(endDate, endTime, 1);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartDateColumnLabel, requestID))
  .toStrictEqual(startDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndDateColumnLabel, requestID))
  .toStrictEqual(endDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartTimeColumnLabel, requestID))
  .toStrictEqual(startTime);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndTimeColumnLabel, requestID))
  .toStrictEqual(endTime);

  await managePassengerRequestPage.clickOnGridIcon(requestID, managePassengerRequestPage.approveIconTooltip);
  await managePassengerRequestPage.clickOnModalButton(managePassengerRequestPage.approveRequestmodalHeader, managePassengerRequestPage.yesButton);
  expect.soft(await managePassengerRequestPage.getToastMessage(managePassengerRequestPage.toastMessageLocator))
  .toStrictEqual(managePassengerRequestPage.successfullyDoneToast);

  //Managing voyage
  const manageVoyagesPage = new ManageVoyagesPage(page);
  await manageVoyagesPage.clickOnMenu(manageVoyagesPage.manageVoyagesMenuButton);
  await manageVoyagesPage.clickOnAddIcon(manageVoyagesPage.allocateVoyageAddIconLocator);
  await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.chooseVoyageSchedulingMethodHeader, manageVoyagesPage.scheduleManuallyButton);
  await manageVoyagesPage.setDateInDateField(manageVoyagesPage.voyageStartDateField, startDate);
  await manageVoyagesPage.setTimeInTimePicker(manageVoyagesPage.voyageStartTimeField, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeFromField, startDate, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeToField, endDate, endTime);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  await manageVoyagesPage.clickOnGridButton(nearestPickup, manageVoyagesPage.allocateButton);
  //await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.allocateHeader, manageVoyagesPage.yesButton);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestPickup))
  .toStrictEqual('Pickup');
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestDrop))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestDrop))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestDrop))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestDrop))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestDrop))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestDrop))
  .toStrictEqual(nearestDrop);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestDrop))
  .toStrictEqual('Drop');

  await manageVoyagesPage.clickOnButton(manageVoyagesPage.proceedButton);
  await manageVoyagesPage.waitForPageLoaderBigSpinnerToDisappear();
  await manageVoyagesPage.setValueInInputFieldWithPlaceholder(manageVoyagesPage.licensePlateNumberplaceholder, vehicle);
  await page.keyboard.press('Enter');
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.clickOnGridButton(vehicle, manageVoyagesPage.availableButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.viewMapButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.allocateButton);
  await page.waitForTimeout(3000);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.voyageAddedSuccessfullyToast);

  //Saving the Voyage ID
  //Make sure vehicle 10.00 am to 6:00 pm
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.scheduledTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  const voyageID = await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.voyageIdColumnLabel, `${startDate} | ${startTime}`);
  console.log(voyageID);

  //api call to abandon the voyage
  const dateTimeHelper = new DateTimeHelper();
  let response;
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 0, "start.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDStart(request, accessToken, voyageID, dateTimeHelper.getDateInISOFormat( startDate, startTime));
  await expect(response.status()).toEqual(200);
  
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 2, "abandon.png");
  await expect(response.status()).toEqual(201);

  response = await postVoyagesIDAbandonRequest(request, accessToken, voyageID, "abandon.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDAbandonCancel(request, accessToken, voyageID);
  await expect(response.status()).toEqual(200);

  //UI
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.onGoingTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.statusColumnLabel, voyageID))
  .toStrictEqual("Ongoing");

  // api call to complete the voyage
  response = await getTransportRequestsPassengersID(request, accessToken, requestID);
  await expect(response.status()).toEqual(200);

  let responseJSON = await response.json();
  let version = responseJSON.version;
  let longitude = responseJSON.longitude;
  let latitude = responseJSON.latitude;
  let dropRequestID = responseJSON.dropRequest.id;
  let timeStart = dateTimeHelper.addingXminWithTime(startTime, 3);
  console.log(timeStart)
  let dateTime = dateTimeHelper.getDateInISOFormat(startDate, timeStart);
  console.log(dateTime)
  console.log(version);
  console.log(longitude);
  console.log(latitude);

  response = await patchTransportRequestsIDPresent(request, accessToken, requestID, dateTime, longitude, latitude, version);
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, dropRequestID);
  await expect(response.status()).toEqual(200);

  responseJSON = await response.json();
  let dropRequestVersion = responseJSON.version;
  let dropRequestLongitude = responseJSON.longitude;
  let dropRequestLatitude = responseJSON.latitude;
  let endDateTime = dateTimeHelper.getDateInISOFormat(endDate, endTime);

  response = await patchTransportRequestIDComplete(request, accessToken, dropRequestID, dateTime, dropRequestLongitude, dropRequestLatitude, dropRequestVersion);
  await expect(response.status()).toEqual(200);

  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 1, "end.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoayagesIDComplete(request, accessToken, voyageID, endDateTime);
  await expect(response.status()).toEqual(200);

  //UI
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.completedTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
});

test('TN-TC-4272: [Regression] [Passenger Request] [Absent - Single] Verify whether user able to Absent the Passenger Request.',
  async ({page, request }) => {
  // Generating the random test data and saving it in the given location 
  const passengerRequestPage = new PassengerRequestPage(page);
  passengerRequestPage.createAndSavePassengerRequestData(passengerRequestPage.testdataJSONLocation3);

  // Read and get the JSON file 
  const testData = passengerRequestPage.getJSONTestdata(passengerRequestPage.testdataJSONLocation3);
  const costCenter = testData[passengerRequestPage.costCenterDropdownLabel],
        pickupLocation = testData[passengerRequestPage.pickupLocationDropdownLabel],
        dropLocation = testData[passengerRequestPage.dropLocationDropdownLabel],
        nearestPickup = testData[passengerRequestPage.nearestCityPickupTextFieldLabel],
        nearestDrop =  testData[passengerRequestPage.nearestCityDropTextFieldLabel],
        reasons = testData[passengerRequestPage.reasonTextareaLabel],
        startDate = testData[passengerRequestPage.passengerRequestStartDate],
        endDate = testData[passengerRequestPage.passengerRequestEndDate],
        startTime = testData[passengerRequestPage.passengerRequestStartTime],
        endTime = testData[passengerRequestPage.passengerRequestEndTime];
  const vehicle = "CSJ-2004";

  //Creating and Validating created Passenger Request
  await passengerRequestPage.clickOnMenu(passengerRequestPage.passengerRequestsMenuButton);
  await passengerRequestPage.clickOnAddIcon(passengerRequestPage.passengerRequestAddIconLocator);
  const accessToken = await waitForConsoleMessages(page, 15000);
  await passengerRequestPage.selectFromDropdown(passengerRequestPage.costCenterDropdownLabel, costCenter);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.pickupLocationDropdownLabel, pickupLocation);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.dropLocationDropdownLabel, dropLocation);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityPickupTextFieldLabel, nearestPickup);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityDropTextFieldLabel, nearestDrop);
  await passengerRequestPage.setValueInTextarea(passengerRequestPage.reasonTextareaLabel, reasons);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestStartDate, startDate);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestEndDate, endDate);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestStartTime, startTime);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestEndTime, endTime);
  await passengerRequestPage.checkUncheckCheckbox(passengerRequestPage.autoApproveThisRequestUponSavingCheckbox, false);
  await passengerRequestPage.clickOnButton(passengerRequestPage.saveButton);
  expect.soft(await passengerRequestPage.getToastMessage(passengerRequestPage.toastMessageLocator))
  .toStrictEqual(passengerRequestPage.passengerRequestAddedSuccessfullyToast);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await passengerRequestPage.clickOnButton(passengerRequestPage.filterButton);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.toDate, endDate, endTime);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.fromDate, startDate, startTime);
  await passengerRequestPage.clickOnModalButtonInPassengerRequestPage(passengerRequestPage.filterModalHeader, passengerRequestPage.applyNowButton);
  // await passengerRequestPage.setStartDateEndDateInFilters(startDate, endDate);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedStartDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(startDate + ' | ' + startTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedEndDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(endDate + ' | ' + endTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.statusColumnLabel, nearestPickup))
  .toStrictEqual('Approval Pending');
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  //Saving the Request ID
  const requestID = await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestIdColumnLabel, nearestPickup);
  console.log(requestID);

  //Approving from Manage Passenger Request
  const managePassengerRequestPage = new ManagePassengerRequestPage(page);
  await managePassengerRequestPage.clickOnMenu(managePassengerRequestPage.managePassengerRequestsMenuButton);
  await managePassengerRequestPage.clickOnTab(managePassengerRequestPage.newRequestsTabLabel);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(startDate, startTime);
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(endDate, endTime, 1);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartDateColumnLabel, requestID))
  .toStrictEqual(startDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndDateColumnLabel, requestID))
  .toStrictEqual(endDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartTimeColumnLabel, requestID))
  .toStrictEqual(startTime);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndTimeColumnLabel, requestID))
  .toStrictEqual(endTime);

  await managePassengerRequestPage.clickOnGridIcon(requestID, managePassengerRequestPage.approveIconTooltip);
  await managePassengerRequestPage.clickOnModalButton(managePassengerRequestPage.approveRequestmodalHeader, managePassengerRequestPage.yesButton);
  expect.soft(await managePassengerRequestPage.getToastMessage(managePassengerRequestPage.toastMessageLocator))
  .toStrictEqual(managePassengerRequestPage.successfullyDoneToast);

  //Managing voyage
  const manageVoyagesPage = new ManageVoyagesPage(page);
  await manageVoyagesPage.clickOnMenu(manageVoyagesPage.manageVoyagesMenuButton);
  await manageVoyagesPage.clickOnAddIcon(manageVoyagesPage.allocateVoyageAddIconLocator);
  await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.chooseVoyageSchedulingMethodHeader, manageVoyagesPage.scheduleManuallyButton);
  await manageVoyagesPage.setDateInDateField(manageVoyagesPage.voyageStartDateField, startDate);
  await manageVoyagesPage.setTimeInTimePicker(manageVoyagesPage.voyageStartTimeField, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeFromField, startDate, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeToField, endDate, endTime);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  await manageVoyagesPage.clickOnGridButton(nearestPickup, manageVoyagesPage.allocateButton);
  //await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.allocateHeader, manageVoyagesPage.yesButton);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestPickup))
  .toStrictEqual('Pickup');
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestDrop))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestDrop))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestDrop))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestDrop))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestDrop))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestDrop))
  .toStrictEqual(nearestDrop);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestDrop))
  .toStrictEqual('Drop');

  await manageVoyagesPage.clickOnButton(manageVoyagesPage.proceedButton);
  await manageVoyagesPage.waitForPageLoaderBigSpinnerToDisappear();
  await manageVoyagesPage.setValueInInputFieldWithPlaceholder(manageVoyagesPage.licensePlateNumberplaceholder, vehicle);
  await page.keyboard.press('Enter');
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.clickOnGridButton(vehicle, manageVoyagesPage.availableButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.viewMapButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.allocateButton);
  await page.waitForTimeout(3000);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.voyageAddedSuccessfullyToast);

  //Saving the Voyage ID
  //Make sure vehicle 10.00 am to 6:00 pm
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.scheduledTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  const voyageID = await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.voyageIdColumnLabel, `${startDate} | ${startTime}`);
  console.log(voyageID);

  //api call to passenger as absent in the voyage
  const dateTimeHelper = new DateTimeHelper();
  let response;
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 0, "start.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDStart(request, accessToken, voyageID, dateTimeHelper.getDateInISOFormat( startDate, startTime));
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, requestID);
  await expect(response.status()).toEqual(200);

  let responseJSON = await response.json();
  let version = responseJSON.version;
  let longitude = responseJSON.longitude;
  let latitude = responseJSON.latitude;
  let dropRequestID = responseJSON.dropRequest.id;
  let timeStart = dateTimeHelper.addingXminWithTime(startTime, 3);
  console.log(timeStart)
  let dateTime = dateTimeHelper.getDateInISOFormat(startDate, timeStart);
  console.log(dateTime)
  console.log(version);
  console.log(longitude);
  console.log(latitude);

  response = await patchTransportRequestIDAbsent(request, accessToken, requestID, dateTime, longitude, latitude, version);
  await expect(response.status()).toEqual(200);
  
  let endDateTime = dateTimeHelper.getDateInISOFormat(endDate, endTime);

  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 1, "end.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoayagesIDComplete(request, accessToken, voyageID, endDateTime);
  await expect(response.status()).toEqual(200);

  //UI
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.completedTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
});

test('TN-TC-4234: [Regression] [Passenger Request] [Abandoned - Approve] Verify whether the user able to Abandon - Approve the passenger request.', 
  async ({ page, request }) => {
  // Generating the random test data and saving it in the given location 
  const passengerRequestPage = new PassengerRequestPage(page);
  passengerRequestPage.createAndSavePassengerRequestData(passengerRequestPage.testdataJSONLocation4);

  // Read and get the JSON file 
  const testData = passengerRequestPage.getJSONTestdata(passengerRequestPage.testdataJSONLocation4);
  const costCenter = testData[passengerRequestPage.costCenterDropdownLabel],
        pickupLocation = testData[passengerRequestPage.pickupLocationDropdownLabel],
        dropLocation = testData[passengerRequestPage.dropLocationDropdownLabel],
        nearestPickup = testData[passengerRequestPage.nearestCityPickupTextFieldLabel],
        nearestDrop =  testData[passengerRequestPage.nearestCityDropTextFieldLabel],
        reasons = testData[passengerRequestPage.reasonTextareaLabel],
        startDate = testData[passengerRequestPage.passengerRequestStartDate],
        endDate = testData[passengerRequestPage.passengerRequestEndDate],
        startTime = testData[passengerRequestPage.passengerRequestStartTime],
        endTime = testData[passengerRequestPage.passengerRequestEndTime];
  let vehicle = "CSJ-2004";
  let vehicle2 = "GHT-2003";

  //Creating and Validating created Passenger Request
  await passengerRequestPage.clickOnMenu(passengerRequestPage.passengerRequestsMenuButton);
  await passengerRequestPage.clickOnAddIcon(passengerRequestPage.passengerRequestAddIconLocator);
  const accessToken = await waitForConsoleMessages(page, 15000);
  await passengerRequestPage.selectFromDropdown(passengerRequestPage.costCenterDropdownLabel, costCenter);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.pickupLocationDropdownLabel, pickupLocation);
  await passengerRequestPage.setValueAndSelectIntoField(passengerRequestPage.dropLocationDropdownLabel, dropLocation);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityPickupTextFieldLabel, nearestPickup);
  await passengerRequestPage.setValueInInputField(passengerRequestPage.nearestCityDropTextFieldLabel, nearestDrop);
  await passengerRequestPage.setValueInTextarea(passengerRequestPage.reasonTextareaLabel, reasons);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestStartDate, startDate);
  await passengerRequestPage.setDateInDateField(passengerRequestPage.passengerRequestEndDate, endDate);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestStartTime, startTime);
  await passengerRequestPage.setTimeInTimePicker(passengerRequestPage.passengerRequestEndTime, endTime);
  await passengerRequestPage.checkUncheckCheckbox(passengerRequestPage.autoApproveThisRequestUponSavingCheckbox, false);
  await passengerRequestPage.clickOnButton(passengerRequestPage.saveButton);
  expect.soft(await passengerRequestPage.getToastMessage(passengerRequestPage.toastMessageLocator))
  .toStrictEqual(passengerRequestPage.passengerRequestAddedSuccessfullyToast);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await passengerRequestPage.clickOnButton(passengerRequestPage.filterButton);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.toDate, endDate, endTime);
  await passengerRequestPage.setDateTimeWithFieldLabelInModal(passengerRequestPage.fromDate, startDate, startTime);
  await passengerRequestPage.clickOnModalButtonInPassengerRequestPage(passengerRequestPage.filterModalHeader, passengerRequestPage.applyNowButton);
  await passengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedStartDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(startDate + ' | ' + startTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestedEndDateTimeColumnLabel, nearestPickup))
  .toStrictEqual(endDate + ' | ' + endTime);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.statusColumnLabel, nearestPickup))
  .toStrictEqual('Approval Pending');
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  //Saving the Request ID
  const requestID = await passengerRequestPage.getGridDataFromSpecificRow(passengerRequestPage.requestIdColumnLabel, nearestPickup);
  console.log(requestID);

  //Approving from Manage Passenger Request
  const managePassengerRequestPage = new ManagePassengerRequestPage(page);
  await managePassengerRequestPage.clickOnMenu(managePassengerRequestPage.managePassengerRequestsMenuButton);
  await managePassengerRequestPage.clickOnTab(managePassengerRequestPage.newRequestsTabLabel);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(startDate, startTime);
  await managePassengerRequestPage.setDateTimeInFilterWithoutLabel(endDate, endTime, 1);
  await managePassengerRequestPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartDateColumnLabel, requestID))
  .toStrictEqual(startDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndDateColumnLabel, requestID))
  .toStrictEqual(endDate);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedStartTimeColumnLabel, requestID))
  .toStrictEqual(startTime);
  expect.soft(await managePassengerRequestPage.getGridDataFromSpecificRow(managePassengerRequestPage.requestedEndTimeColumnLabel, requestID))
  .toStrictEqual(endTime);

  await managePassengerRequestPage.clickOnGridIcon(requestID, managePassengerRequestPage.approveIconTooltip);
  await managePassengerRequestPage.clickOnModalButton(managePassengerRequestPage.approveRequestmodalHeader, managePassengerRequestPage.yesButton);
  expect.soft(await managePassengerRequestPage.getToastMessage(managePassengerRequestPage.toastMessageLocator))
  .toStrictEqual(managePassengerRequestPage.successfullyDoneToast);

  //Managing voyage
  const manageVoyagesPage = new ManageVoyagesPage(page);
  await manageVoyagesPage.clickOnMenu(manageVoyagesPage.manageVoyagesMenuButton);
  await manageVoyagesPage.clickOnAddIcon(manageVoyagesPage.allocateVoyageAddIconLocator);
  await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.chooseVoyageSchedulingMethodHeader, manageVoyagesPage.scheduleManuallyButton);
  await manageVoyagesPage.setDateInDateField(manageVoyagesPage.voyageStartDateField, startDate);
  await manageVoyagesPage.setTimeInTimePicker(manageVoyagesPage.voyageStartTimeField, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeFromField, startDate, startTime);
  await manageVoyagesPage.setDateTimeWithFieldLabel(manageVoyagesPage.dateTimeToField, endDate, endTime);
  // await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  await manageVoyagesPage.clickOnGridButton(nearestPickup, manageVoyagesPage.allocateButton);
  //await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.allocateHeader, manageVoyagesPage.yesButton);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestPickup))
  .toStrictEqual('Pickup');
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestDrop))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestDrop))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestDrop))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestDrop))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestDrop))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestDrop))
  .toStrictEqual(nearestDrop);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestDrop))
  .toStrictEqual('Drop');

  await manageVoyagesPage.clickOnButton(manageVoyagesPage.proceedButton);
  await manageVoyagesPage.waitForPageLoaderBigSpinnerToDisappear();
  await manageVoyagesPage.setValueInInputFieldWithPlaceholder(manageVoyagesPage.licensePlateNumberplaceholder, vehicle);
  await page.keyboard.press('Enter');
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.clickOnGridButton(vehicle, manageVoyagesPage.availableButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.viewMapButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.allocateButton);
  await page.waitForTimeout(3000);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.voyageAddedSuccessfullyToast);

  //Saving the Voyage ID
  //Make sure vehicle 10.00 am to 6:00 pm
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.scheduledTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  const voyageID = await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.voyageIdColumnLabel, `${startDate} | ${startTime}`);
  console.log(voyageID);

  //api call to abandon the voyage
  const dateTimeHelper = new DateTimeHelper();
  let response;
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 0, "start.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDStart(request, accessToken, voyageID, dateTimeHelper.getDateInISOFormat( startDate, startTime));
  await expect(response.status()).toEqual(200);
  
  response = await postVoyagesIDOdometerImage(request, accessToken, voyageID, 2, "abandon.png");
  await expect(response.status()).toEqual(201);

  response = await postVoyagesIDAbandonRequest(request, accessToken, voyageID, "abandon.png");
  await expect(response.status()).toEqual(201);

  // verify voyage is still in status 'Ongoing'
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.onGoingTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.statusColumnLabel, voyageID))
  .toStrictEqual("Abandon Requested");

  // approve abandon and create new voyage
  await manageVoyagesPage.clickOnAbandonIcon(voyageID);
  await manageVoyagesPage.checkUncheckCheckbox(manageVoyagesPage.abandonVaoyageAgreementCheckboxLabel, true);
  await manageVoyagesPage.clickOnModalButton(manageVoyagesPage.abandonVoyageHeader, manageVoyagesPage.abandonCurrentAndCreateNewVoyageButton);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.successfullyAbandonedTheAbandonedRequestToast);
  await manageVoyagesPage.setDateInDateField(manageVoyagesPage.voyageStartDateField, startDate);
  await manageVoyagesPage.setTimeInTimePicker(manageVoyagesPage.voyageStartTimeField, startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual(nearestDrop);

  await manageVoyagesPage.clickOnGridButton(nearestPickup, manageVoyagesPage.allocateButton);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestPickup))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestPickup))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestPickup))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestPickup))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestPickup))
  .toStrictEqual(nearestPickup);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestPickup))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestPickup))
  .toStrictEqual('Pickup');
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartDateColumnLabel, nearestDrop))
  .toStrictEqual(startDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndDateColumnLabel, nearestDrop))
  .toStrictEqual(endDate);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedStartTimeColumnLabel, nearestDrop))
  .toStrictEqual(startTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestedEndTimeColumnLabel, nearestDrop))
  .toStrictEqual(endTime);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityPickupColumnLabel, nearestDrop))
  .toStrictEqual("-");
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.nearestCityDropColumnLabel, nearestDrop))
  .toStrictEqual(nearestDrop);
  expect.soft(await manageVoyagesPage.getCurrentSelectionGridDataFromSpecificRow(manageVoyagesPage.requestTypeColumnLabel, nearestDrop))
  .toStrictEqual('Drop');

  await manageVoyagesPage.clickOnButton(manageVoyagesPage.proceedButton);
  // await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setValueInInputFieldWithPlaceholder(manageVoyagesPage.licensePlateNumberplaceholder, vehicle2);
  await page.keyboard.press('Enter');
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.clickOnGridButton(vehicle2, manageVoyagesPage.availableButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.viewMapButton);
  await manageVoyagesPage.clickOnButton(manageVoyagesPage.allocateButton);
  expect.soft(await manageVoyagesPage.getToastMessage(manageVoyagesPage.toastMessageLocator))
  .toStrictEqual(manageVoyagesPage.voyageAddedSuccessfullyToast);
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.scheduledTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  const newVoyageID = await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.voyageIdColumnLabel, `${startDate} | ${startTime}`);
  console.log(newVoyageID);

  // api call to complete the voyage
  response = await postVoyagesIDOdometerImage(request, accessToken, newVoyageID, 0, "start.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoyagesIDStart(request, accessToken, newVoyageID, dateTimeHelper.getDateInISOFormat( startDate, startTime));
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, requestID);
  await expect(response.status()).toEqual(200);

  let responseJSON = await response.json();
  let version = responseJSON.version;
  let longitude = responseJSON.longitude;
  let latitude = responseJSON.latitude;
  let dropRequestID = responseJSON.dropRequest.id;
  let timeStart = dateTimeHelper.addingXminWithTime(startTime, 3);
  console.log(timeStart)
  let dateTime = dateTimeHelper.getDateInISOFormat(startDate, timeStart);
  console.log(dateTime)
  console.log(version);
  console.log(longitude);
  console.log(latitude);

  response = await patchTransportRequestsIDPresent(request, accessToken, requestID, dateTime, longitude, latitude, version);
  await expect(response.status()).toEqual(200);

  response = await getTransportRequestsPassengersID(request, accessToken, dropRequestID);
  await expect(response.status()).toEqual(200);

  responseJSON = await response.json();
  let dropRequestVersion = responseJSON.version;
  let dropRequestLongitude = responseJSON.longitude;
  let dropRequestLatitude = responseJSON.latitude;
  let endDateTime = dateTimeHelper.getDateInISOFormat(endDate, endTime);

  response = await patchTransportRequestIDComplete(request, accessToken, dropRequestID, dateTime, dropRequestLongitude, dropRequestLatitude, dropRequestVersion);
  await expect(response.status()).toEqual(200);

  response = await postVoyagesIDOdometerImage(request, accessToken, newVoyageID, 1, "end.png");
  await expect(response.status()).toEqual(201);

  response = await patchVoayagesIDComplete(request, accessToken, newVoyageID, endDateTime);
  await expect(response.status()).toEqual(200);

  //UI to verify the abandoned and completex voyages
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.completedTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, newVoyageID))
  .toStrictEqual(vehicle2);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, newVoyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
  await manageVoyagesPage.clickOnTab(manageVoyagesPage.abandonedTabLabel);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  await manageVoyagesPage.setStartDateEndDateInFilters(startDate, endDate);
  await manageVoyagesPage.waitForPageLoaderSmallSpinnerToDisappear();
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.statusColumnLabel, voyageID))
  .toStrictEqual("Abandoned");
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.vehicleNumberColumnLabel, voyageID))
  .toStrictEqual(vehicle);
  expect.soft(await manageVoyagesPage.getGridDataFromSpecificRow(manageVoyagesPage.scheduledDateTimeColumnLabel, voyageID))
  .toStrictEqual(`${startDate} | ${startTime}`);
});