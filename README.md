# Flexible-LIMS-v2
**Laboratory Test Records System with user configurable tests**

https://flexlims.herokuapp.com/

Medical laboratories perform multiple tests, sometimes 30-40 different tests,
eg: Lipid profile, Full Blood Count. When creating a record management
system for such a lab, there are multiple ways to define the tests and
provide UI to enter records. One is to define all tests at the beginning, and
hard-code UI and DB for each test - this is better performance-wise but is
not flexible. The client has to come back to the developer to
add/update/remove forms.
This project addresses these issues and presents a full lab test record management system (web
application) integrating a flexible form schema solution. The users will be
able to create/read/update/delete test forms and use them to save test
results so the patients can view them.

