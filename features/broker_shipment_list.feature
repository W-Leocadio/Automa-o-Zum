Feature: Broker Shipment List Management
  As a Broker user
  I want to view, filter, and navigate through the shipment list
  So that I can efficiently manage my loads

  Background:
    Given I am on the Broker login page
    And I log in with valid Broker credentials
    Then I should be redirected to the main dashboard

  Scenario: Validate shipment list pagination, navigation, and filters sequentially
    # Pagination and Navigation
    When I check the shipment list pagination
    Then the default page size should be "50"
    And the table should display 50 rows
    
    When I change the page size to "25"
    Then the table should display 25 rows
    
    When I change the page size to "100"
    Then the table should display 100 rows
    
    When I change the page size back to "50"
    And I navigate to the next page
    Then the pagination label should show "51 – 100 of"
    
    When I navigate to the next page again
    Then the pagination label should show "101 – 150 of"
    
    When I reload the page
    Then the pagination label should reset to "1 – 50 of"

    # Filters - Load ID
    When I select the "Load ID" filter
    And I search for "10021"
    Then the table should show rows containing "10021"
    And I clear the search

    # Filters - Pick State
    When I select the "Pick" filter
    And I search for "Oklahoma"
    Then the table should show rows containing "Oklahoma" or "OK"
    And I clear the search

    # Filters - Drop State
    When I select the "Drop" filter
    And I search for "New York"
    Then the table should show rows containing "New York" or "NY"
    And I clear the search

    # Filters - Pickup Dates
    When I open the "Pickup Dates" filter
    And I set a date range from 1 month ago to today
    And I apply the filter
    Then the table should show rows with valid dates in the Pick Date column
    And I clear all filters

    # Filters - Dropoff Dates
    When I open the "Dropoff Dates" filter
    And I set a date range from 15 days ago to today
    And I apply the filter
    Then the table should show rows with valid dates in the Drop Date column
    And the Pick Date column should also contain valid dates
    And I clear all filters

    # Filters - Priority
    When I open the "Priority" filter
    And I select the following priority options:
      | Fire Loads |
      | At Risk    |
      | Check Call |
    And I apply the priority filter
    Then the table should display rows matching the priority criteria
    And I clear all filters

    # Filters - Shipment Status (To be canceled)
    When I open the "Shipment Status" filter
    And I search for "To be canceled"
    And I select the "To be canceled" status checkbox
    And I apply the status filter
    Then the table should display rows with status "To be canceled"
    And I clear all filters

    # Filters - Shipment Status (At Pick Up)
    When I open the "Shipment Status" filter
    And I search for "At Pick Up"
    And I select the "At Pick Up" status checkbox
    And I apply the status filter
    Then the table should display rows with status "At Pick Up"
    And I clear all filters
