module.exports = {
    elements: {

        loginDialog:"#loginDialog",
        loginDialog_title: "#loginDialog_title",

        userLoginNameLabel:'label[for="user_name"]',
        userLoginPasswordLabel:'label[for="user_password"]',

        userLoginNameInput: '#user_name',
        userLoginPasswordInput: '#user_password',


        loginDialog_submitBtn:{
            selector:'//div[@id="loginDialog"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="Войти"]',
            locateStrategy:'xpath'
        },
        loginDialog_cancelBtn:{
            selector:'//div[@id="loginDialog"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="Отмена"]',
            locateStrategy:'xpath'
        }
    }
};