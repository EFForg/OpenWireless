import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class SecondTimeChangePasswordAttempt(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_second_attempt_yields_error(self):
        driver = self.driver
        driver.get("http://gw.home.lan/changePassword.html?first_time=true")

        pass_field = driver.find_element_by_id("newPassword")
        pass_field.send_keys("asdf1234")

        pass_conf_field = driver.find_element_by_id("retypePassword")
        pass_conf_field.send_keys("asdf1234")

        submit_button = driver.find_element_by_css_selector('#outerContainer > div > form > input[type="submit"]:nth-child(11)')
        submit_button.click()

        error_message = "Server Error: Administrator password has already been set."
        error_field = WebDriverWait(driver, 5).until(
            EC.text_to_be_present_in_element((By.ID, "genericError"), error_message)
        )

        self.assertNotEqual(error_field, None)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()

