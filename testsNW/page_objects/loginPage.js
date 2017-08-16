var loginCommands = {
  loginAsAdmin:function(){
      return this.waitForElementVisible('@loginDialog')
          .assert.valueContains("@userLoginNameInput","")
          .assert.valueContains("@userLoginPasswordInput","")
          .setValue("@userLoginNameInput",'admin')
          .setValue("@userLoginPasswordInput",'admin')
          .click("@loginDialog_submitBtn");
  }
};


module.exports = {
    commands:[loginCommands],
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