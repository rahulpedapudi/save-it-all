from celery_worker import celery
import logging
from pymongo import MongoClient
import os
from bson import ObjectId
import requests
from bs4 import BeautifulSoup
from config import Config

# Set up logging
logger = logging.getLogger(__name__)


# Function to get a MongoDB client and database
def get_db():
    client = MongoClient(Config.MONGO_URI)
    db = client["db"]
    return db


def enrich(link_url: str) -> dict:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        resp = requests.get(link_url, headers=headers, timeout=10)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch {link_url}: {e}")
        return {"og_title": None, "og_description": None, "og_preview_image": None}

    soup = BeautifulSoup(resp.text, "html.parser")

    data = {
        "og_title": (soup.find("meta", property="og:title") or {}).get("content"),
        "og_description": (soup.find("meta", property="og:description") or {}).get("content"),
        "og_preview_image": (soup.find("meta", property="og:image") or {}).get("content"),
        "status": "completed"
    }

    return data


@celery.task(name='enrich_link_task')
def enrich_link_task(link_id):
    db = get_db()

    logger.info(f"Enriching link with ID: {link_id}")

    try:
        link = db.links.find_one({"_id": ObjectId(link_id)})
        if not link:
            logger.warning(f"No link found for ID {link_id}")
            return None

        if link.get("status") == "pending":
            scraped_data = enrich(link["url"])

            result = db.links.update_one(
                {"_id": ObjectId(link_id)}, {"$set": scraped_data})

            if result.matched_count == 0:
                logger.info("Link not found in DB during update")
            elif result.modified_count == 0:
                logger.info("No new data to update")
            else:
                logger.info("Successfully enriched link")

            return scraped_data
        else:
            return None

    except Exception as e:
        logger.error(f"Error enriching link {link_id}: {e}")
        return None
