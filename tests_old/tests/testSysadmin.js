var tnw= require('../testNW');
module.exports= {
    'Sysadmin Header Tests': function (browser) {

        tnw.start(browser, {url: 'http://localhost:8080/sysadmin'})
            //.assertElementVisible({
            //    parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
            //    tag: 'img'
            //})

          //  .assertElementVisible({parentClass: 'sysadmin_TopContent', id:"divMODE", tag: 'b', text: 'MODE'})

            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'b', text: 'MODE'
            })


            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'b', text: 'PORT'
            })
            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'b', text: 'DB NAME'
            })
            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'b', text: 'USER'
            })
            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'b', text: 'DB CONNECTION STATE'
            })

            .assertElementVisible({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'span', text: 'Startup params'
            });
    },
    'Sysadmin Startup params tests': function (browser) {
        tnw
            .clickDojoButton({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'span', text: 'Startup params'
            })
            .checkDojoToggleButtonSelected({
                parentClass: 'dijitBorderContainer dijitContainer sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitBorderContainer dijitBorderContainerPane dijitAlignTop dijitLayoutContainer',
                tag: 'span',
     text: 'Startup params'
            })

          //  .assertElementVisible({class: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild'})
            .assertElementVisible({
                parentClass: 'dijitContentPane',
                tag: "b",
                text: 'system startup parameters'
            })
            .assertElementVisible({
                parentClass: 'dijitContentPane',
                tag: "b",
                text: 'Configuration loaded.'
            })


            .assertElementVisible({
            //    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',

                tag: "label",
                text: 'db.host'
            })
            .assertElementVisible({
             //   parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "b",
                text: 'Configuration loaded.'
            })
            .assertElementVisible({
               // parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "label",
                text: 'db.name'
            })
            .assertElementVisible({
              //  parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "label",
                text: 'db.user'
            })
            .assertElementVisible({
               // parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "label",
                text: 'db.password'
            })
            .assertInputContainsValue("localhost")
            .assertInputContainsValue("sample_sinta")
            .assertInputContainsValue("user")


            .assertElementVisible({
               // parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                class:"dijitReset dijitInline dijitButtonText",
                tag: "span",
                text: 'Load settings'
            })
            .clickDojoButton({
              //  parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                class:"dijitReset dijitInline dijitButtonText",
                tag: 'span', text: 'Load settings'
            })
            .assertElementVisible({
               // parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "b",
                text: 'Configuration reloaded.'
            })


            .assertElementVisible({
                parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "span",
                text: 'Store settings & reconnect to database'
            })
            .clickDojoButton({
                parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: 'span', text: 'Store settings & reconnect to database'
            })
            .assertElementVisible({
                parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "b",
                text: 'Configuration saved.'
            })
            .assertElementVisible({
                parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                tag: "b",
                text: 'Reconnected to database.'
            });
    ;},

        'Sysadmin DB Buttons tests': function (browser) {
            tnw
           .assertElementVisible({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: "span",
                    text: 'Create DB'
                })
                .assertElementVisible({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: "span",
                    text: 'Drop DB'
                })
                .assertElementVisible({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: "span",
                    text: 'Backup DB'
                })
                .assertElementVisible({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: "span",
                    text: 'Restore DB'
                })

                .clickDojoButton({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: 'span', text: 'Create DB'
                })
                .assertElementVisible({
                    tag: "div",
                    class: 'dijitDialog dijitDialogFocused dijitFocused'
                })

                .assertInputContainsValue("root")
                .enterPasswordToInput("Rty1988")
                .clickDojoButton({
                    parentClass: "dijit dijitReset dijitInline dijitButton",
                    text: "Login", tag: 'span'
                })
                .assertElementVisible({
                    tag: "b",
                    text:"FAIL! Reason:Impossible to create DB!"
                })
            //Check Header DB Info
                .assertElementVisible({
                   parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"test"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"8080"
               })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"sample_sinta"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"user"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"Connected"
                })

                //Drop DB
                .clickDojoButton({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: 'span', text: 'Drop DB'
                })
                .assertElementVisible({
                    tag: "div",
                    class: 'dijitDialog dijitDialogFocused dijitFocused'
                })
                .assertInputContainsValue("root")
                .enterPasswordToInput("Rty1988")
                .clickDojoButton({
                    parentClass: "dijit dijitReset dijitInline dijitButton",
                    text: "Login", tag: 'span'
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"Failed to connect to database!"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane",
                    tag: "b",
                    text:"Failed connect to database !"
                })

            //Create DB
                .clickDojoButton({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: 'span', text: 'Create DB'
                })
                .assertElementVisible({
                    tag: "div",
                    class: 'dijitDialog dijitDialogFocused dijitFocused'
                })

                .assertInputContainsValue("root")
                .enterPasswordToInput("Rty1988")
                .clickDojoButton({
                    parentClass: "dijit dijitReset dijitInline dijitButton",
                    text: "Login", tag: 'span'
                })

                .assertElementVisible({
                    parentClass:"dijitContentPane",
                    tag: "div",
                    text:"Database created!"
                })

                //Check Header DB Info
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"test"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"8080"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"sample_sinta"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"user"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"Connected"
                })

            // Restore DB
                .clickDojoButton({
                    parentClass: 'dijitContentPane dijitStackContainer-child dijitStackContainer-dijitContentPane dijitContentPaneSingleChild',
                    tag: 'span', text: 'Restore DB'
                })
                .assertElementVisible({
                    tag: "div",
                    class: 'dijitDialog dijitDialogFocused dijitFocused'
                })

                .assertInputContainsValue("root")
                .enterPasswordToInput("Rty1988")
                .clickDojoButton({
                    parentClass: "dijit dijitReset dijitInline dijitButton",
                    text: "Login", tag: 'span'
                })

                .assertElementVisible({
                    parentClass:"dijitDialogTitleBar",
                    class:"dijitDialogTitle",
                    tag: "span",
                    text:"Restore from file"
                })

                // Refer to ID
                .clearInputValueById("//input[@id=\"restore_fileName\"]")
                .setInputValueById("//input[@id=\"restore_fileName\"]", "sinta")

                .assertElementPresent("//*[@class=\"dijitDialogTitleBar\"]//span[contains(text(), 'Restore from file')]/ancestor::*[@role=\"dialog\"][1]//*[@class=\"dijitReset dijitInline dijitButtonText\" and  contains(text(), 'Restore')]")
                .clickDojoRestoreButton("//*[@class=\"dijitDialogTitleBar\"]//span[contains(text(), 'Restore from file')]/ancestor::*[@role=\"dialog\"][1]//*[@class=\"dijitReset dijitInline dijitButtonText\" and  contains(text(), 'Restore')]")

                .assertElementVisible({
                    parentClass:"dijitContentPane",
                    tag: "div",
                    text:"Db dump file restored successfully"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane",
                    tag: "b",
                    text:"Configuration saved."
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane",
                    tag: "b",
                    text:"Reconnected to database."
                })

                //Check Header DB Info
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"test"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "b",
                    text:"8080"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"sample_sinta"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"user"
                })
                .assertElementVisible({
                    parentClass:"dijitContentPane sysadmin_TopContent dijitBorderContainer-child dijitBorderContainer-dijitContentPane dijitBorderContainerPane dijitAlignTop",
                    tag: "span",
                    text:"Connected"
                })

            ;browser.end();
        }
};