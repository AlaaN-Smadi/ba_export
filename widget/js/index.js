'use strict';

let ui_elements = {}, api_options = {appId:'', email:'', type:''};

function validate_api(){
    if(!api_options.appId){
        return ui_elements.appId_input.classList.add('required-input');
    }
    if(!api_options.email){
        return ui_elements.email_input.classList.add('required-input');
    }
    if(!api_config[api_options.type]){
        return ui_elements.dropDownBtn.classList.add('required-input');
    }
    return fetch_BA_data(api_options);
}

function init_listeners(){
    ui_elements.dropDownBtn.addEventListener('click', (event)=>{
        event.stopPropagation();
        toggleDropdown();
    });

    ui_elements.exportBtn.addEventListener('click', ()=>{
        api_options.appId = ui_elements.appId_input.value;
        api_options.email = ui_elements.email_input.value;
        validate_api();
    })
    
    ui_elements.userDataType.addEventListener('click', (event)=>{
        event.stopPropagation();
        api_options.type = api_config["USER_DATA"];
       
        ui_elements.typeBtn.innerHTML = 'Users<span class="material-icons material-icons-outlined">expand_more</span>'
        toggleDropdown();
    })
    
    ui_elements.eventDataType.addEventListener('click', (event)=>{
        event.stopPropagation();
        api_options.type = api_config["EVENTS_DATA"];
        let a=document.createElement('a')

        ui_elements.typeBtn.innerHTML = 'Events<span class="material-icons material-icons-outlined">expand_more</span>'
        toggleDropdown();
    })

    ui_elements.locationDataType.addEventListener('click', (event)=>{
        event.stopPropagation();
        api_options.type = api_config["LOCATION_DATA"];
        
        ui_elements.typeBtn.innerHTML = 'Locations<span class="material-icons material-icons-outlined">expand_more</span>'
        toggleDropdown();
    })

    document.body.addEventListener('click', () => {
        toggleDropdown(true);
    });
}

function toggleDropdown(forceClose){
    if(ui_elements.dropDownBtn.classList.contains("open") || forceClose){
        ui_elements.dropDownBtn.classList.remove('open');
    }else ui_elements.dropDownBtn.classList.add('open');
}

function init(){
    ui_elements={
        dropDownBtn : document.getElementById('item-data-type'),
        typeBtn : document.getElementById('input-type-btn'),
        exportBtn: document.getElementById('export-data'),
        userDataType: document.getElementById('user-data'),
        locationDataType: document.getElementById('locations-data'),
        eventDataType: document.getElementById('event-data'),
        email_input: document.getElementById('spAdminEmail'),
        appId_input : document.getElementById('spAppId'),
    }

    init_listeners();
}
