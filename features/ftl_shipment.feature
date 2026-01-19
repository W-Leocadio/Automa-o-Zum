Feature: FTL Shipment Creation

  @broker
  Scenario: Broker creates and tenders a new FTL shipment
    Given I am logged in as a "broker"
    When I navigate to the Build Shipment page
    And I fill in the Customer and Pricing details
      | Customer               | Wesley Company |
      | Customer Price         | 9000           |
      | Customer Representative| Wesley Leocadio|
      | Service Type           | Expedite       |
    And I fill in the Pickup details
      | Location Name | Best Buy Xbox DC |
      | Appointment   | TBD              |
    And I fill in the Dropoff details
      | Location Name | new york         |
      | Appointment   | TBD              |
    And I fill in the Load details
      | Weight          | 9000           |
      | Commodity Code  | METALS         |
      | Equipment Type  | 48' Dry Van    |
    And I tender the shipment to carrier
    Then the shipment should be successfully created
