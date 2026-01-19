Feature: Login in Zuum systems

  Scenario Outline: Login with valid credentials in <sistema> system
    Given the user accesses the login page of <sistema>
    And the user is on the URL "<url>"
    When the user enters a valid email "<email>"
    And enters a valid password "<senha>"
    And clicks the Login button
    Then the system should authenticate the user successfully
    And the user should be redirected to the Home screen

    Examples:
      | sistema      | url                                   | email                 | senha         |
      | Broker       | wleocadio+fedexccx@zuumapp.com      | wleocadio@zuumapp.com | 250328123wW! |
      | Super Admin  | https://stage-super-admin.zuumapp.com/| wleocadio@zuumapp.com | 250328123wW! |
      | Carrier      | https://stage-carrier.zuumapp.com/    | wleocadio@zuumapp.com | 250328123wW! |
