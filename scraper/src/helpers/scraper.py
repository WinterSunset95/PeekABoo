import sys
import os
sys.path.append(os.path.abspath(os.path.join("..")))

import time
import logging
from CloudflareBypassForScraping.CloudflareBypasser import CloudflareBypasser
from DrissionPage import ChromiumPage, ChromiumOptions


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('cloudflare_bypass.log', mode='w')
    ]
)

isHeadless = os.getenv('HEADLESS', 'false').lower() == 'true'

if isHeadless:
    from pyvirtualdisplay.display import Display
    display = Display(visible=False, size=(1920,1080))
    display.start()

browserPath = os.getenv('CHROME_PATH', '/usr/bin/google-chrome')

arguments = [
    "-no-first-run",
    "-force-color-profile=srgb",
    "-metrics-recording-only",
    "-password-store=basic",
    "-use-mock-keychain",
    "-export-tagged-pdf",
    "-no-default-browser-check",
    "-disable-background-mode",
    "-enable-features=NetworkService,NetworkServiceInProcess,LoadCryptoTokenExtension,PermuteTLSExtensions",
    "-disable-features=FlashDeprecationWarning,EnablePasswordsAccountStorage",
    "-deny-permission-prompts",
    "-disable-gpu",
    "-accept-lang=en-US",
]

options = ChromiumOptions().auto_port()
options.set_paths(browser_path=browserPath)
for argument in arguments:
    options.set_argument(argument)

driver = ChromiumPage(addr_or_opts=options)

def scrape(url: str) -> str | None:

    try:
        logging.info("Starting the scraper")
        driver.get(url)
        cfBypasser = CloudflareBypasser(driver)
        logging.info("Starting cloudflare bypass")
        cfBypasser.bypass()
        return driver.html
    except Exception as e:
        logging.error("An error occured: %s", str(e))
    finally:
        logging.info("Closing the browser")


