import os
import time

import pytest
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "http://localhost:5173")
API_ROOT = os.getenv("API_ROOT", "http://localhost:5000/api/v1")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@relaxa.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "RelaxaAdmin@2026")
USER_EMAIL = os.getenv("USER_EMAIL", "testuser@example.com")
USER_PASSWORD = os.getenv("USER_PASSWORD", "test12345")
USER_NAME = os.getenv("USER_NAME", "Selenium Test User")


@pytest.fixture
def driver():
    options = Options()
    if os.getenv("HEADLESS", "").lower() == "true":
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1400,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(3)
    yield browser
    browser.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 15)


def pause(seconds=0.4):
    time.sleep(seconds)
