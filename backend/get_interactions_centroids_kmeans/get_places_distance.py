import math

def get_places_distance (lat1, lon1, lat2, lon2):
    earth_radius = 6371.0088
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)

    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    sin_half_delta_lat = math.sin(delta_lat/2)
    sin_half_delta_lon = math.sin(delta_lon/2)

    a = sin_half_delta_lat ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * sin_half_delta_lon ** 2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = earth_radius * c
    return distance
