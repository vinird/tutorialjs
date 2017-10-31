
/*
* Date         Version     Modified By                  Description
* 2017-10-24   0.1.0       vinird (GitHub user)         Alpha release
*/

var Tutorial = {
    // GLOBALS
    startIndex: 0, // Start point
    endIndex: 0, // End point
    selector: '.tutorial', // Jquery selector
    onlyOnce: false, // It is used to evaluate if the tutorial only runs onces (it uses cookies)
    styles: true, // It adds custom styles to the each container
    bodyScroll: false, // Defines if the body tag is used to scroll. If false it will use html tag
    removeAnimationConflicts: false,
    
    btnFramework: 'semantic', // Set which framework is used to give styles to buttons
    
    btnFinishText: 'Finish', // Finish button text
    btnFinishClass: 'ui button tiny basic', // Finish button CSS class
    
    btnNextText: 'Next', // Next button text
    btnNextClass: 'ui button tiny primary', // Next button CSS class
    
    // Do not override!
    tutorialCount: -999, // Init the tutorial popups steps count
    scrollSelector: null, // Jquery scroll selector (body or html)
    resolve: null, // Promise success callback
    reject:  null, // Promise error callbacks

    /*
    * @return boolean
    *
    * Validate if the start index is correct
    */
    start: () => 
    {
        Tutorial.tutorialCount = Tutorial.startIndex;
        if(Tutorial.removeAnimationConflicts) {
            $('.animated').css('animation', 'unset'); // Remove animate animations of elements to avoid conflicts in the stack context of the HTML
        }
        if(Tutorial.bodyScroll) {
            Tutorial.scrollSelector = 'body';
        } else {
            Tutorial.scrollSelector = 'html';            
        }

        // Initialize the tutorial count every time
        Tutorial.tutorialCount = 0;

        // Set this last index
        $(Tutorial.selector).each(function() {
            var index = parseFloat($(this).attr('tutorial-index'));
            if (index > Tutorial.endIndex) {Tutorial.endIndex = index};
        })

        // Tutorial.styles          = styles;
        // Tutorial.selector        = selector; // JQuery selector
        // Tutorial.onlyOnce        = onlyOnce;
        return new Promise((resolve, reject) => 
            {
                Tutorial.resolve = resolve;
                Tutorial.reject  = reject;
                if(!Tutorial.checkOnlyOnce(Tutorial.onlyOnce) && Tutorial.validateStart()) {
                    Tutorial.checkBtnClass()
                    Tutorial.createDimmer();
                    Tutorial.initialAnimation();
                }
            }
        )
    },

    /*
    * Set CSS classes to the buttons
    */
    checkBtnClass: () => {
        if(Tutorial.btnFramework == 'custom') {
            // Custom styles for buttons
        } else if(Tutorial.btnFramework == 'bootstrap') {
            Tutorial.btnFinishClass = 'btn btn-sm btn-default';
            Tutorial.btnNextClass = 'btn btn-sm btn-primary';
        } else if(Tutorial.btnFramework == 'materialize') {
            Tutorial.btnFinishClass = 'waves-effect btn';
            Tutorial.btnNextClass = 'waves-effect waves-light btn';
        } else {
            Tutorial.btnFinishClass = 'ui button tiny basic';
            Tutorial.btnNextClass = 'ui button tiny primary';
        }
    },

    /*
    * @return boolean
    *
    * Validate if the start index is correct
    */
    validateStart: () => {
        if($( Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']')[0] == undefined) {
            Tutorial.reject('Incorrect start index');
            return false
        } 
        return true 
    },

    /*
    * @param onlyOnce:boolean
    *
    * @return boolean
    *
    * Check if the tutorial should runs only one time
    */
    checkOnlyOnce: (onlyOnce) => {
        let path = 'Tutorial-route-' + window.location.pathname;
        if(onlyOnce) {
            let check = Tutorial.checkCookie(path)
            if (check) {
                Tutorial.resolve('onlyOnce');
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
        let vh = document.documentElement.clientHeight;
        vh = vh / 3;
        $(Tutorial.scrollSelector).animate(
            { 
                scrollTop: $( Tutorial.selector +'[ tutorial-index='+Tutorial.tutorialCount+']').offset().top - vh
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
        Tutorial.checkEndIndex();
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
            Tutorial.resolve("finished"); // Promise success
        }
        Tutorial.tutorialCount++; // Increase global turorial iteration
    },

    /*
    * Check if the index meet the endIndex
    */
    checkEndIndex: () => {
        if(Tutorial.endIndex < Tutorial.tutorialCount) {
            Tutorial.sanitizeZindex();
            Tutorial.tutorialCount = -999;
            Tutorial.resolve("outOfIndex"); // Promise success
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
            if($('.tutorial_dimmer')[0] == undefined) {
                let element = '<div style="margin: 0px; padding: 0px; background: #000; opacity: 0; height: 100%; width: 100%; z-index: 999; top: -100%; position: fixed; overflow: hidden;" class="tutorial_dimmer"></div>';
                $("html").append(element);
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
        let title = $(Tutorial.selector +'[ tutorial-index='+count+']').attr('tutorial-title') // Popup title
        let text = $(Tutorial.selector +'[ tutorial-index='+count+']').attr('tutorial-text') // Popup body text
        // Set popup html for all the tutorial elements
        let popUpHtml =
            '<strong>' + title + '</strong>'+
            '<p> ' + text + '</p>'+
            '<button class="'+Tutorial.btnFinishClass+'" tutotrial-val="'+Tutorial.selector +'[ tutorial-index='+count+']'+'" count="'+count+'" onclick="Tutorial.finishTutorial(this)">'+Tutorial.btnFinishText+'</button>';
        // If this tutorial element is not the last one, then add next button
        if (Tutorial.endIndex != Tutorial.tutorialCount) {
          popUpHtml += '<button tutotrial-val="'+Tutorial.selector +'[ tutorial-index='+count+']'+'" class="'+Tutorial.btnNextClass+'" onclick="Tutorial.closePopup(this, '+count+')">'+Tutorial.btnNextText+'</button>';
        }
        return popUpHtml;
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
            $(Tutorial.scrollSelector).animate({ scrollTop: parseInt(scroll) }, "slow", ()=>{
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
        let vh = document.documentElement.clientHeight;
        vh = vh / 3;
        let position = element.offset().top;
        return position - vh;
    },

    /*
    * @param element:string
    *
    * Finish tutorials and resolve the Promise with 'cancelled' message
    */
    finishTutorial: (element) => {
        // if this element is the last one, resolves with 'finished' message
        if (Tutorial.tutorialCount - 1 == Tutorial.endIndex) {
          Tutorial.resolve('finished');
        } else {
          Tutorial.resolve('canceled');
        }
        let popupName = $(element).attr('tutotrial-val');
        $(popupName).popup('hide')
        Tutorial.sanitizeZindex(true);
        Tutorial.tutorialCount = -999;
    },

    /*
    * Shows custom dimmer
    */
    showDimmer: () => {
        $('.tutorial_dimmer').css('top','0');
        $('.tutorial_dimmer').animate({opacity: 0.4});
    },

    /*
    * Hides custom dimmer
    */
    hideDimmer: () => {
        $('.tutorial_dimmer').animate({opacity: 0},()=>{
            $('.tutorial_dimmer').css('top','-100%');
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
