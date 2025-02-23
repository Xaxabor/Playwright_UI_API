import { authenticator } from 'otplib'; // OTP library
//import * as OTPAuth from 'otpauth'; // OTP library  


const login= async(page , username, password, secretCode) => {
    const microsoftSignInButton = page.locator('//span[text()="Sign in with Microsoft"]');
    const emailTextbox =  page.locator('//input[@type="email"]');
    const nextButton =  page.locator('//input[@value="Next"]');
    const passwordTextbox =  page.locator('//input[@type="password"]');
    const signInButton =  page.locator('//input[@value="Sign in"]');
    const signInAnotherWayText =  page.locator('//a[@id="signInAnotherWay"]');
    const useVerificationCodeText =  page.locator('//div[text()="Use a verification code"]');
    const codeTextbox =  page.locator('//input[@id="idTxtBx_SAOTCC_OTC"]');
    const verifyButton =  page.locator('//input[@value="Verify"]');
    const dontShowAgainCheckbox =  page.locator('//input[@name="DontShowAgain"]');
    const yesButton =  page.locator('//input[@value="Yes"]');

    await  microsoftSignInButton.click();
    await  emailTextbox.fill(username);
    await  nextButton.click();
    await  passwordTextbox .fill(password);
    await  signInButton.click();
    await  signInAnotherWayText.click();
   
    try{
        await  useVerificationCodeText.click();
        const otp = authenticator.generate(secretCode);
        // const otp = new OTPAuth.TOTP({
        //     algorithm: 'SHA1',
        //     digits: 6,
        //     period: 30,
        //     secret: secretCode
        // });
        console.log(`Genrated OTP: ${otp}`);
        await  codeTextbox.fill(otp);
        await page.pause()
        await  verifyButton.click();
        await page.waitForTimeout(30000);
        await  dontShowAgainCheckbox.click();
        await  yesButton.click();
    }
    catch(e){
        console.log(`No MFA required : ${e}`);
    }
}

module.exports = {login};