import trafilatura


# get the html content of the url, which is passed to gemini to summarise
def get_content(url):

    try:
        downloaded = trafilatura.fetch_url(url)
        response = trafilatura.extract(
            downloaded, include_comments=False,
            include_tables=False,
            include_links=False,
        )
        return response
    except Exception as e:
        return None
