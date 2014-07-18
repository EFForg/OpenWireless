import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Login (unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_login_redirects_to_dashboard (self):
        driver = self.driver
        driver.get("http://gw.home.lan/login.html")

        pass_field = driver.find_element_by_id("password")
        pass_field.send_keys("asdf1234")

        submit_button = driver.find_element_by_id('submit')
        submit_button.click()
        
        successful_redirect = WebDriverWait(driver, 5).until(
            EC.text_to_be_present_in_element((By.CSS_SELECTOR, "body > div > header > h1"), "Dashboard")
        )

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()

