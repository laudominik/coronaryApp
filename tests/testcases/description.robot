*** Settings ***
Documentation     Test for description page
Library         SeleniumLibrary
Resource          ../resource.robot
Suite Teardown       Close Browser

*** Test Cases ***
Open Browser To Description Page
    Open Browser    ${APP URL}    ${BROWSER}
    Element Text Should Be    id:pageTitle    3D X-ray angiography
Open Automatic Page
    Click Element    id:go_button_0
    Wait Until Location Contains    automatic
    Go Back
Open Manual Page
    Click Element    id:go_button_1
    Wait Until Location Contains    manual
    Go Back
Open Generator Page
    Click Element    id:go_button_2
    Wait Until Location Contains    generation
    Go Back