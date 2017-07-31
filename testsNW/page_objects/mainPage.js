module.exports = {
    url: 'http://localhost:8080',
    elements: {
        img: "#main_TopImg",
        mode: '#main_app_mode',

        mainMenuItem: '#main_MainMenu',
        popupMenuDirsItem: '#menuBarPopupMenuDirs',
        menuBarItemCloseItem: '#menuBarItemClose',
        menuBarItemHelpAboutItem: '#menuBarItemHelpAbout',

        aboutProgramDialog:"#DialogSimple",

        aboutProgramDialog_submitBtn:{
            selector:'//div[@id="DialogSimple"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="OK"]',
            locateStrategy:'xpath'
        },
        aboutProgramDialog_cancelBtn:{
            selector:'//div[@id="DialogSimple"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="Закрыть"]',
            locateStrategy:'xpath'
        },


        tablist_PageContentPane_mainPage:"#main_ContentContainer_tablist_PageContentPane_mainPage",
        mainpage_MainContent:"#mainpage_MainContent",

        menuBarPopupMenuDirs_menu:"#menuBarPopupMenuDirs_menu",
        menuBarDirsItemUnits:"#menuBarDirsItemUnits",
        menuBarDirsItemContractors:"#menuBarDirsItemContractors",


        main_ContentContainer_tablist_PageContentPane_mainDirUnits:"#main_ContentContainer_tablist_PageContentPane_mainDirUnits",
        closeTabMainDirUnits:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_mainDirUnits"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },

        main_ContentContainer_tablist_PageContentPane_mainDirContractors:"#main_ContentContainer_tablist_PageContentPane_mainDirContractors",
        closeTabMainDirContractors:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_mainDirContractors"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },

        finishedContentPane:"#finish"
    }
};