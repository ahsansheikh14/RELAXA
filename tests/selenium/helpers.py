import json
import urllib.error
import urllib.request

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from conftest import (
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    API_ROOT,
    BASE_URL,
    USER_EMAIL,
    USER_NAME,
    USER_PASSWORD,
    pause,
)


def ensure_test_user_exists():
    """Register the test user via API if they do not exist yet."""
    payload = json.dumps(
        {
            "name": USER_NAME,
            "email": USER_EMAIL.strip(),
            "password": USER_PASSWORD,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"{API_ROOT}/auth/register",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            response.read()
    except urllib.error.HTTPError as error:
        if error.code == 409:
            return
        body = error.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Could not create test user ({error.code}): {body}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(
            "Backend not reachable. Start backend with: cd backend && npm run dev"
        ) from error


def login_admin(driver, wait):
    driver.get(f"{BASE_URL}/admin/login")
    wait.until(EC.presence_of_element_located((By.ID, "admin-email"))).clear()
    driver.find_element(By.ID, "admin-email").send_keys(ADMIN_EMAIL)
    driver.find_element(By.ID, "admin-password").clear()
    driver.find_element(By.ID, "admin-password").send_keys(ADMIN_PASSWORD)
    driver.find_element(By.CSS_SELECTOR, "button.admin-login-submit").click()
    wait.until(EC.url_contains("/admin/dashboard"))
    pause()


def login_user(driver, wait):
    ensure_test_user_exists()

    driver.get(f"{BASE_URL}/login")
    wait.until(EC.presence_of_element_located((By.ID, "email")))

    login_tab = driver.find_element(By.XPATH, "//button[contains(@class,'tab') and normalize-space()='Login']")
    if "active" not in (login_tab.get_attribute("class") or ""):
        login_tab.click()
        pause(0.3)

    email_input = driver.find_element(By.ID, "email")
    password_input = driver.find_element(By.ID, "password")
    email_input.clear()
    email_input.send_keys(USER_EMAIL)
    password_input.clear()
    password_input.send_keys(USER_PASSWORD)

    driver.find_element(By.CSS_SELECTOR, "form.auth-form button.submit-btn").click()

    try:
        wait.until(EC.url_contains("/dashboard"))
    except TimeoutException:
        errors = driver.find_elements(By.CSS_SELECTOR, ".auth-error")
        detail = errors[0].text.strip() if errors else "Login did not redirect to /dashboard"
        raise AssertionError(
            f"User login failed: {detail}. "
            f"Check USER_EMAIL={USER_EMAIL} and USER_PASSWORD in tests/selenium/.env"
        ) from None

    pause()


def visit_user_page(driver, wait, path, marker_xpath):
    """Open a protected user route and wait for page content."""
    driver.get(f"{BASE_URL}{path}")
    wait.until(EC.url_contains(path))
    wait.until(EC.presence_of_element_located((By.XPATH, marker_xpath)))
    pause(0.5)


def click_user_nav(driver, wait, path):
    """Click a top navbar link (Dashboard, Exercises, Reports)."""
    selector = f"nav.user-navbar__links a[href='{path}']"
    link = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", link)
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    driver.execute_script("arguments[0].click();", link)
    wait.until(EC.url_contains(path))
    pause(0.5)
