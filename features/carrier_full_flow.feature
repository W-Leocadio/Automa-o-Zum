Feature: Carrier Full Flow with Broker Setup

  Scenario: Broker creates a shipment and Carrier completes the job
    Given I am logged in as a Broker
    And I create a new FTL shipment
    And I tender the shipment to the Carrier
    When I log in as the Carrier
    And I navigate to the Jobs list
    And I find and select the job for the created shipment
    And I assign a driver to the job
    And I sign the confirmation
    And I update the job status through pickup and dropoff
    And I upload the POD
    Then the job should be marked as complete


