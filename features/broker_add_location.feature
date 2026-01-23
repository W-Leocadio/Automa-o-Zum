Feature: Broker Location Management
  As a Broker
  I want to manage locations
  So that I can organize my logistics network

  Scenario: Add a new location successfully
    Given I am logged in as a "Broker"
    When I navigate to the "Locations" page
    And I click on the "Add Location" button
    And I fill the "Location Name" with a random name
    And I select a random "Location Code"
    And I fill the "Address" with a valid address
    And I fill the "Suite #" with a random number
    And I fill "Shared Notes" with a test note
    And I configure the "Working Hours" with random open and closed days
    And I click the "Create" button
    Then I should be redirected to the locations list
    And I should see the new location in the list
