import json
import asyncio
from playwright.async_api import async_playwright
import aiofiles

SEMAPHORE_LIMIT = 5  # Controls the number of concurrent scrapes
RETRY_LIMIT = 2  # Number of retries for failed scrapes

async def scrape_bigbasket(start_url, semaphore):
    """Scrapes product data from BigBasket using Playwright with concurrency control."""
    async with semaphore:
        for attempt in range(RETRY_LIMIT):
            try:
                async with async_playwright() as p:
                    browser = await p.chromium.launch(headless=True)
                    context = await browser.new_context(
                        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                    )
                    page = await context.new_page()

                    print(f"[{attempt+1}/{RETRY_LIMIT}] Navigating to: {start_url}")
                    await page.goto(start_url, timeout=20000)
                    await page.wait_for_selector("ul.mt-5", timeout=10000)  # Wait for product list container

                    product_containers = await page.query_selector_all("ul.mt-5")
                    scraped_data = []
                    
                    for container in product_containers:
                        products = await container.query_selector_all("div.SKUDeck___StyledDiv-sc-1e5d9gk-0")
                        print(f"Found {len(products)} products on {start_url}")
                        
                        for product in products:
                            scraped_data.append({
                                "name": await (await product.query_selector("h3.block")).inner_text() if await product.query_selector("h3.block") else None,
                                "image": await (await product.query_selector("img")).get_attribute("src") if await product.query_selector("img") else None,
                                "quantity": await (await product.query_selector("span.PackChanger___StyledLabel-sc-newjpv-1")).inner_text() if await product.query_selector("span.PackChanger___StyledLabel-sc-newjpv-1") else None,
                                "mrp": (await (await product.query_selector("span.Pricing___StyledLabel2-sc-pldi2d-2")).inner_text()).replace("₹", "").strip() if await product.query_selector("span.Pricing___StyledLabel2-sc-pldi2d-2") else None,
                                "price": (await (await product.query_selector("span.Pricing___StyledLabel-sc-pldi2d-1")).inner_text()).replace("₹", "").strip() if await product.query_selector("span.Pricing___StyledLabel-sc-pldi2d-1") else None,
                                "discount": await (await product.query_selector("span.font-semibold")).inner_text() if await product.query_selector("span.font-semibold") else None,
                            })

                    await browser.close()
                    return scraped_data

            except Exception as e:
                print(f"Error on attempt {attempt+1} for {start_url}: {e}")
                if attempt == RETRY_LIMIT - 1:
                    print(f"Failed to scrape {start_url} after {RETRY_LIMIT} attempts.")
    
    return []

async def main():
    """Main function to handle concurrent scraping efficiently and store output in a single list."""
    with open("input_bigbasket.json", "r") as f:
        start_urls = json.load(f)

    start_urls = [url for url in start_urls if url.startswith("https://www.bigbasket.com")]  # Filter valid URLs

    semaphore = asyncio.Semaphore(SEMAPHORE_LIMIT)

    tasks = [scrape_bigbasket(url, semaphore) for url in start_urls]
    results = await asyncio.gather(*tasks)

    # Flatten results into a single list
    all_data = [item for sublist in results for item in sublist]

    # Save data in JSON format
    async with aiofiles.open("output_bigbasket.json", "w") as f:
        await f.write(json.dumps(all_data, indent=4))

    print("Scraping completed. Data saved to output_bigbasket.json")

if __name__ == "__main__":
    asyncio.run(main())
