var Tutorial = {
    // GLOBALS
    selector, // CSS class selector
    tutorialCount, // Init the tutorial popups steps count
    endIndex: null, // The final point of index
    onlyOnce, // It is used to evaluate if the tutorial only runs onces
    styles: null, // It is used to evaluate if the tutorial only runs onces
    resolve: null, // Promise success callback
    reject:  null, // Promise error callbacks

    start: (_selector, _startIndex = 0, _endIndex = 999, _styles = false, _onlyOnce = false) => 
    {
        Tutorial.styles          = _styles;
        Tutorial.selector        = _selector; // JQuery selector
        Tutorial.tutorialCount   = _startIndex; // Initialize the tutorial count every time
        Tutorial.endIndex        = _endIndex; // Set the last index
        Tutorial.onlyOnce        = _onlyOnce;
        return new Promise((resolve, reject) => 
            {
                Tutorial.resolve = resolve;
                Tutorial.reject  = reject;
                if(!Tutorial.checkOnlyOnce(_onlyOnce)) {
                    Tutorial.createDimmer();
                    Tutorial.initialAnimation();
                }
            }
        )
    },

    checkOnlyOnce: (_onlyOnce) => {
        let path = 'Tutorial-route-' + window.location.pathname;
        if(_onlyOnce) {
            let check = Tutorial.checkCookie(path)
            if (check) {
                Tutorial.resolve('outOfIndex');
                return true;
            } else {
                Tutorial.setCookie(path, true, 999)
            }
        } else {
            Tutorial.setCookie(path, '', 999)
        }
        return false;
    },

    /*
    * Init first animation and trigger the firts popup
    */
    initialAnimation: () => {
        $("body").animate(
            { 
                scrollTop: $( Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']').offset().top / 2
            }, 
            "slow", 
            ()=>{
                Tutorial.triggerTutorialPopups(); // Start triggering popups 
            }
        );
    },

    /*
    * Recursive function to trigger popups
    */
    triggerTutorialPopups: () => {
        Tutorial.showDimmer() // Shows the background dimmer
        Tutorial.checkEndindex();
        Tutorial.checkStyles();
        if($(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']')[0] != undefined) { // If the tutorial step is not undefined
            $(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']')
            .popup({
              position : 'top center', // Position of the popup
              on       : 'manual', // Popup trigger method
              html     : Tutorial.renderHtmlTutorial(Tutorial.tutorialCount), // Define the custom HTML for the popup
              onRemove : () => {
                Tutorial.triggerTutorialPopups(); // Recursive event triggered when the popup is removed
              }
            }); // Define the popup
            
            $(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']').popup('show'); // Shows the popup
        } else {
            Tutorial.hideDimmer(); // Hides the background dimmer
            Tutorial.resolve("finished");
            // swal('', 'Tutorial completado') // When the tutorial is completed
        }
        Tutorial.tutorialCount++; // This is added to .tutorial class in order to find them
    },

    /*
    * Check if the index meet the endIndex
    */
    checkEndindex: () => {
        if(Tutorial.endIndex == Tutorial.tutorialCount) {
            Tutorial.sanitizeZindex();
            Tutorial.tutorialCount = -999;
            Tutorial.resolve("endIndex");
            Tutorial.hideDimmer();
            $(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']').popup('hide');
        }
    },

    /*
    * Check if styles option is enable 
    */
    checkStyles: () => {
        if(Tutorial.styles) {
            let previusContainer = $(Tutorial.selector +'[ tutorial-index='+(Tutorial.tutorialCount - 1)+']');
            previusContainer.css(
                {
                    'position': 'auto',
                }
            )
            let container = $(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']');
            container.css(
                {
                    'position': 'relative',
                }
            )
        }
    },

    /*
    * Create the HTML dimmer with inline styles 
    */
    createDimmer: () => {
        $(document).ready(()=>{
            if($('.custom_dimmer')[0] == undefined) {
                let element = '<div style="background: #000; opacity: 0; height: 100%; width: 100%; z-index: 999; top: -100%; position: fixed; overflow: hidden;" class="custom_dimmer"></div>';
                $("body").append(element);
            }
        });
    },

    /*
    * @param count:int // index
    *
    * @return string
    *
    * Create the HTML content of the popup 
    */
    renderHtmlTutorial: (count) => {
        Tutorial.sanitizeZindex();
        let title = $(Tutorial.selector +'[ tutorial-index='+count+']').attr('tutorial-title') // Title
        let text = $(Tutorial.selector +'[ tutorial-index='+count+']').attr('tutorial-text') // Body text
        $('.animated').css('animation', 'unset'); // Remove animations of elements to avoid conflicts in the stack context of the HTML
        return ''+ // Returns the HTML
            '<strong>' + title + '</strong>'+
            '<p> ' + text + '</p>'+
            '<button class="ui button tiny basic" tutotrial-val="'+Tutorial.selector +'[ tutorial-index='+count+']'+'" count="'+count+'" onclick="Tutorial.finishTutorial(this)">Terminar</button>'+
            '<button tutotrial-val="'+Tutorial.selector +'[ tutorial-index='+count+']'+'" class="ui button tiny primary" onclick="Tutorial.closePopup(this, '+count+')">Siguiente</button>';
    },

    /*
    * @param finish:boolean // Optional
    *
    * Set the z-index value for the containers
    */
    sanitizeZindex: (finish = false) => {
        $(Tutorial.selector +'[ tutorial-index='+(Tutorial.tutorialCount - 1)+']').css('z-index', 'auto') // Remove z-index property from the last opened popup
        if(!finish) {
            $(Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']').css('z-index', '1000') // Asign the z-index property for the current popup
        }
    },

    /*
    * @param element:Jquery:element
    * @param count:int
    *
    * Closes the previus popup and scrolls to the next element
    */
    closePopup: (element, count) => {
        let oldPopup = $(element).attr('tutotrial-val');
        if($(Tutorial.selector +'[ tutorial-index='+(count + 1)+']').offset() != undefined) {
            let element = $(Tutorial.selector +'[ tutorial-index='+(count + 1)+']');
            let scroll = Tutorial.calcPopUpPosition(element);
            $("body").animate({ scrollTop: parseInt(scroll) }, "slow", ()=>{
                $(oldPopup).popup('hide')
            });
        } else {
            $(oldPopup).popup('hide')
        }
    },

    /*
    * @param element:Jquery:element
    *
    * @return float
    *
    * Calculate the top position of the element given 
    */
    calcPopUpPosition: (element) => {
        return (element.offset().top / 2);
    },

    /*
    * @param element:string
    *
    * Finish tutorials and resolve the Promise with 'cancelled' message
    */
    finishTutorial: (element) => {
        Tutorial.resolve('cancelled')
        let popupName = $(element).attr('tutotrial-val');
        $(popupName).popup('hide')
        Tutorial.sanitizeZindex(true);
        Tutorial.tutorialCount = -999;
    },

    /*
    * Shows custom dimmer
    */
    showDimmer: () => {
        $('.custom_dimmer').css('top','0');
        $('.custom_dimmer').animate({opacity: 0.4});
    },

    /*
    * Hides custom dimmer
    */
    hideDimmer: () => {
        $('.custom_dimmer').animate({opacity: 0},()=>{
            $('.custom_dimmer').css('top','-100%');
        });
    },

    /*
    * @param cname:string // Name of the cookie
    * @param cvalue:string // Value of the cookie
    * @param exdays:int // Days to expire
    *
    * Set cookie value using cname
    */
    setCookie: (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    
     /*
    * @param cname:string // Name of the cookie
    *
    * @return string // Value of the cookie
    *
    * Get the value of a cookie
    */
    getCookie: (cname) => {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    
     /*
    * @param cookie:string // Name of the cookie
    *
    * @return boolean // True if exists
    *
    * Check if the cookie exists
    */
    checkCookie: (cookie) => {
        var _cookie = getCookie(cookie);
        if (_cookie != "") {
            return true;
        } else {
            return false;
        }
    }
}