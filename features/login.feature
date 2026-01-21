Feature: User Authentication
  As a user of the Zuum platforms (Broker, Carrier, Super Admin)
  I want to log in with my credentials
  So that I can access the system features

  Scenario Outline: Successful Login
    Given I navigate to the <system> login page
    When I enter valid email "<email>"
    And I enter valid password "<password>"
    And I click the Login button
    Then I should be successfully logged in
    And I should be redirected to the dashboard

    Examples:
      | system      | email                           | password      |
      | Broker      | wleocadio+fedexccx@zuumapp.com  | 250328123wW!  |
      | Carrier     | wleocadio+2@zuumapp.com         | 250328123wW!  |
      | Super Admin | wleocadio@zuumapp.com           | 250328123wW!  |

  Scenario Outline: Login with Invalid Credentials
    Given I navigate to the <system> login page
    When I enter valid email "<email>"
    And I enter an incorrect password "WrongPassword123!"
    And I click the Login button
    Then I should see an error message "Invalid email or password"

    Examples:
      | system      | email                           |
      | Broker      | wleocadio+fedexccx@zuumapp.com  |
      | Carrier     | wleocadio+2@zuumapp.com         |
      | Super Admin | wleocadio@zuumapp.com           |

  Scenario Outline: Login with Invalid Email Format
    Given I navigate to the <system> login page
    When I enter an invalid email format "invalid-email-format"
    And I click on the password field
    Then I should see a validation error "Invalid email format"

    Examples:
      | system      |
      | Broker      |
      | Carrier     |
      | Super Admin |

  Scenario Outline: Login Button Disabled for Empty Fields
    Given I navigate to the <system> login page
    When I leave the email and password fields empty
    Then the Login button should be disabled

    Examples:
      | system      |
      | Broker      |
      | Carrier     |
      | Super Admin |
