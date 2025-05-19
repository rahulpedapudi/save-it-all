import newspaper
from keybert import KeyBERT
from difflib import get_close_matches
from bs4 import BeautifulSoup
import requests

kw_model = None

USER_TAGS = [
    # Technology & Gadgets
    "tech", "gadgets", "innovation", "digital", "electronics", "devices",
    "future tech", "emerging tech", "smart devices", "wearables", "hardware", "consumer tech",
    # Gaming
    "video games", "games", "consoles", "xbox", "playstation", "nintendo",
    "multiplayer", "gameplay", "e-sports", "gamer", "online gaming", "pc gaming",
    # Apple
    "iphone", "macbook", "ios", "apple watch", "ipad", "mac", "tim cook",
    "apple event", "apple store", "apple news", "apple ecosystem",
    # Google & Android
    "android", "pixel", "chrome", "google maps", "google search", "google drive",
    "google docs", "google cloud", "gmail", "google assistant", "google play",
    # Epic Games
    "fortnite", "unreal engine", "epic store", "epic launcher", "epic exclusives",
    "epic lawsuit", "epic games news",
    # Security & Privacy
    "data protection", "security", "user privacy", "encryption", "surveillance",
    "online safety", "privacy concerns", "tracking", "data breach", "identity protection",
    # News & Media
    "breaking news", "headlines", "updates", "current events", "press",
    "journalism", "media", "daily news", "trending news", "news alert",
    # Mobile Apps
    "iphone apps", "apple software", "ios update", "ios device", "ios 17", "ios settings",
    "android phone", "android apps", "android update", "android os", "android security", "android tips",
    # Business & Finance
    "startup", "company", "entrepreneur", "leadership", "business news",
    "industry", "corporate", "strategy", "management", "investment", "commerce",
    "stocks", "crypto", "banking", "budget", "money", "trading",
    "financial news", "markets", "economy",
    # Health & Wellness
    "wellness", "fitness", "medicine", "healthcare", "mental health", "exercise",
    "nutrition", "covid", "healthy lifestyle", "doctors", "public health",
    # Education
    "learning", "schools", "online courses", "university", "students", "teachers",
    "edtech", "exams", "homework", "tutorials", "higher education",
    # Politics & Government
    "elections", "government", "policy", "law", "politicians", "democracy",
    "voting", "debates", "campaign", "parliament", "president", "ministers",
    # Artificial Intelligence
    "artificial intelligence", "machine learning", "chatbot", "deep learning",
    "neural networks", "generative ai", "openai", "ai tools", "ai models",
    "automation", "computer vision",
    # Software & Development
    "apps", "programs", "tools", "development", "desktop software", "code editors",
    "installers", "open source", "updates", "bug fixes",
    # Startups & Funding
    "founders", "funding", "venture capital", "pitch", "tech startup", "launch",
    "growth", "startup news", "accelerator", "seed round", "unicorns",
    # Controversy & Social
    "scandal", "backlash", "drama", "legal battle", "boycott", "criticism",
    "conflict", "dispute", "public outcry", "viral outrage",
    # App Store & Mobile
    "ios apps", "app review", "mobile apps", "app submission", "store guidelines",
    "app rejections", "developer account", "app listings", "in-app purchases",
    # Mobile Gaming
    "smartphone games", "app games", "android games", "ios games", "game updates",
    "casual games", "gaming apps", "mobile esports",
    # User-friendly/general tags
    "how-to", "tips", "guide", "review", "comparison", "best practices", "troubleshooting",
    "beginner", "advanced", "explained", "introduction", "overview", "step by step",
    "tutorial", "quick start", "faq", "pros and cons", "features", "benefits",
    "user experience", "customer support", "feedback", "community", "resources",
    "recommendations", "top picks", "latest trends", "updates", "news", "insights",
    "analysis", "predictions", "future", "basics", "examples", "case study",
    "success story", "story", "interview", "opinion", "editorial", "discussion",
    "explainer", "walkthrough", "demo", "test", "hands-on", "first look"
]


def map_tags(kw, general_tags=USER_TAGS):
    mapped = set()
    for w in kw:
        matches = get_close_matches(w.lower(), USER_TAGS)
        if matches:
            for _ in matches:
                mapped.add(_)
    return list(mapped)


def generate_tags(url):
    global kw_model
    if kw_model is None:
        kw_model = KeyBERT()
    try:
        article = newspaper.Article(url)
        article.download()
        article.parse()
        article.nlp()
        doc = article.title + '. ' + article.text
        news_tags = article.keywords

        raw_keywords = kw_model.extract_keywords(
            doc, keyphrase_ngram_range=(1, 1), stop_words='english')
        raw_keybert_tags = [kw[0] for kw in raw_keywords]
        matched_tags = map_tags(raw_keybert_tags)

        tags = raw_keybert_tags + matched_tags
        return tags
    except Exception as e:
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            title = soup.title.string if soup.title else ""
            description = soup.find("meta", {"name": "description"})
            og_title = soup.find("meta", property="og:title")
            details = {
                "title": og_title['content'] if og_title else title,
                "description": description['content']
            }

            beautiful_soup_tags = kw_model.extract_keywords(
                f"{details['title']}. {details['description']}")
            return beautiful_soup_tags
        except Exception as eNew:
            return None
