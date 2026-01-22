Feature: Broker Change Password
  As a Broker
  I want to change my password
  So that I can keep my account secure

  Scenario: Change password successfully and re-login
    Given I am logged in as a "Broker"
    When I navigate to "Settings" then "Account"
    And I click on "Change Password" button
    And I fill the "Current Password" with my current password
    And I fill the "New Password" with a new generated password
    And I fill the "Confirm Password" with the new generated password
    And I click the "Change Password" submit button
    Then I should see a success message "Success! Your Password has"
    When I logout using the user menu
    And I confirm the logout
    Then I should be redirected to the login page
    When I login with the new password
    Then I should be successfully logged in
