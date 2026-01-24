from django.core.cache import cache

def rate_limit(key, limit=5, timeout=600):
    count = cache.get(key, 0)
    if count >= limit:
        return False
    cache.set(key, count + 1, timeout=timeout)
    return True
