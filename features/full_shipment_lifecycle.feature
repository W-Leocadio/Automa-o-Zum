Feature: Full Shipment Lifecycle
  As a system user (Broker and Carrier)
  I want to handle a shipment from creation to final billing
  So that the logistics process is completed and paid

  @e2e @full-cycle
  Scenario: Broker creates shipment, Carrier delivers, Broker approves POD
    # --- Part 1: Broker Creates Shipment ---
    Given I am logged in as a "broker"
    And I navigate to the Build Shipment page
    When I fill in the Customer and Pricing details
    And I fill in the Pickup details
    And I fill in the Dropoff details
    And I fill in the Load details
    And I tender the shipment to carrier "Samba Testes"
    Then the shipment should be successfully created and I save the Shipment ID

    # --- Part 2: Carrier Delivers Shipment ---
    Given I am logged in as a "carrier"
    When I navigate to the Jobs list
    And I find and select the job for the created shipment
    And I assign a driver to the job
    And I sign the confirmation
    And I update the status to "En Route to Pickup"
    And I update the status to "Arrived at Pickup"
    And I update the status to "Pickup Complete"
    And I update the status to "En Route to Dropoff"
    And I update the status to "Arrived at Dropoff"
    And I update the status to "Load Delivered"
    And I upload the POD file "POD.jpg"
    Then the job status should be updated to "Delivered"

    # --- Part 3: Broker Approves POD ---
    Given I am logged in as a "broker"
    When I find the shipment in the Shipments list
    And I verify the status is "POD Received"
    And I open the shipment details
    And I navigate to "Docs & Images"
    And I approve the "Signed Proof Of Delivery"
    And I submit a review for the carrier
    Then the shipment status should be updated to "To be Billed"
