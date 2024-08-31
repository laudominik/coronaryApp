*** Settings ***
Documentation     Test for e2e reconstruction
Library         SeleniumLibrary     plugins=SeleniumTestability;True;30 Seconds;True
Resource          ../resource.robot
Suite Teardown       Close Browser

*** Test Cases ***
Open Browser To Generator Page
    Open Browser    ${GENERATOR URL}    ${BROWSER}
    Element Text Should Be    id:pageTitle    X-ray generation
Add Projections
    Click Button    id:addButton
    Element Should Be Visible    id:row_0
    Click Button    id:addButton
    Element Should Be Visible    id:row_1
    Click Button    id:addButton
    Element Should Be Visible    id:row_2
Set Projections Params
    Setup Sids Sods
    Setup Angles
Run Generation
    Click Button    id:startGeneration
    Wait Until Generation Succeeds
Load to automatic reconstruction
    Click Button    id:loadToAuto
    Wait Until Location Contains    automatic
Run automatic reconstruction
    Click Button    id:startReconstruction
    Wait Until Reconstruction Succeeds
Back To Generator
    Go Back
    Wait Until Location Contains    generation
# TODO: the same for manual
# Load to manual reconstruction
#     Click Button    id:loadToManual
#     Wait Until Location Contains    manual
#     Go Back

*** Keywords ***
Setup Sids Sods
    Input Text    css:td#row_0_sid input   1.2
    Input Text    css:td#row_0_sod input   0.75
    Input Text    css:td#row_1_sid input   1.2
    Input Text    css:td#row_1_sod input   0.75
    Input Text    css:td#row_2_sid input   1.2
    Input Text    css:td#row_2_sod input   0.75
Setup Angles
    Input Text    css:td#row_1_alpha input    90
    Input Text    css:td#row_2_beta input    90
Wait Until Generation Succeeds
    Wait Until Page Contains Element    xpath://tr[@id='row_0']/td[@class='generated']
    Wait Until Page Contains Element    xpath://tr[@id='row_1']/td[@class='generated']
    Wait Until Page Contains Element    xpath://tr[@id='row_2']/td[@class='generated']
Wait Until Reconstruction Succeeds
    Wait Until Keyword Succeeds    5 seconds    1 second    Reconstruction Keys Are Not Null
Reconstruction Keys Are Not Null
    ${vessel val}=    Get Storage Item    vessel    sessionStorage
    ${rects val}=    Get Storage Item    rects    sessionStorage
    ${shadows val}=    Get Storage Item    shadows    sessionStorage
    ${centerlines val}=    Get Storage Item    centerlines    sessionStorage
    ${bifurcations val}=    Get Storage Item    bifurcations    sessionStorage
    Should Not Be Equal    ${vessel val}    ${None}
    Should Not Be Equal    ${rects val}    ${None}
    Should Not Be Equal    ${shadows val}    ${None}
    Should Not Be Equal    ${centerlines val}    ${None}
    Should Not Be Equal    ${bifurcations val}    ${None}