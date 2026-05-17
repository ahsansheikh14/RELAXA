"""
Smoke tests — user login and main pages load.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from helpers import click_user_nav, login_admin, login_user, visit_user_page


def test_user_login_and_navigation(driver, wait):
    login_user(driver, wait)
    assert "/dashboard" in driver.current_url

    # Navbar navigation (fixed selectors — more reliable than LINK_TEXT)
    click_user_nav(driver, wait, "/exercises")
    wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(),'Daily Exercises')]")))

    click_user_nav(driver, wait, "/reports")
    wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(),'Your Emotional Journey')]")))

    click_user_nav(driver, wait, "/dashboard")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h1.dashboard-title")))


def test_user_pages_direct_access(driver, wait):
    """After login, each main user URL loads (backup smoke coverage)."""
    login_user(driver, wait)

    visit_user_page(driver, wait, "/dashboard", "//h1[contains(@class,'dashboard-title')]")
    visit_user_page(driver, wait, "/exercises", "//h1[contains(text(),'Daily Exercises')]")
    visit_user_page(driver, wait, "/reports", "//h1[contains(text(),'Your Emotional Journey')]")


def test_admin_login_dashboard(driver, wait):
    login_admin(driver, wait)
    assert "/admin/dashboard" in driver.current_url
    wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),'User Management')]")))
