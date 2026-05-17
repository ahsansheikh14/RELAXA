"""
Assignment 3 — Selenium CRUD tests for Admin Exercise Management (Relaxa).

Run: pytest test_crud_exercises.py -v
Requires: backend + frontend running, valid admin credentials in .env
"""

import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

from conftest import BASE_URL, pause
from helpers import login_admin

EXERCISE_TITLE = f"Selenium Test Exercise {int(time.time())}"
UPDATED_TITLE = f"{EXERCISE_TITLE} Updated"


def test_crud_exercise_full_flow(driver, wait):
  login_admin(driver, wait)

  # CREATE
  driver.get(f"{BASE_URL}/admin/exercises/new")
  wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[name="title"]')))
  driver.find_element(By.CSS_SELECTOR, 'input[name="title"]').send_keys(EXERCISE_TITLE)
  driver.find_element(By.CSS_SELECTOR, 'input[name="category"]').send_keys("Testing")
  Select(driver.find_element(By.CSS_SELECTOR, 'select[name="targetMood"]')).select_by_visible_text("Calm")
  driver.find_element(By.CSS_SELECTOR, 'textarea[name="description"]').send_keys(
    "Created by Selenium for Assignment 3 CRUD test."
  )
  driver.find_element(By.CSS_SELECTOR, "button.admin-primary-btn").click()
  wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".admin-section-info")))
  pause(0.8)

  # READ
  driver.get(f"{BASE_URL}/admin/content")
  search = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".admin-search-box input")))
  search.clear()
  search.send_keys(EXERCISE_TITLE)
  pause(1)
  card = wait.until(
    EC.presence_of_element_located(
      (By.XPATH, f"//article[contains(@class,'exercise-card')]//h3[contains(text(), '{EXERCISE_TITLE}')]")
    )
  )
  assert card.is_displayed()

  # UPDATE
  edit_link = driver.find_element(
    By.XPATH,
    f"//article[contains(@class,'exercise-card')]//h3[contains(text(), '{EXERCISE_TITLE}')]/ancestor::article//a[contains(text(),'Edit')]",
  )
  edit_link.click()
  wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[name="title"]')))
  title_input = driver.find_element(By.CSS_SELECTOR, 'input[name="title"]')
  title_input.clear()
  title_input.send_keys(UPDATED_TITLE)
  driver.find_element(By.CSS_SELECTOR, "button.admin-primary-btn").click()
  wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".admin-section-info")))
  pause(0.8)

  driver.get(f"{BASE_URL}/admin/content")
  search = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".admin-search-box input")))
  search.clear()
  search.send_keys(UPDATED_TITLE)
  pause(1)
  wait.until(
    EC.presence_of_element_located(
      (By.XPATH, f"//article[contains(@class,'exercise-card')]//h3[contains(text(), '{UPDATED_TITLE}')]")
    )
  )

  # DELETE
  delete_btn = driver.find_element(
    By.XPATH,
    f"//article[contains(@class,'exercise-card')]//h3[contains(text(), '{UPDATED_TITLE}')]/ancestor::article//button[contains(@class,'danger-btn')]",
  )
  delete_btn.click()
  pause(0.3)
  alert = wait.until(EC.alert_is_present())
  alert.accept()
  pause(1)

  search = driver.find_element(By.CSS_SELECTOR, ".admin-search-box input")
  search.clear()
  search.send_keys(UPDATED_TITLE)
  pause(1)
  cards = driver.find_elements(
    By.XPATH, f"//article[contains(@class,'exercise-card')]//h3[contains(text(), '{UPDATED_TITLE}')]"
  )
  assert len(cards) == 0
