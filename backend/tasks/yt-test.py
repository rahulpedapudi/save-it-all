from yt_dlp import YoutubeDL


def handle_youtube(url):
    with YoutubeDL({'quiet': True}) as ydl:
        info = ydl.extract_info(url, download=False)

        return {
            "title": info.get("title"),
            "channel": info.get("uploader"),
            "thumbnail": info.get("thumbnail"),
            # "description": info.get("description"),
            "tags": info.get("tags", []),
        }


# Example
data = handle_youtube("https://www.youtube.com/watch?v=_DHiyzRN4gY")
print(data)
